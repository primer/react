import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('TextInput', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinput--default',
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
        id: 'components-forms-textinput--with-leading-visual',
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

  test.describe('With Loading Indicator', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinput--with-loading-indicator',
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

  test.describe('With Trailing Action', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinput--with-trailing-action',
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

  test.describe('With Trailing Icon', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinput--with-trailing-icon',
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
