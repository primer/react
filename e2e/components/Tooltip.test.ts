import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Tooltip', () => {
  test.describe('Icon Button Tooltip', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-tooltip-default--icon-button-tooltip',
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
