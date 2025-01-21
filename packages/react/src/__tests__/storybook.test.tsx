import glob from 'fast-glob'
import {stories, ROOT_DIRECTORY, allowlist} from '../utils/testing'
import groupBy from 'lodash.groupby'
import fs from 'node:fs'
import path from 'node:path'

const components = Object.entries(
  groupBy(stories, ({name}) => {
    return name
  }),
)

describe.each(components)('%s', (_component, stories) => {
  for (const {story, type, relativeFilepath} of stories) {
    describe(`${story.default.title} (${relativeFilepath})`, () => {
      test('title follows naming convention', () => {
        // Matches:
        // - title: 'Components/TreeView'
        // Does not match:
        // -  title: 'Component/TreeView/Features'
        // -  title: 'TreeView'
        const defaultTitlePattern = /Components\/\w+/

        // Matches:
        // - title: 'Components/TreeView/Features'
        // Does not match:
        // -  title: 'Component/TreeView'
        // -  title: 'TreeView'
        const featureTitlePattern = /Components\/\w+\/Features/

        expect(story.default.title).toMatch(type === 'default' ? defaultTitlePattern : featureTitlePattern)
      })

      if (type === 'default') {
        test('exports a Default story', () => {
          expect(story.Default).toBeDefined()
        })

        test('Default story does not have `args`', () => {
          expect(story.Default.args).not.toBeDefined()
        })

        test('Default story does not have `argTypes`', () => {
          expect(story.Default.argTypes).not.toBeDefined()
        })

        test('only exports Default and Playground stories', () => {
          for (const storyName of Object.keys(story)) {
            expect(/^Default$|^(.*)Playground$|^default$/.test(storyName)).toBe(true)
          }
        })
      }
    })
  }
})

const jsonFiles = glob
  .sync('src/**/*.docs.json', {
    cwd: ROOT_DIRECTORY,
  })
  .filter(filepath => {
    const name = path.basename(filepath, '.docs.json')
    return allowlist.includes(name)
  })

describe.each(jsonFiles)('%s', filepath => {
  test('has a corresponding .stories.tsx file', () => {
    const storyFilepath = path.join(ROOT_DIRECTORY, filepath.replace('.docs.json', '.stories.tsx'))
    expect(fs.existsSync(storyFilepath)).toBe(true)
  })
})
