import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories: Array<{title: string; id: string; viewports?: Array<keyof typeof viewports>}> = [
  {
    title: 'Default',
    id: 'drafts-components-banner--default',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'Critical',
    id: 'drafts-components-banner-features--critical',
  },
  {
    title: 'Dismiss',
    id: 'drafts-components-banner-features--dismiss',
  },
  {
    title: 'Dismiss With Actions',
    id: 'drafts-components-banner-features--dismiss-with-actions',
  },
  {
    title: 'Info',
    id: 'drafts-components-banner-features--info',
  },
  {
    title: 'Success',
    id: 'drafts-components-banner-features--success',
  },
  {
    title: 'Upsell',
    id: 'drafts-components-banner-features--upsell',
  },
  {
    title: 'Warning',
    id: 'drafts-components-banner-features--warning',
  },
  {
    title: 'WithActions',
    id: 'drafts-components-banner-features--with-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'WithHiddenTitle',
    id: 'drafts-components-banner-features--with-hidden-title',
  },
  {
    title: 'WithHiddenTitleAndActions',
    id: 'drafts-components-banner-features--with-hidden-title-and-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'InSidebar',
    id: 'drafts-components-banner-examples--in-sidebar',
  },
  {
    title: 'Multiline',
    id: 'drafts-components-banner-examples--multiline',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
]

test.describe('Banner', () => {
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
            expect(await page.screenshot()).toMatchSnapshot(`Banner.${story.title}.${theme}.png`)
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }

      if (story.viewports) {
        for (const name of story.viewports) {
          test(`${name} @vrt`, async ({page}) => {
            await visit(page, {
              id: story.id,
            })
            const width = viewports[name]

            await page.setViewportSize({
              width,
              height: 667,
            })
            expect(await page.screenshot()).toMatchSnapshot(`Banner.${story.title}.${name}.png`)
          })
        }
      }
    })
  }
})
