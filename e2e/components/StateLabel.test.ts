import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Draft',
    id: 'components-statelabel-features--draft',
  },
  {
    title: 'Issue Closed',
    id: 'components-statelabel-features--issue-closed',
  },
  {
    title: 'Issue Closed Not Planned',
    id: 'components-statelabel-features--issue-closed-not-planned',
  },
  {
    title: 'Issue Draft',
    id: 'components-statelabel-features--issue-draft',
  },
  {
    title: 'Issue Opened',
    id: 'components-statelabel-features--issue-opened',
  },
  {
    title: 'Pull Closed',
    id: 'components-statelabel-features--pull-closed',
  },
  {
    title: 'Pull Merged',
    id: 'components-statelabel-features--pull-merged',
  },
  {
    title: 'Pull Opened',
    id: 'components-statelabel-features--pull-opened',
  },
  {
    title: 'Unavailable',
    id: 'components-statelabel-features--unavailable',
  },
  {
    title: 'Small',
    id: 'components-statelabel-features--small',
  },
  {
    title: 'Open',
    id: 'components-statelabel-features--open',
  },
  {
    title: 'Closed',
    id: 'components-statelabel-features--closed',
  },
] as const

test.describe('StateLabel', () => {
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
            await expect(page).toHaveScreenshot(`StateLabel.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
