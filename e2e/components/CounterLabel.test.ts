import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-counterlabel--default',
  },
  {
    title: 'Primary Theme',
    id: 'components-counterlabel-features--primary-theme',
  },
  {
    title: 'Secondary Theme',
    id: 'components-counterlabel-features--secondary-theme',
  },
] as const

test.describe('CounterLabel', () => {
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

            // Default state
            await expect(page).toHaveScreenshot(`CounterLabel.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
