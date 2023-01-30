import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Link', () => {
  test.describe('Link', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-link--link-story',
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
