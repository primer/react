import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-pagination--default',
  },
  {
    title: 'Dev Default',
    id: 'components-pagination-dev--dev-default',
  },
  {
    title: 'Hide Page Numbers',
    id: 'components-pagination-features--hide-page-numbers',
  },
  {
    title: 'Render Links',
    id: 'components-pagination-features--render-links',
  },
] as const

test.describe('Pagination', () => {
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
            expect(await page.screenshot()).toMatchSnapshot(`Pagehead.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})

const stressStories = [
  {
    title: 'Default',
    id: 'components-pagination-stresstests--default',
  },
] as const

test.describe('Pagination Stress Tests', () => {
  for (const story of stressStories) {
    test.describe(story.id, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test(`${story.title} @stress-test`, async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Pagehead.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
