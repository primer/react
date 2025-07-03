import type {Page} from '@playwright/test'

export async function waitForAllAnimations(page: Page) {
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(250)
}
