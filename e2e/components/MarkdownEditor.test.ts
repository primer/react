import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('MarkdownEditor', () => {
  test.describe('Custom Buttons', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-markdowneditor--custom-buttons',
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

  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-markdowneditor--default',
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

  test.describe('Lazy Loaded Suggestions', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-markdowneditor--lazy-loaded-suggestions',
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
