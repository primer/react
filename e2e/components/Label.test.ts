import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-label--default',
  },
  {
    title: 'Playground',
    id: 'components-label--playground',
  },
  {
    title: 'Accent',
    id: 'components-label-features--accent',
  },
  {
    title: 'Attention',
    id: 'components-label-features--attention',
  },
  {
    title: 'Danger',
    id: 'components-label-features--danger',
  },
  {
    title: 'Done',
    id: 'components-label-features--done',
  },
  {
    title: 'Primary',
    id: 'components-label-features--primary',
  },
  {
    title: 'Secondary',
    id: 'components-label-features--secondary',
  },
  {
    title: 'Severe',
    id: 'components-label-features--severe',
  },
  {
    title: 'Size Large',
    id: 'components-label-features--size-large',
  },
  {
    title: 'Size Small',
    id: 'components-label-features--size-small',
  },
  {
    title: 'Sponsors',
    id: 'components-label-features--sponsors',
  },
  {
    title: 'Success',
    id: 'components-label-features--success',
  },
] as const

test.describe('Label', () => {
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
            await expect(page).toHaveScreenshot(`Label.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
