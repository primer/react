import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories: Array<{title: string; id: string; viewports?: Array<keyof typeof viewports>}> = [
  {
    title: 'Default',
    id: 'components-banner--default',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'Critical',
    id: 'components-banner-features--critical',
  },
  {
    title: 'Dismiss',
    id: 'components-banner-features--dismiss',
  },
  {
    title: 'Dismiss With Actions',
    id: 'components-banner-features--dismiss-with-actions',
  },
  {
    title: 'Info',
    id: 'components-banner-features--info',
  },
  {
    title: 'Success',
    id: 'components-banner-features--success',
  },
  {
    title: 'Upsell',
    id: 'components-banner-features--upsell',
  },
  {
    title: 'Warning',
    id: 'components-banner-features--warning',
  },
  {
    title: 'WithActions',
    id: 'components-banner-features--with-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'WithHiddenTitle',
    id: 'components-banner-features--with-hidden-title',
  },
  {
    title: 'WithHiddenTitleAndActionsLong',
    id: 'components-banner-features--with-hidden-title-and-actions-long',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'DismissibleWithHiddenTitleAndActions',
    id: 'components-banner-features--dismissible-with-hidden-title-and-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'DismissibleWithHiddenTitleAndSecondaryAction',
    id: 'components-banner-features--dismissible-with-hidden-title-and-secondary-action',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'InSidebar',
    id: 'components-banner-examples--in-sidebar',
  },
  {
    title: 'Multiline',
    id: 'components-banner-examples--multiline',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'WithHiddenTitleAndActionsShort',
    id: 'components-banner-features--with-hidden-title-and-actions-short',
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
            await expect(page).toHaveScreenshot(`Banner.${story.title}.${theme}.png`)
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
            await expect(page).toHaveScreenshot(`Banner.${story.title}.${name}.png`)
          })
        }
      }
    })
  }
})
