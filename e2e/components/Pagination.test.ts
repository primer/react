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

test.describe('Pagination Stress Tests', () => {
  for (const theme of themes) {
    test.describe(theme, () => {
      test('page-update @stress-test', async ({page}) => {
        await visit(page, {
          id: 'components-pagination-stresstests--page-update',
          globals: {
            colorScheme: theme,
          },
        })
        await page.getByTestId('start').click()
        const result = await page.getByTestId('result').textContent()
        console.warn({duration: result, snap: `${story.id}-stress-test.json`})
      })
    })
  }
})
