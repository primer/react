import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('UnderlineNav2', () => {
  test.describe('Default Nav', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-underlinenav--default-nav',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Default Nav.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-underlinenav--default-nav'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Icons', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-underlinenav--with-icons',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Icons.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-underlinenav--with-icons'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Counter Labels', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-underlinenav--with-counter-labels',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Counter Labels.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-underlinenav--with-counter-labels'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Internal Responsive Nav', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-underlinenav--internal-responsive-nav',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Internal Responsive Nav.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-underlinenav--internal-responsive-nav'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Counters Loading State', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-underlinenav--counters-loading-state',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Counters Loading State.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-underlinenav--counters-loading-state'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
