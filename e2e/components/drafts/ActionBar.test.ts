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
            id: 'experimental-components-actionbar-examples--comment-box',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot()).toMatchSnapshot(`drafts.ActionBar.CommentBox.${theme}.png`)
        })
      })
    }
  })

  test.describe('Groups', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-actionbar-examples--with-groups',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot()).toMatchSnapshot(`drafts.ActionBar.WithGroups.${theme}.png`)
        })
      })
    }
  })

  test.describe('ActionBar Interactions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('Overflow interaction @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-actionbar-examples--comment-box',
            globals: {
              colorScheme: theme,
            },
          })
          const toolbarButtonSelector = `button[data-component="IconButton"]`
          await expect(page.locator(toolbarButtonSelector)).toHaveCount(10)
          await page.setViewportSize({width: viewports['primer.breakpoint.xs'], height: 768})
          await page.getByLabel('Task List').waitFor({
            state: 'hidden',
          })
          await expect(page.locator(toolbarButtonSelector)).toHaveCount(8)
          const moreButtonSelector = page.getByLabel('More Comment box toolbar items')
          await moreButtonSelector.click()
          await expect(page.locator('ul[role="menu"] [role="menuitem"]')).toHaveCount(3)
        })
      })
    }
  })
})
