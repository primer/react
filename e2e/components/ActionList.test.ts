import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: Array<{title: string; id: string}> = [
  {
    title: 'Default',
    id: 'components-actionlist--default',
  },
  {
    title: 'Block Description',
    id: 'components-actionlist-features--block-description',
  },
  {
    title: 'Disabled Item',
    id: 'components-actionlist-features--disabled-item',
  },
  {
    title: 'Inline Description',
    id: 'components-actionlist-features--inline-description',
  },
  {
    title: 'Inside Overlay',
    id: 'components-actionlist-features--inside-overlay',
  },
  {
    title: 'Item Dividers',
    id: 'components-actionlist-features--item-dividers',
  },
  {
    title: 'Links',
    id: 'components-actionlist-features--links',
  },
  {
    title: 'Multi Select',
    id: 'components-actionlist-features--multi-select',
  },
  {
    title: 'Simple List',
    id: 'components-actionlist-features--simple-list',
  },
  {
    title: 'Single Divider',
    id: 'components-actionlist-features--single-divider',
  },
  {
    title: 'Single Select',
    id: 'components-actionlist-features--single-select',
  },
  {
    title: 'Text Wrap And Truncation',
    id: 'components-actionlist-features--text-wrap-and-truncation',
  },
  {
    title: 'With Avatars',
    id: 'components-actionlist-features--with-avatars',
  },
  {
    title: 'With Icons',
    id: 'components-actionlist-features--with-icons',
  },
  {
    title: 'Disabled Multiselect',
    id: 'components-actionlist-features--disabled-multiselect',
  },
  {
    title: 'Disabled Selected Multiselect',
    id: 'components-actionlist-features--disabled-selected-multiselect',
  },
  {
    title: 'Inactive Item',
    id: 'components-actionlist-features--inactive-item',
  },
  {
    title: 'Inactive Multiselect',
    id: 'components-actionlist-features--inactive-multiselect',
  },
  {
    title: 'Loading Item',
    id: 'components-actionlist-features--loading-item',
  },
  {
    title: 'Group With Filled Title',
    id: 'components-actionlist-features--group-with-filled-title',
  },
  {
    title: 'Group With Subtle Title',
    id: 'components-actionlist-features--group-with-subtle-title',
  },
  {
    title: 'Group With Filled Title Old Api',
    id: 'components-actionlist-dev--group-with-filled-title-old-api',
  },
  {
    title: 'Group With Subtle Title Old Api',
    id: 'components-actionlist-dev--group-with-subtle-title-old-api',
  },
  {
    title: 'With Trailing Action',
    id: 'components-actionlist-features--with-trailing-action',
  },
  {
    title: 'Full Variant',
    id: 'components-actionlist-features--full-variant',
  },
  {
    title: 'Group Heading with Classname',
    id: 'components-actionlist-dev--group-heading-custom-classname',
  },
  {
    title: 'SX Prop Stress Test',
    id: 'components-actionlist-dev--sx-prop-stress-test',
  },
]

test.describe('ActionList', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('visual @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `ActionList.${story.title}.${theme}.png`,
            )
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
    })
  }
})
