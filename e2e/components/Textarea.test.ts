import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Textarea', () => {
  test.describe('Textarea', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textarea--textarea-story',
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
