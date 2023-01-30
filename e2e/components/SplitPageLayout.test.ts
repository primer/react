import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('SplitPageLayout', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-splitpagelayout--default',
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

  test.describe('Settings Page', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-splitpagelayout--settings-page',
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
