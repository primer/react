import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('TreeView', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-treeview--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`TreeView.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-treeview--default',
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

  test.describe('Empty Directories', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-treeview-features--empty-directories',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`TreeView.Empty Directories.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-treeview-features--empty-directories',
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

  test.describe('Files', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-treeview-features--files',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`TreeView.Files.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-treeview-features--files',
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

  test.describe('Files Changed', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-treeview-features--files-changed',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`TreeView.Files Changed.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-treeview-features--files-changed',
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

  test.describe('Leading Action', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-treeview-features--leading-action',
            globals: {
              colorScheme: theme,
            },
          })

          expect(await page.screenshot()).toMatchSnapshot(`TreeView.Leading Action.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-treeview-features--leading-action',
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
