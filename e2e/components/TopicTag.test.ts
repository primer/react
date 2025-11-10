import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'experimental-components-topictag--default',
  },
] as const

test.describe('TopicTag', () => {
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
            await page.setViewportSize({width: 400, height: 200})

            // Default state
            await expect(page).toHaveScreenshot(`TopicTag.${story.title}.${theme}.png`)

            // Hover state
            await page.getByText('React').hover()
            await expect(page).toHaveScreenshot(`TopicTag.${story.title}.${theme}.hover.png`)
          })
        })
      }
    })
  }
})
