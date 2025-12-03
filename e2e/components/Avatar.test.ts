import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-avatar--default',
  },
  {
    title: 'Size',
    id: 'components-avatar-features--size',
  },
  {
    title: 'Size Responsive',
    id: 'components-avatar-features--size-responsive',
  },
  {
    title: 'Square',
    id: 'components-avatar-features--square',
  },
] as const

test.describe('Avatar', () => {
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
            await expect(page).toHaveScreenshot(`Avatar.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
