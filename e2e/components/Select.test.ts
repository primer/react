import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Select', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-select--default',
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

  test.describe('With Option Groups', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-select--with-option-groups',
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
