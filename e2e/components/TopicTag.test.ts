import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

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

            // Focus state
            // eslint-disable-next-line github/no-blur
            await page.getByText('React').blur()
            await page.getByText('React').focus()
            await expect(page).toHaveScreenshot(`TopicTag.${story.title}.${theme}.focus.png`)
          })
        })
      }
    })
  }

  test.describe('As Group', () => {
    const story = {
      title: 'As Group',
      id: 'experimental-components-topictag-features--as-group',
    }

    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: story.id,
      })

      // Viewport: xs
      await page.setViewportSize({width: viewports['primer.breakpoint.xs'], height: 500})
      await expect(page).toHaveScreenshot(`TopicTag.${story.title}.xs.png`)

      // Viewport: sm
      await page.setViewportSize({width: viewports['primer.breakpoint.sm'], height: 500})
      await expect(page).toHaveScreenshot(`TopicTag.${story.title}.sm.png`)

      // Viewport: md
      await page.setViewportSize({width: viewports['primer.breakpoint.md'], height: 500})
      await expect(page).toHaveScreenshot(`TopicTag.${story.title}.md.png`)
    })
  })
})
