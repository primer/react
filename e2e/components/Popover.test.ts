import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-popover--default',
  },
  {
    title: 'Playground',
    id: 'components-popover--playground',
  },
  {
    title: 'SX Props',
    id: 'components-popover-dev--sx-props',
  },
  {
    title: 'Popover Overflow',
    id: 'components-popover-dev--popover-overflow',
  },
] as const

test.describe('Popover', () => {
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
            })

            // Default state
            await expect(page).toHaveScreenshot(`Popover.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
