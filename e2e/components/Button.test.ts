import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Button', () => {
  test.describe('Danger', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--danger',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Danger.${theme}.png`)
        })
      })
    }
  })

  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Default.${theme}.png`)
        })
      })
    }
  })

  test.describe('Disabled', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--disabled',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Disabled.${theme}.png`)
        })
      })
    }
  })

  test.describe('Invisible', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--invisible',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Invisible.${theme}.png`)
        })
      })
    }
  })

  test.describe('Link', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--link',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Link.${theme}.png`)
        })
      })
    }
  })

  test.describe('Large', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--large',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Button.Large.png`)
    })
  })

  test.describe('Leading Visual', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--leading-visual',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Leading Visual.${theme}.png`)
        })
      })
    }
  })

  test.describe('Medium', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--medium',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Button.Medium.png`)
    })
  })

  test.describe('Primary', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--primary',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Primary.${theme}.png`)
        })
      })
    }
  })

  test.describe('Small', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--small',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Button.Small.png`)
    })
  })

  test.describe('Trailing Action', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--trailing-action',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Trailing Action.${theme}.png`)
        })
      })
    }
  })

  test.describe('Trailing Counter', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--trailing-counter',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Trailing Counter.${theme}.png`)
        })
      })
    }
  })

  test.describe('Trailing Visual', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--trailing-visual',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Trailing Visual.${theme}.png`)
        })
      })
    }
  })

  test.describe('Inactive', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--inactive',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Inactive.${theme}.png`)
        })
      })
    }
  })

  test.describe('Loading', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--loading',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Button.Loading.${theme}.png`)
        })
      })
    }
  })

  test.describe('Loading With Leading Visual', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--loading-with-leading-visual',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Button.Loading With Leading Visual.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Loading With Trailing Visual', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--loading-with-trailing-visual',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Button.Loading With Trailing Visual.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Loading With Trailing Action', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--loading-with-trailing-action',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Button.Loading With Trailing Action.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Dev: Invisible Variants', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-dev--invisible-variants',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Invisible Variants.${theme}.png`)
        })
      })
    }
  })

  test.describe('Dev: sx prop', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-dev--test-sx-prop',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.sx prop.${theme}.png`)
        })
      })
    }
  })

  test.describe('Aria expanded buttons', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--expanded-button',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `Button.Aria expanded buttons.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Dev: Disabled variants', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-dev--disabled-button-variants',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Disabled variants.${theme}.png`)
        })
      })
    }
  })

  test.describe('Trailing Counter No Text', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--trailing-counter-with-no-text',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Trailing Counter No Text.${theme}.png`)
        })
      })
    }
  })
})
