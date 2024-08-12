import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-link--default',
  },
  {
    title: 'Inline',
    id: 'components-link-features--inline',
  },
  {
    title: 'Muted',
    id: 'components-link-features--muted',
  },
  {
    title: 'Underline',
    id: 'components-link-features--underline',
  },
] as const

test.describe('Link', () => {
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
                  primer_react_css_modules: true,
                },
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Link.${story.title}.${theme}.png`)

            // Hover state
            await page.getByRole('link').hover()
            expect(await page.screenshot()).toMatchSnapshot(`Link.${story.title}.${theme}.hover.png`)

            // Focus state
            await page.keyboard.press('Tab')
            expect(await page.screenshot()).toMatchSnapshot(`Link.${story.title}.${theme}.focus.png`)
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules: true,
                },
              },
            })
            await expect(page).toHaveNoViolations()
          })

          test('default (styled-component) @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Link.${story.title}.${theme}.png`)

            // Hover state
            await page.getByRole('link').hover()
            expect(await page.screenshot()).toMatchSnapshot(`Link.${story.title}.${theme}.hover.png`)

            // Focus state
            await page.keyboard.press('Tab')
            expect(await page.screenshot()).toMatchSnapshot(`Link.${story.title}.${theme}.focus.png`)
          })

          test('axe (styled-component) @aat', async ({page}) => {
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

  test.describe('Dev: Inline', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-link-devonly--inline',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Link.Dev Inline.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-link-devonly--inline',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
