import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

test.describe('UnderlineNav', () => {
  test.describe('Profile Page', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-examples--profile-page',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Profile Page.${theme}.png`)
        })
      })
    }
  })

  test.describe('Pull Request Page', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-examples--pull-request-page',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Pull Request Page.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-examples--pull-request-page',
            globals: {
              colorScheme: theme,
            },
          })

          // These themes currently have a contrast violation due to
          // `StateLabel`
          const denylist = new Set(['light', 'light_colorblind', 'light_tritanopia', 'dark_colorblind', 'dark_dimmed'])

          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: !denylist.has(theme),
              },
            },
          })
        })
      })
    }
  })

  test.describe('Repos Page', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-examples--repos-page',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Repos Page.${theme}.png`)
        })
      })
    }
  })

  test.describe('Counters Loading State', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-features--counters-loading-state',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Counters Loading State.${theme}.png`)
        })
      })
    }
  })

  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-features--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Default.${theme}.png`)
        })
      })
    }
  })

  test.describe('Overflow Template', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-features--overflow-template',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Overflow Template.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Counter Labels', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-features--with-counter-labels',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.With Counter Labels.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Icons', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-features--with-icons',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.With Icons.${theme}.png`)
        })
      })
    }
  })

  test.describe('Variant flush', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('Variant flush @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-features--variant-flush',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.VariantFlush.${theme}.png`)
        })
      })
    }
  })

  test.describe('UnderlineNav Interactions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('Overflow interaction @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-features--overflow-template',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // expect(await page.screenshot()).toMatchSnapshot()

          await page.setViewportSize({width: viewports['primer.breakpoint.sm'], height: 768})
          await page.locator('button', {hasText: 'More Repository Items'}).waitFor()

          // Resize
          // expect(await page.screenshot()).toMatchSnapshot()

          await page.getByRole('button', {name: 'More Repository Items'}).click()
          // expect(await page.screenshot()).toMatchSnapshot()

          await page.getByRole('link', {name: 'Settings (10)'}).click()
          // expect(await page.screenshot()).toMatchSnapshot()
        })

        test('Hide icons when there is not enough space to display all list items @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-features--overflow-template',
            globals: {
              colorScheme: theme,
            },
          })

          // Default State
          // expect(await page.screenshot()).toMatchSnapshot()

          // Resize
          await page.setViewportSize({width: viewports['primer.breakpoint.md'], height: 768})

          // Icons should be hidden
          // expect(await page.screenshot()).toMatchSnapshot()
        })

        test('Keep selected item visible @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-underlinenav-features--overflow-template',
            globals: {
              colorScheme: theme,
            },
          })
          await page.setViewportSize({width: viewports['primer.breakpoint.sm'], height: 768})

          await page.locator('button', {hasText: 'More Repository Items'}).waitFor()
          await page.getByRole('button', {name: 'More Repository Items'}).click()
          await page.getByRole('link', {name: 'Settings (10)'}).click()

          // State after selecting the second last item
          // expect(await page.screenshot()).toMatchSnapshot()

          // Resize
          await page.setViewportSize({
            width: 1100,
            height: 480,
          })
          await page.locator('button', {hasText: 'More Repository Items'}).waitFor({
            state: 'hidden',
          })

          // Current state
          // expect(await page.screenshot()).toMatchSnapshot()

          // Resize
          await page.setViewportSize({
            width: 800,
            height: 480,
          })
          await page.locator('button', {hasText: 'More Repository Items'}).waitFor()

          // Current state
          // expect(await page.screenshot()).toMatchSnapshot()

          // Resize
          await page.setViewportSize({
            width: 600,
            height: 480,
          })
          await page.locator('button', {hasText: 'More Repository Items'}).waitFor()
          // Current state
          // expect(await page.screenshot()).toMatchSnapshot()
        })
      })
    }
  })
})
