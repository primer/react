import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: Array<{
  title: string
  id: string
  disableAnimations?: boolean
  snapshotThemes?: string[]
}> = [
  {
    title: 'Default',
    id: 'components-actionlist--default',
  },
  {
    title: 'Block Description',
    id: 'components-actionlist-features--block-description',
    snapshotThemes: ['light'],
  },
  {
    title: 'Disabled Item',
    id: 'components-actionlist-features--disabled-item',
  },
  {
    title: 'Inline Description',
    id: 'components-actionlist-features--inline-description',
    snapshotThemes: ['light'],
  },
  {
    title: 'Item Dividers',
    id: 'components-actionlist-features--item-dividers',
  },
  {
    title: 'Links',
    id: 'components-actionlist-features--links',
    snapshotThemes: ['light'],
  },
  {
    title: 'Multi Select',
    id: 'components-actionlist-features--multi-select',
    disableAnimations: true,
  },
  {
    title: 'Simple List',
    id: 'components-actionlist-features--simple-list',
  },
  {
    title: 'Single Divider',
    id: 'components-actionlist-features--single-divider',
    snapshotThemes: ['light'],
  },
  {
    title: 'Single Select',
    id: 'components-actionlist-features--single-select',
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
    disableAnimations: true,
  },
  {
    title: 'Inactive Item',
    id: 'components-actionlist-features--inactive-item',
    disableAnimations: true,
  },
  {
    title: 'Inactive Multiselect',
    id: 'components-actionlist-features--inactive-multiselect',
    disableAnimations: true,
  },
  {
    title: 'Loading Item',
    id: 'components-actionlist-features--loading-item',
    disableAnimations: true,
    snapshotThemes: ['light', 'dark'],
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
    title: 'Full Variant',
    id: 'components-actionlist-features--full-variant',
    snapshotThemes: ['light'],
  },
  {
    title: 'Group Heading with Classname',
    id: 'components-actionlist-dev--group-heading-custom-classname',
    snapshotThemes: ['light'],
  },
  {
    title: 'Heading with Classname',
    id: 'components-actionlist-dev--heading-custom-classname',
    snapshotThemes: ['light'],
  },
  {
    title: 'Visuals with Classnames',
    id: 'components-actionlist-dev--visual-custom-classname',
    snapshotThemes: ['light'],
  },
  {
    title: 'Link Item Options',
    id: 'components-actionlist-examples--list-link-item',
    snapshotThemes: ['light'],
  },
  {
    title: 'Item Label Styles With Mixed Descriptions',
    id: 'components-actionlist-dev--item-label-styles-with-mixed-descriptions',
    snapshotThemes: ['light'],
  },
  {
    title: 'Trailing Visual Gap',
    id: 'components-actionlist-dev--trailing-visual-gap',
    snapshotThemes: ['light'],
  },
] as const

test.describe('ActionList', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      const snapshotThemes = story.snapshotThemes || themes
      for (const theme of snapshotThemes) {
        test(`default @vrt ${theme}`, async ({page}) => {
          await visit(page, {
            id: story.id,
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          const screenshotOptions = story.disableAnimations ? {animations: 'disabled' as const} : undefined
          await expect(page).toHaveScreenshot(`ActionList.${story.title}.${theme}.png`, screenshotOptions)
        })
      }
    })
  }
})
