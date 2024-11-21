import {test, expect} from '@playwright/test'
import {visit} from '../../test-helpers/storybook'
import {themes} from '../../test-helpers/themes'

const stories: Array<{
  title: string
  id: string
  buttonText?: string
}> = [
  {
    title: 'Default',
    id: 'experimental-components-selectpanel--default',
  },
  {
    id: 'experimental-components-selectpanel-features--as-modal',
    title: 'As Modal',
  },
  {
    id: 'experimental-components-selectpanel-features--external-anchor',
    title: 'External Anchor',
  },
  {
    id: 'experimental-components-selectpanel-features--instant-selection-variant',
    title: 'Instant Selection Variant',
    buttonText: 'Choose a tag',
  },
  {
    id: 'experimental-components-selectpanel-features--with-warning',
    title: 'With Warning',
    buttonText: 'Assignees',
  },
  {
    id: 'experimental-components-selectpanel-features--with-errors',
    title: 'With Errors',
    buttonText: 'Assignees',
  },
] as const

test.describe('SelectPanel', () => {
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
            })

            const buttonText = story.buttonText || 'Assign label'

            // Default state
            await page.getByText(buttonText).click()
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `drafts.SelectPanel.${story.title}.${theme}.png`,
            )
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
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
  }
})
