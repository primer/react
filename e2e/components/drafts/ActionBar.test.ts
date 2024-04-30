import {test, expect} from '@playwright/test'
import {visit} from '../../test-helpers/storybook'
import {themes} from '../../test-helpers/themes'
import {viewports} from '../../test-helpers/viewports'

test.describe('ActionBar', () => {
  test.describe('Default state', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-actionbar--comment-box',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot()).toMatchSnapshot(`drafts.ActionBar.CommentBox.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-actionbar--comment-box',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('ActionBar Interactions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('Overflow interaction @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-actionbar--comment-box',
            globals: {
              colorScheme: theme,
            },
          })

          await page.setViewportSize({width: viewports['primer.breakpoint.sm'], height: 768})
          await page.locator('button', {hasText: 'More Comment Box Items'}).waitFor()
          await page.getByText('Saved Replies').click()
        })
      })
    }
  })
})
