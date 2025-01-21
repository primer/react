import {test, expect} from '@playwright/test'
import path from 'path'
import {stories} from '../../packages/react/src/utils/testing'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

// const stories: Array<{title: string; id: string; viewports?: Array<keyof typeof viewports>}> = [
//   {
//     title: 'Default',
//     id: 'experimental-components-banner--default',
//     viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
//   },
//   {
//     title: 'Critical',
//     id: 'experimental-components-banner-features--critical',
//   },
//   {
//     title: 'Dismiss',
//     id: 'experimental-components-banner-features--dismiss',
//   },
//   {
//     title: 'Dismiss With Actions',
//     id: 'experimental-components-banner-features--dismiss-with-actions',
//   },
//   {
//     title: 'Info',
//     id: 'experimental-components-banner-features--info',
//   },
//   {
//     title: 'Success',
//     id: 'experimental-components-banner-features--success',
//   },
//   {
//     title: 'Upsell',
//     id: 'experimental-components-banner-features--upsell',
//   },
//   {
//     title: 'Warning',
//     id: 'experimental-components-banner-features--warning',
//   },
//   {
//     title: 'WithActions',
//     id: 'experimental-components-banner-features--with-actions',
//     viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
//   },
//   {
//     title: 'WithHiddenTitle',
//     id: 'experimental-components-banner-features--with-hidden-title',
//   },
//   {
//     title: 'WithHiddenTitleAndActions',
//     id: 'experimental-components-banner-features--with-hidden-title-and-actions',
//     viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
//   },
//   {
//     title: 'DismissibleWithHiddenTitleAndActions',
//     id: 'experimental-components-banner-features--dismissible-with-hidden-title-and-actions',
//     viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
//   },
//   {
//     title: 'DismissibleWithHiddenTitleAndSecondaryAction',
//     id: 'experimental-components-banner-features--dismissible-with-hidden-title-and-secondary-action',
//     viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
//   },
//   {
//     title: 'InSidebar',
//     id: 'experimental-components-banner-examples--in-sidebar',
//   },
//   {
//     title: 'Multiline',
//     id: 'experimental-components-banner-examples--multiline',
//     viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
//   },
// ]

test.describe('axe @aat', () => {
  for (const {story, relativeFilepath, type} of stories) {
    for (const storyName of Object.keys(story)) {
      const name = path.basename(relativeFilepath).split('.')[0]

      for (const theme of themes) {
        test.describe(theme, () => {
          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: `${name}-${type}--${storyName
                .split(/(?=[A-Z])/)
                .join('-')
                .toLowerCase()}`,
              globals: {
                colorScheme: theme,
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    }
  }
})
