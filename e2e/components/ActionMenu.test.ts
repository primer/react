import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('ActionMenu', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu--default',
            globals: {
              colorScheme: theme,
            },
          })
          // Open state
          await page.getByRole('button', {name: 'Open menu'}).click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`ActionMenu.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu--default',
            globals: {
              colorScheme: theme,
            },
          })
          await page.getByRole('button', {name: 'Open menu'}).click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Inactive Items', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--inactive-items',
            globals: {
              colorScheme: theme,
            },
          })

          // Open state
          await page.locator('button', {hasText: 'Open menu'}).waitFor()
          await page.getByRole('button', {name: 'Open menu'}).click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionMenu.Inactive Items.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--inactive-items',
            globals: {
              colorScheme: theme,
            },
          })
          // Open menu
          await page.locator('button', {hasText: 'Open menu'}).waitFor()
          await page.getByRole('button', {name: 'Open menu'}).click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Links And Actions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--links-and-actions',
            globals: {
              colorScheme: theme,
            },
          })

          // Open state
          await page.getByRole('button', {name: 'Open menu'}).click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionMenu.Links And Actions.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--links-and-actions',
            globals: {
              colorScheme: theme,
            },
          })
          // Open Menu
          await page.getByRole('button', {name: 'Open menu'}).click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Loading Items', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--loading-items',
            globals: {
              colorScheme: theme,
            },
          })

          // Open menu
          await page.locator('button', {hasText: 'Open menu'}).waitFor()
          await page.getByRole('button', {name: 'Open menu'}).click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot()
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--loading-items',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Multi Select', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--multi-select',
            globals: {
              colorScheme: theme,
            },
          })

          // Open state
          await page.getByRole('button', {name: 'Display'}).click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionMenu.Multi Select.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--multi-select',
            globals: {
              colorScheme: theme,
            },
          })

          // Open state
          await page.getByRole('button', {name: 'Display'}).click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Single Select', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--single-select',
            globals: {
              colorScheme: theme,
            },
          })

          // Open state
          await page.getByRole('button', {name: 'Options: fast Forward'}).click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionMenu.Single Select.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-features--single-select',
            globals: {
              colorScheme: theme,
            },
          })

          // Open state
          await page.getByRole('button', {name: 'Options: fast Forward'}).click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Controlled Menu', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-examples--controlled-menu',
            globals: {
              colorScheme: theme,
            },
          })

          await page.getByRole('button', {name: 'Open Menu'}).click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionMenu.Controlled Menu.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-examples--controlled-menu',
            globals: {
              colorScheme: theme,
            },
          })

          // Open state
          await page.getByRole('button', {name: 'Open Menu'}).click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Custom Anchor', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-examples--custom-anchor',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionMenu.Custom Anchor.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-examples--custom-anchor',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Custom Overlay Props', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-examples--custom-overlay-props',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionMenu.Custom Overlay Props.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-examples--custom-overlay-props',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Groups And Descriptions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-examples--groups-and-descriptions',
            globals: {
              colorScheme: theme,
            },
          })

          // Open state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionMenu.Groups And Descriptions.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-actionmenu-examples--groups-and-descriptions',
            globals: {
              colorScheme: theme,
            },
          })

          // Open state
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
