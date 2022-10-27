import {Page} from '@playwright/test'
import {waitForImages} from './waitForImages'

interface Options {
  id: string
  globals?: Record<string, string>
}

export async function visit(page: Page, options: Options) {
  const {id, globals} = options
  // In CI, the static server strips `.html` extensions
  const url = process.env.CI ? new URL('http://localhost:6006/iframe') : new URL('http://localhost:6006/iframe.html')

  url.searchParams.set('id', id)
  url.searchParams.set('viewMode', 'story')

  if (globals) {
    let params = ''
    for (const [key, value] of Object.entries(globals)) {
      if (params !== '') {
        params += '&'
      }
      params += `${key}\:${value}`
    }
    url.searchParams.set('globals', params)
  }

  await page.goto(url.toString())
  await page.waitForSelector('.sb-show-main')
  await waitForImages(page)
}
