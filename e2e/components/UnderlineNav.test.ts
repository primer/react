import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('UnderlineNav', () => {
  test.describe('Profile Page', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-examples--profile-page',
            globals: {
              colorScheme: theme
            }
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Profile Page.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-examples--profile-page',
            globals: {
              colorScheme: theme
            }
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed'
              }
            }
          })
        })
      })
    }
  })

  test.describe('Pull Request Page', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-examples--pull-request-page',
            globals: {
              colorScheme: theme
            }
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Pull Request Page.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-examples--pull-request-page',
            globals: {
              colorScheme: theme
            }
          })

          // These themes currently have a contrast violation due to
          // `StateLabel`
          const denylist = new Set(['light', 'light_colorblind', 'light_tritanopia', 'dark_dimmed'])

          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: !denylist.has(theme)
              }
            }
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
            id: 'drafts-components-underlinenav-examples--repos-page',
            globals: {
              colorScheme: theme
            }
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Repos Page.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-examples--repos-page',
            globals: {
              colorScheme: theme
            }
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed'
              }
            }
          })
        })
      })
    }
  })

  test.describe('Counters Loading State', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--counters-loading-state',
            globals: {
              colorScheme: theme
            }
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Counters Loading State.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--counters-loading-state',
            globals: {
              colorScheme: theme
            }
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed'
              }
            }
          })
        })
      })
    }
  })

  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--default',
            globals: {
              colorScheme: theme
            }
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--default',
            globals: {
              colorScheme: theme
            }
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed'
              }
            }
          })
        })
      })
    }
  })

  test.describe('Overflow Template', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--overflow-template',
            globals: {
              colorScheme: theme
            }
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.Overflow Template.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--overflow-template',
            globals: {
              colorScheme: theme
            }
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed'
              }
            }
          })
        })
      })
    }
  })

  test.describe('With Counter Labels', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--with-counter-labels',
            globals: {
              colorScheme: theme
            }
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.With Counter Labels.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--with-counter-labels',
            globals: {
              colorScheme: theme
            }
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed'
              }
            }
          })
        })
      })
    }
  })

  test.describe('With Icons', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--with-icons',
            globals: {
              colorScheme: theme
            }
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`UnderlineNav.With Icons.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-underlinenav-features--with-icons',
            globals: {
              colorScheme: theme
            }
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed'
              }
            }
          })
        })
      })
    }
  })
})
