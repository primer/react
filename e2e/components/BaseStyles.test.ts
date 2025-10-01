import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    id: 'behaviors-basestyles-dev--default',
    title: 'Dev Default',
  },
  {
    id: 'behaviors-basestyles-dev--with-style-props',
    title: 'Dev With Style Props',
  },
  {
    id: 'behaviors-basestyles-dev--with-sx-props',
    title: 'Dev With Sx Props',
  },
  {
    id: 'behaviors-basestyles-dev--with-system-props',
    title: 'Dev With System Props',
  },
] as const

test.describe('BaseStyles', () => {
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
              `BaseStyles.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
