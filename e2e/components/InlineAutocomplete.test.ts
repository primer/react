import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('InlineAutocomplete', () => {
  test.describe('Custom Rendering', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-inlineautocomplete--custom-rendering',
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
        id: 'components-forms-inlineautocomplete--default',
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

  test.describe('Single Line', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-inlineautocomplete--single-line',
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
