import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: Array<{title: string; id: string}> = [
  {
    title: 'Default',
    id: 'experimental-components-underlinepanels2--default',
  },
  {
    title: 'Dev Default',
    id: 'experimental-components-underlinepanels2-dev--default',
  },
  {
    title: 'Labelled By External Element',
    id: 'experimental-components-underlinepanels2-features--labelled-by-external-element',
  },
  {
    title: 'Selected Tab',
    id: 'experimental-components-underlinepanels2-features--selected-tab',
  },
  {
    title: 'With Counters',
    id: 'experimental-components-underlinepanels2-features--with-counters',
  },
  {
    title: 'With Counters In Loading State',
    id: 'experimental-components-underlinepanels2-features--with-counters-in-loading-state',
  },
  {
    title: 'With Icons',
    id: 'experimental-components-underlinepanels2-features--with-icons',
  },
  {
    title: 'With Icons Hidden On Narrow Screen',
    id: 'experimental-components-underlinepanels2-features--with-icons-hidden-on-narrow-screen',
  },
]

test.describe('UnderlinePanels2', () => {
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

            await expect(page).toHaveScreenshot(`UnderlinePanels2.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
