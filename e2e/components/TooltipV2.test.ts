import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('TooltipV2', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`TooltipV2.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Anchor Has Margin', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2-features--anchor-has-margin',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `TooltipV2.Anchor Has Margin.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2-features--anchor-has-margin',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Calculated Direction', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2-features--calculated-direction',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `TooltipV2.Calculated Direction.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2-features--calculated-direction',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Icon Button With Description', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2-features--icon-button-with-description',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `TooltipV2.Icon Button With Description.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2-features--icon-button-with-description',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Label Type', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2-features--label-type',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`TooltipV2.Label Type.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-tooltipv2-features--label-type',
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
