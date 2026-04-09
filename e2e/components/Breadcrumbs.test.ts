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

  test.describe('NarrowVisibleItems', () => {
    test('hides items except the previous breadcrumb on narrow viewport @avt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs--default',
      })

      // On narrow viewport, only the previous (parent) item should be visible
      await page.setViewportSize({width: 320, height: 768})

      const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
      const items = nav.locator('li')

      // "Home" should be hidden, "About" (previous) visible, "Team" (current) hidden
      await expect(items.nth(0)).not.toBeVisible()
      await expect(items.nth(1)).toBeVisible()
      await expect(items.nth(2)).not.toBeVisible()
    })

    test('shows all items on wide viewport @avt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs--default',
      })

      // On wide viewport, all items should be visible
      await page.setViewportSize({width: viewports['primer.breakpoint.md'], height: 768})

      const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
      const items = nav.locator('li')
      await expect(items).toHaveCount(3)

      for (let i = 0; i < 3; i++) {
        await expect(items.nth(i)).toBeVisible()
      }
    })

    test('shows custom number of items on narrow viewport @avt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs-features--narrow-visible-items-custom',
      })

      // On narrow viewport with visibleItemsOnNarrow={3}
      await page.setViewportSize({width: 320, height: 768})

      const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
      const items = nav.locator('li')

      // 7 items total, 3 visible before current page, current page hidden
      // Hidden: Home, Products, Category, Current Page
      // Visible: Subcategory, Item, Details
      await expect(items.filter({has: page.locator(':visible')})).toHaveCount(3)
    })
  })
})
