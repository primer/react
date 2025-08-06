import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories = [
  {
    title: 'Default',
    id: 'experimental-components-hidden--default',
  },
] as const

test.describe('Hidden', () => {
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

            // Regular size viewport
            await page.setViewportSize({width: viewports['primer.breakpoint.md'], height: 768})
            await page
              .getByText('The below content is visible when the viewport is regular or wide but hidden when narrow:')
              .waitFor()
            await expect(page).toHaveScreenshot(`Hidden.${story.title}.medium.${theme}.png`)
            // Wide size viewport
            await page.setViewportSize({width: viewports['primer.breakpoint.lg'], height: 768})
            await page
              .getByText('The below content is visible when the viewport is regular or wide but hidden when narrow:')
              .waitFor()
            await expect(page).toHaveScreenshot(`Hidden.${story.title}.wide.${theme}.png`)
            // Narrow size viewport
            await page.setViewportSize({width: viewports['primer.breakpoint.xs'], height: 768})
            await page
              .getByText('The below content is visible when the viewport is regular or wide but hidden when narrow:')
              .waitFor()
            await expect(page).toHaveScreenshot(`Hidden.${story.title}.narrow.${theme}.png`)
          })
        })
      }
    })
  }
})
