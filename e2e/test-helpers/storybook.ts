import {Page} from '@playwright/test'
import {waitForImages} from './waitForImages'

interface Options {
  id: string
  globals?: Record<string, string>
}

const {STORYBOOK_URL = 'http://localhost:6006'} = process.env

export async function visit(page: Page, options: Options) {
  const {id, globals} = options
  // In CI, the static server strips `.html` extensions
  const url = process.env.CI ? new URL(`${STORYBOOK_URL}/iframe`) : new URL(`${STORYBOOK_URL}/iframe.html`)

  url.searchParams.set('id', id)
  url.searchParams.set('viewMode', 'story')

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

  await page.goto(url.toString())
  await page.waitForSelector('.sb-show-main')
  await waitForImages(page)
}
