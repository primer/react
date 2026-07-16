import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories: Array<{title: string; id: string; viewports?: Array<keyof typeof viewports>}> = [
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'Default',
    id: 'components-banner--default',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   */
  {
    title: 'Critical',
    id: 'components-banner-features--critical',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Dismiss',
    id: 'components-banner-features--dismiss',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Dismiss With Actions',
    id: 'components-banner-features--dismiss-with-actions',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Info',
    id: 'components-banner-features--info',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Success',
    id: 'components-banner-features--success',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Upsell',
    id: 'components-banner-features--upsell',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Warning',
    id: 'components-banner-features--warning',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'WithActions',
    id: 'components-banner-features--with-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   */
  {
    title: 'WithHiddenTitle',
    id: 'components-banner-features--with-hidden-title',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'WithHiddenTitleAndActions',
    id: 'components-banner-features--with-hidden-title-and-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'DismissibleWithHiddenTitleAndActions',
    id: 'components-banner-features--dismissible-with-hidden-title-and-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'DismissibleWithHiddenTitleAndSecondaryAction',
    id: 'components-banner-features--dismissible-with-hidden-title-and-secondary-action',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'InSidebar',
    id: 'components-banner-examples--in-sidebar',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'Multiline',
    id: 'components-banner-examples--multiline',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'ActionsInline',
    id: 'components-banner-features--actions-layout-inline',
    viewports: ['primer.breakpoint.xs'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'ActionsStacked',
    id: 'components-banner-features--actions-layout-stacked',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'FlushInsideDialog',
    id: 'components-banner-features--flush-inside-dialog',
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
