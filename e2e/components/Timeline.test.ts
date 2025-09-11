import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-timeline--default',
  },
  {
    title: 'Clip Sidebar',
    id: 'components-timeline-features--clip-sidebar',
  },
  {
    title: 'Condensed Items',
    id: 'components-timeline-features--condensed-items',
  },
  {
    title: 'Timeline Break',
    id: 'components-timeline-features--timeline-break',
  },
] as const

test.describe('Timeline', () => {
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
            expect(await page.screenshot()).toMatchSnapshot(`Timeline.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
  test.describe('With Inline Links', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-timeline-features--with-inline-links',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Timeline.With Inline Links.${theme}.png`)

          // Hover state
          await page
            .getByRole('link', {
              name: 'Monalisa',
            })
            .hover()
          expect(await page.screenshot()).toMatchSnapshot(`Timeline.With Inline Links.${theme}.hover.png`)

          // Focus state
          await page.keyboard.press('Tab')
          expect(await page.screenshot()).toMatchSnapshot(`Timeline.With Inline Links.${theme}.focus.png`)
        })
      })
    }
  })
})
