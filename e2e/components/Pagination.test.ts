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
    title: 'Hide Page Numbers By Viewport',
    id: 'components-pagination-features--hide-page-numbers-by-viewport&globals=viewport:small',
  },
  {
    title: 'Higher Surrounding Page Count',
    id: 'components-pagination-features--higher-surrounding-page-count&globals=viewport:small',
  },
  {
    title: 'Larger Page Count Margin',
    id: 'components-pagination-features--larger-page-count-margin&globals=viewport:small',
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

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
