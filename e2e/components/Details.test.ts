import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: Array<{title: string; id: string}> = [
  {
    title: 'Default',
    id: 'components-details--default',
  },
  {
    title: 'SX Prop Stress Test',
    id: 'components-details-dev--sx-prop-stress-test',
  },
]

test.describe('Details', () => {
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

            // Default state - closed
            expect(await page.screenshot()).toMatchSnapshot(`Details.${story.title}.${theme}.png`)
            // Click the summary to open
            await page.getByText('See Details').click()
            await page.getByText('This is some content').waitFor()
            // Open state
            expect(await page.screenshot()).toMatchSnapshot(`Details.${story.title}.${theme}.open.png`)
          })
        })
      }
    })
  }
})
