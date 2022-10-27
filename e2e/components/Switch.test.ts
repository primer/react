import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Switch', () => {
  test.describe('Default (uncontrolled)', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-toggleswitch-examples--default',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Default (uncontrolled).${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-examples--default'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Controlled', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-toggleswitch-examples--controlled',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Controlled.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-examples--controlled'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('statusLabelPosition="end"', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-toggleswitch-examples--status-label-positioned-at-end',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`statusLabelPosition="end".${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-examples--status-label-positioned-at-end'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Small', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-toggleswitch-fixtures--small',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Small.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-fixtures--small'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Associated with a caption', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-toggleswitch-fixtures--with-caption',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Associated with a caption.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-fixtures--with-caption'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
