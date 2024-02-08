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
  test.describe('Button Group With Tooltip', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--button-group-with-tooltip',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Button Group With Tooltip.${theme}.png`,
            {
              threshold: 0.1,
            },
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--button-group-with-tooltip',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Button Group With Tooltip 2', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--button-group-with-tooltip-2',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Button Group With Tooltip 2.${theme}.png`,
            {
              threshold: 0.1,
            },
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--button-group-with-tooltip-2',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Icon Buttons With Tooltip', () => {
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
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Icon Buttons With Tooltip.${theme}.png`,
            {
              threshold: 0.1,
            },
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

  test.describe('Icon Buttons With Tooltip 2', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons-with-tooltip-2',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Icon Buttons With Tooltip 2.${theme}.png`,
            {
              threshold: 0.1,
            },
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons-with-tooltip-2',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Links With Tooltip', () => {
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
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Links With Tooltip.${theme}.png`,
            {
              threshold: 0.1,
            },
          )
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

  test.describe('Links With Tooltip 2', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--links-with-tooltip-2',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ButtonGroup.Links With Tooltip 2.${theme}.png`,
            {
              threshold: 0.1,
            },
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--links-with-tooltip-2',
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
