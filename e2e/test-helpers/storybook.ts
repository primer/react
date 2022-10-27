import {Page} from '@playwright/test'
import {waitForImages} from './waitForImages'

interface Options {
  story?: string
  id?: string
  globals?: Record<string, string>
}

export async function visit(page: Page, options: Options) {
  const {story, id, globals} = options
  // In CI, the static server strips `.html` extensions
  const url = process.env.CI ? new URL('http://localhost:3000/iframe') : new URL('http://localhost:3000/iframe.html')
  if (id) {
    url.searchParams.set('id', id)
  } else if (story) {
    url.searchParams.set('id', `components-${story}`)
  }

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
