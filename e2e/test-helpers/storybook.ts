import type {Page} from '@playwright/test'
import {waitForImages} from './waitForImages'

interface Options {
  id: string
  args?: Record<string, string | boolean>
  globals?: Record<string, string>
}

const {STORYBOOK_URL = 'http://localhost:6006'} = process.env

export async function visit(page: Page, options: Options) {
  const {id, args, globals} = options
  // In CI, the static server strips `.html` extensions
  const url = process.env.CI ? new URL(`${STORYBOOK_URL}/iframe`) : new URL(`${STORYBOOK_URL}/iframe.html`)

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
        params += '&'
      }
      params += `${key}:${value}`
    }
    url.searchParams.set('globals', params)
  }

  /** Mock live avatar urls to make them stable for visual diffing (vrt) */
  await page.route('https://github.com/*.png', async route => {
    await route.continue({url: 'https://github.com/primer.png'})
  })

  await page.goto(url.toString())
  await page.waitForSelector('body.sb-show-main:not(.sb-show-preparing-story)')
  await page.waitForSelector('#storybook-root > *')

  await waitForImages(page)
}
