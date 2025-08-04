import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'deprecated-components-octicon--default',
  },
  {
    title: 'Playground',
    id: 'deprecated-components-octicon--playground',
  },
] as const

test.describe('Octicon', () => {
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
            await expect(page).toHaveScreenshot(`Octicon.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
