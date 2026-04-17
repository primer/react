import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

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

  test.describe('Overflow Menu', () => {
    test('narrow viewport @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs-features--overflow-menu',
        globals: {
          colorScheme: 'light',
        },
      })

      await page.setViewportSize({width: viewports['primer.breakpoint.xs'] - 1, height: 768})
      await expect(page).toHaveScreenshot('Breadcrumbs.OverflowMenu.narrow.png')
    })

    test('wide viewport @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs-features--overflow-menu',
        globals: {
          colorScheme: 'light',
        },
      })

      await page.setViewportSize({width: viewports['primer.breakpoint.md'], height: 768})
      await expect(page).toHaveScreenshot('Breadcrumbs.OverflowMenu.wide.png')
    })
  })

  test.describe('Overflow Menu With Root', () => {
    test('narrow viewport @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs-features--overflow-menu-with-root',
        globals: {
          colorScheme: 'light',
        },
      })

      await page.setViewportSize({width: viewports['primer.breakpoint.xs'] - 1, height: 768})
      await expect(page).toHaveScreenshot('Breadcrumbs.OverflowMenuWithRoot.narrow.png')
    })
  })
})
