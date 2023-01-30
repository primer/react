import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('CheckboxGroup', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-checkboxgroup-examples--default',
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

  test.describe('With External Label', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-checkboxgroup-fixtures--with-external-label',
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

  test.describe('With Hidden Label', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-checkboxgroup-fixtures--with-hidden-label',
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
