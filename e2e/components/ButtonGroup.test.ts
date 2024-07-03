import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('ButtonGroup', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Playground', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--playground',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Playground.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--playground',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Icon Buttons', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Icon Buttons.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Icon Buttons with Tooltip', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons-with-tooltip',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // focus on the first button to make sure the tooltip is visible
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Icon Buttons with Tooltip.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons-with-tooltip',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Links with Tooltip', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--links-with-tooltip',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // focus on the first button to make sure the tooltip is visible
          await page.keyboard.press('Tab')
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Links with Tooltip.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--links-with-tooltip',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Button and Link with Tooltip 1', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--button-and-link-with-tooltip-1',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // focus on the first button to make sure the tooltip is visible
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Button and Link with Tooltip 1.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--button-and-link-with-tooltip-1',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Button and Link with Tooltip 2', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--button-and-link-with-tooltip-2',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // focus on the first button to make sure the tooltip is visible
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Button and Link with Tooltip 2.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--button-and-link-with-tooltip-2',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Icon Buttons with Tooltip 1', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--icon-buttons-with-tooltip-1',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // focus on the first button to make sure the tooltip is visible
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Icon Buttons with Tooltip 1.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--icon-buttons-with-tooltip-1',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Link and Button with Tooltip 1', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--link-and-button-with-tooltip-1',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // focus on the first button to make sure the tooltip is visible
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Link and Button with Tooltip 1.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--link-and-button-with-tooltip-1',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Link and Button with Tooltip 2', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--link-and-button-with-tooltip-2',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // focus on the first button to make sure the tooltip is visible
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Link and Button with Tooltip 2.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--link-and-button-with-tooltip-2',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Links with Tooltip 1', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--links-with-tooltip-1',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          // focus on the first button to make sure the tooltip is visible
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Links with Tooltip 1.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-devonly--links-with-tooltip-1',
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
