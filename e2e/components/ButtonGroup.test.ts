import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('ButtonGroup', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-buttongroup--default',
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

  test.describe('Playground', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-buttongroup--playground',
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
