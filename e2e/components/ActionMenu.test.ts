import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('ActionMenu', () => {
  test.describe('Menu With Actions', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-examples--menu-with-actions',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Menu With Actions.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--menu-with-actions'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Single Selection', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-examples--single-selection',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Single Selection.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--single-selection'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Single Selection With Placeholder', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-examples--single-selection-with-placeholder',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Single Selection With Placeholder.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--single-selection-with-placeholder'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Groups And Description', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-examples--groups-and-description',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Groups And Description.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--groups-and-description'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Multiple Selection', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-examples--multiple-selection',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Multiple Selection.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--multiple-selection'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Mixed Selection', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-examples--mixed-selection',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Mixed Selection.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--mixed-selection'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Actions Story', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--actions-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Actions Story.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--actions-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('External Anchor', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--external-anchor',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`External Anchor.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--external-anchor'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Controlled Menu', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--controlled-menu',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Controlled Menu.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--controlled-menu'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Custom Anchor', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--custom-anchor',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Custom Anchor.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--custom-anchor'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Memex Table Menu', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--memex-table-menu',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Memex Table Menu.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-table-menu'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Memex View Options Menu', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--memex-view-options-menu',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Memex View Options Menu.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-view-options-menu'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Memex Iteration', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--memex-iteration',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Memex Iteration.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-iteration'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Memex Add Column', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--memex-add-column',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Memex Add Column.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-add-column'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Memex Keyboard Shortcut', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--memex-keyboard-shortcut',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Memex Keyboard Shortcut.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-keyboard-shortcut'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Overlay Props', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--overlay-props',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Overlay Props.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--overlay-props'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Mnemonics Test', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--mnemonics-test',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Mnemonics Test.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--mnemonics-test'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Tab Test', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--tab-test',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Tab Test.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--tab-test'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Within Focus Zone', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionmenu-fixtures--within-focus-zone',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Within Focus Zone.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--within-focus-zone'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
