import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('ConfirmationDialog', () => {
  test.describe('Basic Confirmation Dialog', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-confirmationdialog--basic-confirmation-dialog',
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

  test.describe('Shorthand Hook', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-confirmationdialog--shorthand-hook',
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

  test.describe('Shorthand Hook From Action Menu', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-confirmationdialog--shorthand-hook-from-action-menu',
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
