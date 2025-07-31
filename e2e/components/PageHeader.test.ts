import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

// TODO: remove the color contrast rule once the construct issue is fixed
test.describe('PageHeader', () => {
  test.describe('Files Page', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--files-page',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.Files Page.${theme}.png`)
        })
      })
    }
  })

  test.describe('Files Page on Narrow Viewport', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--files-page-on-narrow-viewport',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.Files Page on Narrow Viewport.${theme}.png`)
        })
      })
    }
  })

  test.describe('Pull Request Page', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--pull-request-page',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.Pull Request Page.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--pull-request-page',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled:
                  theme !== 'dark_colorblind' &&
                  theme !== 'dark_dimmed' &&
                  theme !== 'light' &&
                  theme !== 'light_colorblind' &&
                  theme !== 'light_tritanopia',
              },
            },
          })
        })
      })
    }
  })

  test.describe('Pull Request Page on Narrow Viewport', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--pull-request-page-on-narrow-viewport',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(
            `PageHeader.Pull Request Page on Narrow Viewport.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Webhooks', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--webhooks',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.Webhooks.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--webhooks',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'light' && theme !== 'light_colorblind' && theme !== 'light_tritanopia',
              },
            },
          })
        })
      })
    }
  })

  test.describe('Webhooks on Narrow Viewport', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--webhooks-on-narrow-viewport',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.Webhooks on Narrow Viewport.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--webhooks-on-narrow-viewport',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'light' && theme !== 'light_colorblind' && theme !== 'light_tritanopia',
              },
            },
          })
        })
      })
    }
  })

  test.describe('With Page Layout', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-examples--with-page-layout',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.With Page Layout.${theme}.png`)
        })
      })
    }
  })

  test.describe('Has Border', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--has-bottom-border',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.Has Border.${theme}.png`)
        })
      })
    }
  })

  test.describe('Has Large Title', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--has-large-title',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.Has Large Title.${theme}.png`)
        })
      })
    }
  })

  test.describe('Has Title Only', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--has-title-only',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.Has Title Only.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Actions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-actions',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.With Actions.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-actions',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'light' && theme !== 'light_colorblind' && theme !== 'light_tritanopia',
              },
            },
          })
        })
      })
    }
  })

  test.describe('With Actions that have Responsive Content', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-actions-that-have-responsive-content',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(
            `PageHeader.With Actions that have Responsive Content.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-actions-that-have-responsive-content',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'light' && theme !== 'light_colorblind' && theme !== 'light_tritanopia',
              },
            },
          })
        })
      })
    }
  })

  test.describe('With Context Bar and Actions of Context Area', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-context-bar-and-actions-of-context-area',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(
            `PageHeader.With Context Bar and Actions of Context Area.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('With Custom Navigation', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-custom-navigation',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.With Custom Navigation.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Description Slot', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-description-slot',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.With Description Slot.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Leading and Trailing Actions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-leading-and-trailing-actions',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.With Leading and Trailing Actions.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Leading and Trailing Visuals', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-leading-and-trailing-visuals',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.With Leading and Trailing Visuals.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Leading Visual Hidden on Regular Viewport', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-leading-visual-hidden-on-regular-viewport',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(
            `PageHeader.With Leading Visual Hidden on Regular Viewport.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('With Navigation Slot', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-navigation-slot',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.With Navigation Slot.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Parent Link and Actions of Context Area', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-features--with-parent-link-and-actions-of-context-area',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(
            `PageHeader.With Parent Link and Actions of Context Area.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Large Variant with Multiline Title', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pageheader-dev--large-variant-with-multiline-title',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageHeader.Large Variant with Multiline Title.${theme}.png`)
        })
      })
    }
  })
})
