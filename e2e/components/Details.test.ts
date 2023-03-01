import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Details', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-details--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state - closed
          expect(await page.screenshot()).toMatchSnapshot(`Details.Default.${theme}.png`)
          await page.getByRole('button', {name: 'See Details'}).click()
          // Open state
          expect(await page.screenshot()).toMatchSnapshot(`Details.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-details--default',
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
