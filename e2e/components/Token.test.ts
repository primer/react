import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Token', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-token--default-token',
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
        id: 'components-token--interactive',
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

  test.describe('with leadingVisual', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-token--with-leading-visual',
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
        id: 'components-token--with-on-remove-fn',
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
