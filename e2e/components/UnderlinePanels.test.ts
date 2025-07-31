import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: Array<{title: string; id: string}> = [
  {
    title: 'Default',
    id: 'experimental-components-underlinepanels--default',
  },
  {
    title: 'Dev Default',
    id: 'experimental-components-underlinepanels-dev--default',
  },
  {
    title: 'Labelled By External Element',
    id: 'experimental-components-underlinepanels-features--labelled-by-external-element',
  },
  {
    title: 'Selected Tab',
    id: 'experimental-components-underlinepanels-features--selected-tab',
  },
  {
    title: 'With Counters',
    id: 'experimental-components-underlinepanels-features--with-counters',
  },
  {
    title: 'With Counters In Loading State',
    id: 'experimental-components-underlinepanels-features--with-counters-in-loading-state',
  },
  {
    title: 'With Icons',
    id: 'experimental-components-underlinepanels-features--with-icons',
  },
  {
    title: 'With Icons Hidden On Narrow Screen',
    id: 'experimental-components-underlinepanels-features--with-icons-hidden-on-narrow-screen',
  },
]

test.describe('UnderlinePanels', () => {
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

            await expect(page).toHaveScreenshot(`UnderlinePanels.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
