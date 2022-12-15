import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('AvatarStack', () => {
  test.describe('AvatarStack', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-avatarstack--avatar-stack-story',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`AvatarStack.AvatarStack.${theme}.png`)

          // Hover state
          await page.hover('img')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `AvatarStack.AvatarStack.${theme}.hover.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-avatarstack--avatar-stack-story',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })
      })
    }
  })
})
