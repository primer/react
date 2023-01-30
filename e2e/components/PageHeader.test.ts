import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('PageHeader', () => {
  test.describe('Files Page', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-examples--files-page',
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

  test.describe('Files Page On Narrow Viewport', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-examples--files-page-on-narrow-viewport',
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

  test.describe('Pull Request Page', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-examples--pull-request-page',
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
        id: 'drafts-components-pageheader-examples--pull-request-page-on-narrow-viewport',
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
        id: 'drafts-components-pageheader-examples--webhooks',
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
        id: 'drafts-components-pageheader-examples--webhooks-on-narrow-viewport',
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

  test.describe('With Page Layout', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-examples--with-page-layout',
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

  test.describe('Has Large Title', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--has-large-title',
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

  test.describe('Has Title Only', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--has-title-only',
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

  test.describe('With Actions', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--with-actions',
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

  test.describe('With Actions That Have Responsive Content', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--with-actions-that-have-responsive-content',
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

  test.describe('With Context Bar And Actions Of Context Area', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--with-context-bar-and-actions-of-context-area',
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

  test.describe('With Description Slot', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--with-description-slot',
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

  test.describe('With Leading And Trailing Actions', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--with-leading-and-trailing-actions',
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

  test.describe('With Leading And Trailing Visuals', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--with-leading-and-trailing-visuals',
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

  test.describe('With Leading Visual Hidden On Regular Viewport', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--with-leading-visual-hidden-on-regular-viewport',
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

  test.describe('With Navigation Slot', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--with-navigation-slot',
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

  test.describe('With Parent Link And Actions Of Context Area', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-pageheader-features--with-parent-link-and-actions-of-context-area',
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
        id: 'drafts-components-pageheader--playground',
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
