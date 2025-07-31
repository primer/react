import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-truncate--default',
  },
  {
    title: 'Playground',
    id: 'components-truncate--playground',
  },
  {
    title: 'Expandable',
    id: 'components-truncate-features--expandable',
  },
  {
    title: 'Inline',
    id: 'components-truncate-features--inline',
  },
  {
    title: 'Max Width',
    id: 'components-truncate-features--max-width',
  },
] as const

test.describe('Truncate', () => {
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
            await expect(page).toHaveScreenshot(`Truncate.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
