import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    id: 'components-splitpagelayout--default',
    title: 'Default',
  },
  {
    id: 'components-splitpagelayout-features--settings-page',
    title: 'Settings Page',
  },
  {
    id: 'components-splitpagelayout-features--with-sidebar-start',
    title: 'With Sidebar Start',
  },
  {
    id: 'components-splitpagelayout-features--with-sidebar-end',
    title: 'With Sidebar End',
  },
  {
    id: 'components-splitpagelayout-features--with-resizable-sidebar',
    title: 'With Resizable Sidebar',
  },
  {
    id: 'components-splitpagelayout-features--with-sidebar-and-resizable-pane',
    title: 'With Sidebar And Resizable Pane',
  },
  {
    id: 'components-splitpagelayout-features--with-sticky-sidebar',
    title: 'With Sticky Sidebar',
  },
  {
    id: 'components-splitpagelayout-features--sidebar-fullscreen-responsive-variant',
    title: 'Sidebar Fullscreen Responsive Variant',
  },
] as const

test.describe('SplitPageLayout', () => {
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
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `SplitPageLayout.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
