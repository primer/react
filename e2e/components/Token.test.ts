import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {matrix, serialize} from '../test-helpers/props'

const scenarios = matrix({
  size: ['small', 'medium', 'large', 'xlarge'],
  isSelected: [true, false],
})

test.describe('Token', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        for (const scenario of scenarios) {
          const info = serialize(scenario)

          test.describe(info, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-token--default-token',
                globals: {
                  colorScheme: theme,
                },
                args: scenario,
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Token.Default.${theme}.${info}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-token--default-token',
                globals: {
                  colorScheme: theme,
                },
              })
              await expect(page).toHaveNoViolations({
                rules: {
                  'color-contrast': {
                    enabled: theme !== 'dark_dimmed',
                  },
                },
              })
            })
          })
        }
      })
    }
  })

  test.describe('Interactive', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-token--interactive',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Token.Interactive.${theme}.png`)

          // Hover state
          await page.locator('button', {hasText: 'Button'}).hover()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Token.Interactive.${theme}.hover.png`,
          )

          // Focus state
          await page.locator('button', {hasText: 'Button'}).focus()
          expect(await page.screenshot()).toMatchSnapshot(`Token.Interactive.${theme}.focus.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-token--interactive',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })
      })
    }
  })

  test.describe('with leadingVisual', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        for (const scenario of scenarios) {
          const info = serialize(scenario)

          test.describe(info, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-token--with-leading-visual',
                globals: {
                  colorScheme: theme,
                },
                args: scenario,
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Token.with leadingVisual.${theme}.${info}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-token--with-leading-visual',
                globals: {
                  colorScheme: theme,
                },
              })
              await expect(page).toHaveNoViolations({
                rules: {
                  'color-contrast': {
                    enabled: theme !== 'dark_dimmed',
                  },
                },
              })
            })
          })
        }
      })
    }
  })
})
