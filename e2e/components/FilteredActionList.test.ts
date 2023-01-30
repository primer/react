import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('FilteredActionList', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-filteredactionlist--default',
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
