import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Breadcrumbs', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-breadcrumbs--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: true,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Breadcrumbs.Default.${theme}.png`)

          // Hover state
          await page.getByRole('link', {name: 'Home'}).hover()
          expect(await page.screenshot()).toMatchSnapshot(`Breadcrumbs.Default.${theme}.hover.png`)

          // Focus state
          await page.keyboard.press('Tab')
          expect(await page.screenshot()).toMatchSnapshot(`Breadcrumbs.Default.${theme}.focus.png`)
        })

        test('default @vrt (styled components)', async ({page}) => {
          await visit(page, {
            id: 'components-breadcrumbs--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: false,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Breadcrumbs.Default.${theme}.png`)

          // Hover state
          await page.getByRole('link', {name: 'Home'}).hover()
          expect(await page.screenshot()).toMatchSnapshot(`Breadcrumbs.Default.${theme}.hover.png`)

          // Focus state
          await page.keyboard.press('Tab')
          expect(await page.screenshot()).toMatchSnapshot(`Breadcrumbs.Default.${theme}.focus.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-breadcrumbs--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: true,
              },
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

        test('axe @aat (styled components)', async ({page}) => {
          await visit(page, {
            id: 'components-breadcrumbs--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: false,
              },
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
})
