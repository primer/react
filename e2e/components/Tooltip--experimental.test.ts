import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Tooltip--experimental', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Tooltip--experimental.Default.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('All Directions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--all-directions',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Tooltip--experimental.North.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--all-directions',
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
            id: 'drafts-components-tooltip-features--anchor-has-margin',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Tooltip--experimental.Anchor Has Margin.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--anchor-has-margin',
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
            id: 'drafts-components-tooltip-features--calculated-direction',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Tooltip--experimental.Calculated Direction.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--calculated-direction',
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
            id: 'drafts-components-tooltip-features--icon-button-with-description',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Tooltip--experimental.Icon Button With Description.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--icon-button-with-description',
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
            id: 'drafts-components-tooltip-features--label-type',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Tooltip--experimental.Label Type.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--label-type',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Multiline Text', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--multiline-text',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Tooltip--experimental.Multiline Text.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--multiline-text',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('On Action Menu Anchor', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--on-action-menu-anchor',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Tooltip--experimental.On Action Menu Anchor.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-features--on-action-menu-anchor',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Files Page Example', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-examples--files-page',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Tooltip--experimental.Files Page Example.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-tooltip-examples--files-page',
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
