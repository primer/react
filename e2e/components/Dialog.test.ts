import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Dialog', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.getByRole('button', {name: 'Show dialog'}).click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Dialog.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Bottom Sheet', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--bottom-sheet',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Dialog.Bottom Sheet.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--bottom-sheet',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Full Screen', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--full-screen',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Dialog.Full Screen.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--full-screen',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Non Declaritive', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--non-declaritive',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Dialog.Non Declaritve.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--non-declaritive',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Responsive', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--responsive',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Dialog.Responsive.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--responsive',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Size Large', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--size-large',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Dialog.Size Large.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--size-large',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Size Small', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--size-small',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Dialog.Size Small.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--size-small',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Size X Dialog', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--size-x-large',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Dialog.Size X Large Test.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--size-x-large',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Stress Test', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--stress-test',
            globals: {
              colorScheme: theme,
            },
          })
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Dialog.Stress Test.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--stress-test',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Custom Renderers', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--with-custom-renderers',
            globals: {
              colorScheme: theme,
            },
          })

          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Dialog.With Custom Renderers.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--with-custom-renderers',
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
