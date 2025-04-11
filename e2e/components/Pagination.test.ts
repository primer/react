import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-pagination--default',
  },
  {
    title: 'Dev Default',
    id: 'components-pagination-dev--dev-default',
  },
  {
    title: 'Hide Page Numbers',
    id: 'components-pagination-features--hide-page-numbers',
  },
  {
    title: 'Render Links',
    id: 'components-pagination-features--render-links',
  },
] as const

test.describe('Pagination', () => {
  for (const story of stories) {
    test.describe(story.id, () => {
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
            expect(await page.screenshot()).toMatchSnapshot(`Pagehead.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})

const stressStories = [
  {
    title: 'Pagination Page Update',
    id: 'components-pagination-stresstests--page-update',
  },
] as const

test.describe('Pagination Stress Tests', () => {
  for (const story of stressStories) {
    test.describe(story.id, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test(`${story.title} @stress-test`, async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })
            const interaction = measureInteraction('stress-test')
            await page.getByRole('button', {name: 'Start stress test'}).click()
            await page.waitForTimeout(1000)
            interaction.end()
            console.warn({duration: interaction.getDuration(), snap: `${story.id}-stress-test.json`})
          })
        })
      }
    })
  }
})

function measureInteraction(interactionName: string) {
  performance.mark(`${interactionName} start`)

  let duration = 0

  return {
    end() {
      performance.mark(`${interactionName} end`)
      const measure = performance.measure(
        `${interactionName} duration`,
        `${interactionName} start`,
        `${interactionName} end`,
      )
      duration = measure.duration
    },
    getDuration() {
      return duration
    },
  }
}
