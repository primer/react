import {test, expect, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'private-components-overlay--default',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    },
  },
  {
    title: 'Playground',
    id: 'private-components-overlay--playground',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    },
  },
  {
    title: 'Dialog Overlay',
    id: 'private-components-overlay-features--dialog-overlay',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    },
  },
  {
    title: 'Dropdown Overlay',
    id: 'private-components-overlay-features--dropdown-overlay',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    },
  },
  {
    title: 'Memex Issue Overlay',
    id: 'private-components-overlay-features--memex-issue-overlay',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    },
  },
  {
    title: 'Memex Nested Overlays',
    id: 'private-components-overlay-features--memex-nested-overlays',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    },
  },
  {
    title: 'Nested Overlays',
    id: 'private-components-overlay-features--nested-overlays',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    },
  },
  {
    title: 'Overlay On Top Of Overlay',
    id: 'private-components-overlay-features--overlay-on-top-of-overlay',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
    },
  },
  {
    title: 'Positioned Overlays',
    id: 'private-components-overlay-features--positioned-overlays',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    },
  },
  {
    title: 'SX Props',
    id: 'private-components-overlay-dev--sx-props',
    setup: async (page: Page) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    },
  },
] as const

test.describe('Overlay ', () => {
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

            // await story.setup(page)

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Overlay.${story.title}.${theme}.png`)
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })
            // await story.setup(page)

            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
