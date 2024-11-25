import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-confirmationdialog--default',
    args: {
      open: true,
    },
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
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
              args: 'args' in story ? story.args : {},
            })

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
              args: 'args' in story ? story.args : {},
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
