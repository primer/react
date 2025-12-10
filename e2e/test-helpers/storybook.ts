import fs from 'node:fs'
import {parseSync, traverse, types as t} from '@babel/core'
import type {Page} from '@playwright/test'
import {kebabCase} from 'change-case'
import {waitForImages} from './waitForImages'

type Value =
  | string
  | boolean
  | number
  | {
      [Key: string]: Value
    }

interface Options {
  id: string
  args?: Record<string, string | boolean>
  globals?: Record<string, Value>
  storybook?: 'react' | 'styled-react'
}

const {STORYBOOK_URL = 'http://localhost:6006', STYLED_REACT_STORYBOOK_URL = 'http://localhost:6007'} = process.env

function getStorybookUrl(storybook: 'react' | 'styled-react' = 'react'): string {
  if (storybook === 'react') {
    return STORYBOOK_URL
  }
  return STYLED_REACT_STORYBOOK_URL
}

async function visit(page: Page, options: Options) {
  const {id, args, globals} = options
  const storybookURL = getStorybookUrl(options.storybook)
  // In CI, the static server strips `.html` extensions
  const url = process.env.CI ? new URL(`${storybookURL}/iframe`) : new URL(`${storybookURL}/iframe.html`)

  url.searchParams.set('id', id)
  url.searchParams.set('viewMode', 'story')

  if (args) {
    const serialized = Object.entries(args)
      .map(([key, value]) => `${key}:${value}`)
      .join(';')
    url.searchParams.set('args', serialized)
  }

  if (globals) {
    let params = ''
    for (const [key, value] of Object.entries(globals)) {
      if (params !== '') {
        params += ';'
      }
      if (typeof value === 'object') {
        params += serializeObject(value, key)
      } else {
        params += `${key}:${value}`
      }
    }
    url.searchParams.set('globals', params)
  }

  /** Mock live avatar urls to make them stable for visual diffing (vrt) */
  await page.route('https://github.com/*.png', async route => {
    await route.continue({url: 'https://github.com/primer.png'})
  })

  await page.goto(url.toString())
  await page.waitForSelector('body.sb-show-main:not(.sb-show-preparing-story)')
  await page.waitForSelector('#storybook-root > *', {state: 'attached'})

  await waitForImages(page)
}

function serializeObject<T extends {[Key: string]: Value}>(object: T, parentPath: string): string {
  return Object.entries(object)
    .map(([key, value]) => {
      if (typeof value === 'object') {
        return serializeObject(value, `${parentPath}.${key}`)
      }
      return `${parentPath}.${key}:${serialize(value)}`
    })
    .join(';')
}

function serialize(value: Value): string {
  if (typeof value === 'boolean') {
    return `!${value}`
  }

  return `${value}`
}

function getStories(filepath: string): Array<{title: string; id: string}> {
  const contents = fs.readFileSync(filepath, 'utf-8')
  const ast = parseSync(contents, {
    sourceType: 'module',
    parserOpts: {
      plugins: ['typescript', 'jsx'],
    },
  })

  let storyTitle = ''
  const exports: Array<string> = []

  traverse(ast!, {
    ExportDefaultDeclaration(path) {
      if (t.isObjectExpression(path.node.declaration)) {
        const titleProperty = path.node.declaration.properties.find(prop => {
          return t.isObjectProperty(prop) && t.isIdentifier(prop.key) && prop.key.name === 'title'
        })

        if (titleProperty && t.isObjectProperty(titleProperty) && t.isStringLiteral(titleProperty.value)) {
          storyTitle = titleProperty.value.value
        }
      }
    },

    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        if (t.isVariableDeclaration(path.node.declaration)) {
          path.node.declaration.declarations.forEach(declarator => {
            if (t.isIdentifier(declarator.id)) {
              exports.push(declarator.id.name)
            }
          })
        }
      }
    },
  })

  return exports.map(name => {
    return {
      title: name,
      id: getStorybookId(storyTitle, name),
    }
  })
}

function getStorybookId(title: string, storyName: string): string {
  const group = title
    .split('/')
    .map(part => part.toLowerCase())
    .join('-')
  const story = kebabCase(storyName)
  return `${group}--${story}`
}

export {visit, getStories}
