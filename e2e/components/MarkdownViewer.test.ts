import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('MarkdownViewer', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-markdownviewer--default',
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

  test.describe('Interactive', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-markdownviewer--interactive',
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

  test.describe('Link Interception', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-markdownviewer--link-interception',
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
