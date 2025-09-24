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
      })
    }
  })

  test.describe('Leading Action', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'private-components-treeviewwithleadingaction--leading-action',
            globals: {
              colorScheme: theme,
            },
          })

          expect(await page.screenshot()).toMatchSnapshot(`TreeView.Leading Action.${theme}.png`)
        })
      })
    }
  })

  test.describe('Trailing Action', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-treeview-examples--trailing-actions',
            globals: {
              colorScheme: theme,
            },
          })

          expect(await page.screenshot()).toMatchSnapshot(`TreeView.Trailing Actions.${theme}.png`)
        })
      })
    }
  })
})
