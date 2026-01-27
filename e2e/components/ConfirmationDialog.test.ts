import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-confirmationdialog--default',
  },
  {
    title: 'Playground',
    id: 'components-confirmationdialog--playground',
  },
  {
    title: 'Shorthand Hook',
    id: 'components-confirmationdialog-features--shorthand-hook',
  },
  {
    title: 'Shorthand Hook From Action Menu',
    id: 'components-confirmationdialog-features--shorthand-hook-from-action-menu',
  },
] as const

test.describe('ConfirmationDialog', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('@vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
              args: {open: true},
            })

            // Wait for dialog to be visible
            await page.locator('role=dialog').waitFor({state: 'visible'})

            // Default state
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `ConfirmationDialog.${story.title}.${theme}.png`,
            )

            // Focus state
            await page.keyboard.press('Tab')
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `ConfirmationDialog.${story.title}.focus.${theme}.png`,
            )
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
              args: {open: true},
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
