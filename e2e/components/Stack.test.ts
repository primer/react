import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'drafts-components-stack--default',
  },
  {
    title: 'Orientation',
    id: 'drafts-components-stack--playground',
    args: [
      {
        orientation: 'horizontal',
      },
      {
        orientation: 'vertical',
      },
    ],
  },
  {
    title: 'Align',
    id: 'drafts-components-stack--playground',
    args: [
      {
        align: 'stretch',
      },
      {
        align: 'start',
      },
      {
        align: 'center',
      },
      {
        align: 'end',
      },
      {
        align: 'baseline',
      },
    ],
  },
  {
    title: 'Wrap',
    id: 'drafts-components-stack--playground',
    args: [
      {
        wrap: 'wrap',
      },
      {
        wrap: 'nowrap',
      },
    ],
  },
  {
    title: 'Spread',
    id: 'drafts-components-stack--playground',
    args: [
      {
        spread: 'start',
      },
      {
        spread: 'center',
      },
      {
        spread: 'end',
      },
      {
        spread: 'distribute',
      },
      {
        spread: 'distributeEvently',
      },
    ],
  },
  {
    title: 'Padding',
    id: 'drafts-components-stack--playground',
    args: [
      {
        padding: 'none',
      },
      {
        padding: 'condensed',
      },
      {
        padding: 'normal',
      },
      {
        padding: 'spacious',
      },
    ],
  },
  {
    title: 'Gap',
    id: 'drafts-components-stack--playground',
    args: [
      {
        gap: 'none',
      },
      {
        gap: 'condensed',
      },
      {
        gap: 'normal',
      },
      {
        gap: 'spacious',
      },
    ],
  },
]

test.describe('Stack', () => {
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
            expect(await page.screenshot()).toMatchSnapshot(`Stack.${story.title}.${theme}.png`)
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
