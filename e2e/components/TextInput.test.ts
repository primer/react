import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('TextInput', () => {
  test.describe('Default', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinput--default',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Default.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinput--default'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Leading Visual', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinput--with-leading-visual',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Leading Visual.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinput--with-leading-visual'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Trailing Icon', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinput--with-trailing-icon',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Trailing Icon.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinput--with-trailing-icon'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Trailing Action', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinput--with-trailing-action',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Trailing Action.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinput--with-trailing-action'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Loading Indicator', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinput--with-loading-indicator',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Loading Indicator.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinput--with-loading-indicator'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
