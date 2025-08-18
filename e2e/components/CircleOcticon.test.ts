import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'deprecated-components-circleocticon--default',
  },
  {
    title: 'Playground',
    id: 'deprecated-components-circleocticon--playground',
  },
] as const

test.describe('CircleOcticon', () => {
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
            await expect(page).toHaveScreenshot(`CircleOcticon.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
