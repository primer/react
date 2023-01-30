import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('AvatarStack', () => {
  test.describe('AvatarStack', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-avatarstack--avatar-stack-story',
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
