import type {Page} from '@playwright/test'

export async function waitForAllAnimations(page: Page) {
  // await page
  //   .locator(`#storybook-root`)
  //   .evaluate(element => Promise.all(element.getAnimations({subtree: true}).map(animation => animation.finished)))

  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(250)
}
