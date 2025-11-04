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
          await expect(page).toHaveScreenshot(`FilteredActionList.${story.title}.${theme}.png`)
        })
      }
    })
  }
})
