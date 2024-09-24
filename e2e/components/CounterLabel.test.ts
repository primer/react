import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-counterlabel--default',
  },
  {
    title: 'Primary Theme',
    id: 'components-counterlabel--primary-theme',
  },
  {
    title: 'Secondary Theme',
    id: 'components-counterlabel--secondary-theme',
  },
] as const

test.describe('CounterLabel', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules_team: true,
                },
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`CounterLabel.${story.title}.${theme}.png`)
          })

          test('default (styled-components) @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules_team: false,
                },
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`CounterLabel.${story.title}.${theme}.png`)
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules_team: true,
                },
              },
            })
            await expect(page).toHaveNoViolations()
          })

          test('axe (styled-components) @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules_team: false,
                },
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
