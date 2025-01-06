import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Dialog v1', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialogv1--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.getByRole('button', {name: 'Show dialog'}).click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Dialogv1.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialogv1--default',
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
