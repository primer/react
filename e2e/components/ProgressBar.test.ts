import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-progressbar--default',
  },
  {
    title: 'Progress Zero',
    id: 'components-progressbar-features--progress-zero',
  },
  {
    title: 'Progress Half',
    id: 'components-progressbar-features--progress-half',
  },
  {
    title: 'Progress Done',
    id: 'components-progressbar-features--progress-done',
  },
  {
    title: 'Size Small',
    id: 'components-progressbar-features--size-small',
  },
  {
    title: 'Size Large',
    id: 'components-progressbar-features--size-large',
  },
  {
    title: 'Inline',
    id: 'components-progressbar-features--inline',
  },
  {
    title: 'All Colors',
    id: 'components-progressbar-features--all-colors',
  },
] as const

test.describe('ProgressBar', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('@vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `ProgressBar.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
