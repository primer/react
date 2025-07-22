import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-avatarpair--default',
  },
  {
    title: 'Parent Circle',
    id: 'components-avatarpair-features--parent-circle',
  },
  {
    title: 'Parent Square',
    id: 'components-avatarpair-features--parent-square',
  },
] as const

test.describe('AvatarPair', () => {
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
            await expect(page).toHaveScreenshot(`AvatarPair.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
