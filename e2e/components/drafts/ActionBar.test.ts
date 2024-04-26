import {test, expect} from '@playwright/test'
import {visit} from '../../test-helpers/storybook'
import {themes} from '../../test-helpers/themes'

test.describe('ActionBar', () => {
  test.describe('CommentBox', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-actionbar--comment-box',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.getByText('Write').click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `drafts.ActionBar.CommentBox.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-actionbar--comment-box',
            globals: {
              colorScheme: theme,
            },
          })
          await page.getByText('Write').click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
