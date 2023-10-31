import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('CheckboxGroup', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`CheckboxGroup.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: false,
              },
            },
          })
        })
      })
    }
  })

  test.describe('Caption', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup-features--caption',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`CheckboxGroup.Caption.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup-features--caption',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: false,
              },
            },
          })
        })
      })
    }
  })

  test.describe('Error', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup-features--error',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`CheckboxGroup.Error.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup-features--error',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: false,
              },
            },
          })
        })
      })
    }
  })

  test.describe('Success', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup-features--success',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`CheckboxGroup.Success.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup-features--success',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: false,
              },
            },
          })
        })
      })
    }
  })

  test.describe('Visually Hidden Label', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup-features--visually-hidden-label',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `CheckboxGroup.Visually Hidden Label.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-checkboxgroup-features--visually-hidden-label',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: false,
              },
            },
          })
        })
      })
    }
  })
})
