import type {Page} from '@playwright/test'

/**
 * Helper specifically for working with images in storybook. Unfortunately, the
 * `waitUntil: 'networkidle'` option does not work well with storybook during
 * development as there is always a connection listening for updates.
 */
export async function waitForImages(page: Page) {
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'))
    await Promise.all(
      images.map(img => {
        if (img.complete) {
          return
        }
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve)
          img.addEventListener('error', reject)
        })
      }),
    )
  })
}
