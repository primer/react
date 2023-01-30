import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('IssueLabelToken', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-issuelabeltoken--default-token',
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
        id: 'components-issuelabeltoken--interactive',
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

  test.describe('With On Remove Fn', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-issuelabeltoken--with-on-remove-fn',
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
