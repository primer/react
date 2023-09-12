import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Tooltip', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-tooltip--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Tooltip open state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Tooltip.Default.${theme}.open.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-tooltip--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
