import {test, expect} from '@playwright/test'
import {visit} from '../../test-helpers/storybook'
import {themes} from '../../test-helpers/themes'

test.describe('SelectPanel', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.getByText('Assign label').click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `drafts.SelectPanel.Default.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel--default',
            globals: {
              colorScheme: theme,
            },
          })
          await page.getByText('Assign label').click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
