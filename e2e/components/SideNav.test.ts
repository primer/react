import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'deprecated-components-sidenav-dev--default',
  },
  {
    title: 'Full Variant',
    id: 'deprecated-components-sidenav-dev--full-variant',
  },
  {
    title: 'Lightweight Variant',
    id: 'deprecated-components-sidenav-dev--lightweight-variant',
  },
  {
    title: 'Lightweight Nested Variant',
    id: 'deprecated-components-sidenav-dev--lightweight-nested-variant',
  },
] as const

test.describe('SideNav', () => {
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
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `SideNav.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
