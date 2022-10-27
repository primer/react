import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('interaction', () => {
  test.describe('StickyPane', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-pagelayout-interactions--sticky-pane',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`StickyPane.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout-interactions--sticky-pane'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('NonStickyPane', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-pagelayout-interactions--non-sticky-pane',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`NonStickyPane.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout-interactions--non-sticky-pane'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('CustomStickyHeader', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-pagelayout-interactions--custom-sticky-header',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`CustomStickyHeader.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout-interactions--custom-sticky-header'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
