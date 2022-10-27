import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Tooltip', () => {
  test.describe('Text Tooltip', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-tooltip-default--text-tooltip',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Text Tooltip.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-tooltip-default--text-tooltip'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Icon Button Tooltip', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-tooltip-default--icon-button-tooltip',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Icon Button Tooltip.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-tooltip-default--icon-button-tooltip'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
