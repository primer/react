import {test, expect, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Tooltip', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'deprecated-components-tooltip--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Tooltip open state
          await page.keyboard.press('Tab')
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Tooltip.Default.${theme}.open.png`)
        })
      })
    }
  })

  // The bubble is drawn by the trigger's `::after`, which `toHaveCSS` cannot
  // target, so these read the computed style of the pseudo-element directly.
  const describeBubble = (page: Page) =>
    page.locator('[role="tooltip"]').evaluate(element => {
      const {animationName, display, opacity} = getComputedStyle(element, '::after')
      return {animationName, display, opacity}
    })

  test.describe('reduced motion', () => {
    // `contextOptions` is what the root Playwright config uses to emulate
    // `prefers-reduced-motion`, so it is the option that has to be overridden.
    test.use({contextOptions: {reducedMotion: 'reduce'}})

    test('bubble is shown without the fade @vrt', async ({page}) => {
      await visit(page, {
        id: 'deprecated-components-tooltip--default',
      })

      await page.locator('[role="tooltip"]').hover()

      // `tooltip-appear` is what lifts the bubble off the `opacity: 0` in
      // `.Tooltip::after`, so this is the case the visible-by-default rule
      // exists for - without it, reduced motion would render nothing at all
      expect(await describeBubble(page)).toEqual({
        animationName: 'none',
        // The rule asks for `inline-block`, but the bubble is absolutely
        // positioned, so the computed value is blockified to `block`
        display: 'block',
        opacity: '1',
      })
    })
  })

  test.describe('no preference for reduced motion', () => {
    test.use({contextOptions: {reducedMotion: 'no-preference'}})

    test('bubble keeps its fade @vrt', async ({page}) => {
      await visit(page, {
        id: 'deprecated-components-tooltip--default',
      })

      await page.locator('[role="tooltip"]').hover()

      // Names are scoped by CSS Modules, so only the base name is stable
      const bubble = await describeBubble(page)
      expect(bubble.animationName).toMatch(/tooltip-appear/)

      // The fade still lands on a fully opaque bubble
      await expect.poll(async () => (await describeBubble(page)).opacity, {timeout: 1000}).toBe('1')
    })
  })
})
