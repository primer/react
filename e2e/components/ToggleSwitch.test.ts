import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('ToggleSwitch', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-toggleswitch--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ToggleSwitch.Default.${theme}.png`)
        })
      })
    }
  })

  test.describe('Checked', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-toggleswitch-features--checked',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ToggleSwitch.Checked.${theme}.png`)
        })
      })
    }
  })

  test.describe('Checked Disabled', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-toggleswitch-features--checked-disabled',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ToggleSwitch.Checked Disabled.${theme}.png`)
        })
      })
    }
  })

  test.describe('Controlled', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-toggleswitch-features--controlled',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ToggleSwitch.Controlled.${theme}.png`)
        })
      })
    }
  })

  test.describe('Disabled', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-toggleswitch-features--disabled',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ToggleSwitch.Disabled.${theme}.png`)
        })
      })
    }
  })

  test.describe('Label End', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-toggleswitch-features--label-end',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ToggleSwitch.Label End.${theme}.png`)
        })
      })
    }
  })

  test.describe('Loading', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-toggleswitch-features--loading',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`ToggleSwitch.Loading.${theme}.png`)
        })
      })
    }
  })

  test.describe('Small', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-toggleswitch-features--small',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ToggleSwitch.Small.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Caption', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-toggleswitch-features--with-caption',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ToggleSwitch.With Caption.${theme}.png`)
        })
      })
    }
  })
})
