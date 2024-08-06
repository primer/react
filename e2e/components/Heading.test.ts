import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Heading', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-heading--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules: true,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Heading.Default.${theme}.png`)
        })

        test('default (styled-components) @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-heading--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Heading.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-heading--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules: true,
              },
            },
          })
          await expect(page).toHaveNoViolations()
        })

        test('axe (styled-components) @aat', async ({page}) => {
          await visit(page, {
            id: 'components-heading--default',
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
