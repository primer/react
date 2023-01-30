import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Checkbox', () => {
  test.describe('Controlled', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-checkbox--controlled',
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
        id: 'components-forms-checkbox--default',
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

  test.describe('Uncontrolled', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-checkbox--uncontrolled',
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

  test.describe('With Leading Visual', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-checkbox--with-leading-visual',
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
