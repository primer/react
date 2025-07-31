import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-breadcrumbs--default',
  },
] as const

test.describe('Breadcrumbs', () => {
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
            await expect(page).toHaveScreenshot(`Breadcrumbs.${story.title}.${theme}.png`)

            // Hover state
            await page.getByRole('link', {name: 'Home'}).hover()
            await expect(page).toHaveScreenshot(`Breadcrumbs.${story.title}.${theme}.hover.png`)

            // Focus state
            await page.keyboard.press('Tab')
            await expect(page).toHaveScreenshot(`Breadcrumbs.${story.title}.${theme}.focus.png`)
          })
        })
      }
    })
  }
})
