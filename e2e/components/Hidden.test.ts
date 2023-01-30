import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Hidden', () => {
  test.describe('Pull Request Page', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-hidden-examples--pull-request-page',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Pull Request Page On Narrow Viewport', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-hidden-examples--pull-request-page-on-narrow-viewport',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Webhooks', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-hidden-examples--webhooks',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Webhooks On Narrow Viewport', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-hidden-examples--webhooks-on-narrow-viewport',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Hide Content', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-hidden-features--hide-content',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Render Content Responsively', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-hidden-features--render-content-responsively',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Playground', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-hidden--playground',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })
})
