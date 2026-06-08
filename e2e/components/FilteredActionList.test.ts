import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-filteredactionlist--default',
  },
  {
    title: 'With Long Items',
    id: 'components-filteredactionlist-examples--with-long-items',
  },
  {
    title: 'Multi Select With Select All',
    id: 'components-filteredactionlist-features--multi-select-with-select-all',
  },
  {
    title: 'Single Select',
    id: 'components-filteredactionlist-features--single-select',
  },
  {
    title: 'Radio Select',
    id: 'components-filteredactionlist-features--radio-select',
  },
  {
    title: 'Select All Selected',
    id: 'components-filteredactionlist-features--select-all-selected',
  },
  {
    title: 'With Disabled Items',
    id: 'components-filteredactionlist-features--with-disabled-items',
  },
  {
    title: 'With Groups',
    id: 'components-filteredactionlist-features--with-groups',
  },
  {
    title: 'With No Results Message',
    id: 'components-filteredactionlist-features--with-no-results-message',
  },
  {
    title: 'Default Empty State',
    id: 'components-filteredactionlist-features--default-empty-state',
  },
  {
    title: 'Custom Item Rendering',
    id: 'components-filteredactionlist-features--custom-item-rendering',
  },
  {
    title: 'Loading In Input',
    id: 'components-filteredactionlist-features--loading-in-input',
  },
  {
    title: 'Loading With Body Spinner',
    id: 'components-filteredactionlist-features--loading-with-body-spinner',
  },
  {
    title: 'Loading With Body Skeleton',
    id: 'components-filteredactionlist-features--loading-with-body-skeleton',
  },
  {
    title: 'Virtualized List',
    id: 'components-filteredactionlist-features--virtualized-list',
  },
] as const

test.describe('FilteredActionList', () => {
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
          await expect(page).toHaveScreenshot(`FilteredActionList.${story.title}.${theme}.png`, {
            animations: 'disabled',
            caret: 'hide',
          })
        })
      }
    })
  }
})
