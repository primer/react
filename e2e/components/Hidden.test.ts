import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

test.describe('Hidden', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-hidden--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Regular size viewport
          await page.setViewportSize({width: viewports['primer.breakpoint.md'], height: 768})
          await page
            .getByText('The below content is visible when the viewport is regular or wide but hidden when narrow:')
            .waitFor()
          expect(await page.screenshot()).toMatchSnapshot(`Hidden.Default.medium.${theme}.png`)
          // Wide size viewport
          await page.setViewportSize({width: viewports['primer.breakpoint.lg'], height: 768})
          await page
            .getByText('The below content is visible when the viewport is regular or wide but hidden when narrow:')
            .waitFor()
          expect(await page.screenshot()).toMatchSnapshot(`Hidden.Default.wide.${theme}.png`)
          // Narrow size viewport
          await page.setViewportSize({width: viewports['primer.breakpoint.xs'], height: 768})
          await page
            .getByText('The below content is visible when the viewport is regular or wide but hidden when narrow:')
            .waitFor()
          expect(await page.screenshot()).toMatchSnapshot(`Hidden.Default.narrow.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-hidden--default',
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
