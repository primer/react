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
          // Click the summary to open
          await page.getByText('See Details').click()
          await page.getByText('This is some content').waitFor()
          // Open state
          expect(await page.screenshot()).toMatchSnapshot(`Details.Default.${theme}.open.png`)
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
                enabled: false,
              },
            },
          })
        })
      })
    }
  })
})
