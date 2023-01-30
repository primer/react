import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('RelativeTime', () => {
  test.describe('Count Down Timer', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-relativetime--count-down-timer',
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
        id: 'components-relativetime--default',
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

  test.describe('Micro Format', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-relativetime--micro-format',
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

  test.describe('Recent Time', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-relativetime--recent-time',
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
