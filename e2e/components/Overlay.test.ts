import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'private-components-overlay--default',
  },
  {
    title: 'Playground',
    id: 'private-components-overlay--playground',
  },
  {
    title: 'Dialog Overlay',
    id: 'private-components-overlay-features--dialog-overlay',
  },
  {
    title: 'Dropdown Overlay',
    id: 'private-components-overlay-features--dropdown-overlay',
  },
  {
    title: 'Memex Issue Overlay',
    id: 'private-components-overlay-features--memex-issue-overlay',
  },
  {
    title: 'Memex Nested Overlays',
    id: 'private-components-overlay-features--memex-nested-overlays',
  },
  {
    title: 'Nested Overlays',
    id: 'private-components-overlay-features--nested-overlays',
  },
  {
    title: 'Overlay On Top Of Overlay',
    id: 'private-components-overlay-features--overlay-on-top-of-overlay',
  },
  {
    title: 'Positioned Overlays',
    id: 'private-components-overlay-features--positioned-overlays',
  },
  {
    title: 'SX Props',
    id: 'private-components-overlay-dev--sx-props',
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
              args: {
                open: true,
              },
            })

            await expect(page).toHaveScreenshot(`Overlay.${story.title}.${theme}.png`, {animations: 'disabled'})
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
              args: {
                open: true,
              },
            })

            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
