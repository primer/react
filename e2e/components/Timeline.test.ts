import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Timeline', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-timeline--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Timeline.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-timeline--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })
      })
    }
  })

  test.describe('Clip Sidebar', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-timeline-features--clip-sidebar',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Timeline.Clip Sidebar.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-timeline-features--clip-sidebar',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })
      })
    }
  })

  test.describe('Condensed Items', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-timeline-features--condensed-items',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Timeline.Condensed Items.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-timeline-features--condensed-items',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })
      })
    }
  })

  test.describe('Timeline Break', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-timeline-features--timeline-break',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Timeline.Timeline Break.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-timeline-features--timeline-break',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })
      })
    }
  })

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

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-timeline-features--with-inline-links',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })
      })
    }
  })
})
