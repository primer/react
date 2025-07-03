import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'deprecated-components-pagehead--default',
  },
] as const

test.describe('Pagehead', () => {
  for (const story of stories) {
    test.describe(story.id, () => {
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
            await expect(page).toHaveScreenshot(`Pagehead.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
