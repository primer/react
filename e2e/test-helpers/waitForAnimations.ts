import type {Page} from '@playwright/test'

export function waitForAllAnimations(page: Page) {
  return page
    .locator(`#storybook-root`)
    .evaluate(element => Promise.all(element.getAnimations({subtree: true}).map(animation => animation.finished)))
}
