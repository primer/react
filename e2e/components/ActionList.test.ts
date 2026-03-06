import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
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
    disableAnimations: true,
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
  },
  {
    title: 'Group Heading with Classname',
    id: 'components-actionlist-dev--group-heading-custom-classname',
  },
  {
    title: 'Heading with Classname',
    id: 'components-actionlist-dev--heading-custom-classname',
  },
  {
    title: 'Visuals with Classnames',
    id: 'components-actionlist-dev--visual-custom-classname',
  },
  {
    title: 'Link Item Options',
    id: 'components-actionlist-examples--list-link-item',
  },
  {
    title: 'Item Label Styles With Mixed Descriptions',
    id: 'components-actionlist-dev--item-label-styles-with-mixed-descriptions',
  },
  {
    title: 'Trailing Visual Gap',
    id: 'components-actionlist-dev--trailing-visual-gap',
  },
  {
    title: 'Large Item',
    id: 'components-actionlist-features--large-item',
  },
  {
    title: 'Trailing count',
    id: 'components-actionlist-features--with-trailing-count',
  },
  {
    title: 'Keyboard shortcuts',
    id: 'components-actionlist-features--with-keyboard-shortcuts',
  },
  {
    title: 'All combinations',
    id: 'components-actionlist-examples--all-combinations',
  },
  {
    title: 'Text Wrap And Truncation',
    id: 'components-actionlist-features--text-wrap-and-truncation',
  },
] as const

test.describe('ActionList', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test(`default @vrt ${theme}`, async ({page}) => {
          await visit(page, {
            id: story.id,
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await expect(page).toHaveScreenshot(`ActionList.${story.title}.${theme}.png`)
        })
      }
    })
  }

  test.describe('Truncated Description Tooltip', () => {
    for (const theme of themes) {
      test(`inline truncated tooltip on focus @vrt ${theme}`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-features--text-wrap-and-truncation',
          globals: {
            colorScheme: theme,
          },
        })

        // Focus the item with a simple truncated inline description
        const inlineItem = page.getByRole('button', {name: /Inline Description/}).first()
        await inlineItem.focus()

        // Tooltip uses popover attribute; wait for it to become visible
        await expect(page.locator('[popover]:popover-open')).toBeVisible()
        await expect(page).toHaveScreenshot(`ActionList.Truncated Inline Tooltip.${theme}.png`)
      })

      test(`complex truncated tooltip on focus @vrt ${theme}`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-features--text-wrap-and-truncation',
          globals: {
            colorScheme: theme,
          },
        })

        // Focus the item with truncated description containing complex children (bold/italic)
        const complexItem = page.getByRole('button', {name: /Description with truncation and complex children/})
        await complexItem.focus()

        await expect(page.locator('[popover]:popover-open')).toBeVisible()
        await expect(page).toHaveScreenshot(`ActionList.Truncated Complex Tooltip.${theme}.png`)
      })
    }
  })
})
