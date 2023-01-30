import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Dialog', () => {
  test.describe('Basic Dialog', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-dialog--basic-dialog',
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

  test.describe('Stress Test', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-dialog--stress-test',
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

  test.describe('With Custom Renderers', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-dialog--with-custom-renderers',
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
