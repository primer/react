import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-navlist--default',
  },
  {
    title: 'With TrailingAction',
    id: 'components-navlist-features--with-trailing-action',
  },
  {
    title: 'With Title and Heading',
    id: 'components-navlist-dev--with-group-title-and-heading',
  },
  {
    title: 'With Group',
    id: 'components-navlist-features--with-group',
  },
  {
    title: 'With Sub Items',
    id: 'components-navlist-features--with-sub-items',
  },
  {
    title: 'With expand',
    id: 'components-navlist-features--with-expand',
  },
  {
    title: 'With group expand',
    id: 'components-navlist-features--with-group-expand',
  },
]

test.describe('NavList', () => {
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
          await expect(page).toHaveScreenshot(`NavList.${story.title}.${theme}.png`)
        })
      }
    })
  }
})
