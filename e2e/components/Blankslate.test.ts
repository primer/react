import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories: Array<{title: string; id: string; viewports?: Array<keyof typeof viewports>}> = [
  {
    title: 'Default',
    id: 'experimental-components-blankslate--default',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'Narrow',
    id: 'experimental-components-blankslate-features--narrow',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'Spacious',
    id: 'experimental-components-blankslate-features--spacious',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  {
    title: 'With Border',
    id: 'experimental-components-blankslate-features--with-border',
    viewports: ['primer.breakpoint.sm'],
  },
  {
    title: 'With Primary Action',
    id: 'experimental-components-blankslate-features--with-primary-action',
    viewports: ['primer.breakpoint.sm'],
  },
  {
    title: 'With Secondary Action',
    id: 'experimental-components-blankslate-features--with-secondary-action',
    viewports: ['primer.breakpoint.sm'],
  },
  {
    title: 'With Visual',
    id: 'experimental-components-blankslate-features--with-visual',
    viewports: ['primer.breakpoint.sm'],
  },
]

test.describe('Blankslate', () => {
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
                  primer_react_css_modules_ga: true,
                },
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Blankslate.${story.title}.${theme}.png`)
          })

          test('default (styled-components) @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules_ga: false,
                },
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Blankslate.${story.title}.${theme}.png`)
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules_ga: true,
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
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }

      if (story.viewports) {
        for (const name of story.viewports) {
          test(`${name} @vrt`, async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                featureFlags: {
                  primer_react_css_modules_ga: true,
                },
              },
            })
            const width = viewports[name]

            await page.setViewportSize({
              width,
              height: 667,
            })
            expect(await page.screenshot()).toMatchSnapshot(`Blankslate.${story.title}.${name}.png`)
          })

          test(`${name} (styled-components) @vrt`, async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                featureFlags: {
                  primer_react_css_modules_ga: false,
                },
              },
            })
            const width = viewports[name]

            await page.setViewportSize({
              width,
              height: 667,
            })
            expect(await page.screenshot()).toMatchSnapshot(`Blankslate.${story.title}.${name}.png`)
          })
        }
      }
    })
  }
})
