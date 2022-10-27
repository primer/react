import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('ConfirmationDialog', () => {
  test.describe('Basic Confirmation Dialog', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-confirmationdialog--basic-confirmation-dialog',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Basic Confirmation Dialog.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-confirmationdialog--basic-confirmation-dialog'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Shorthand Hook', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-confirmationdialog--shorthand-hook',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Shorthand Hook.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-confirmationdialog--shorthand-hook'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Shorthand Hook From Action Menu', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-confirmationdialog--shorthand-hook-from-action-menu',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Shorthand Hook From Action Menu.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-confirmationdialog--shorthand-hook-from-action-menu'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
