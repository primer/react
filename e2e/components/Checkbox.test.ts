import {test, expect, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-checkbox--default',
  },
  {
    title: 'Disabled',
    id: 'components-checkbox-features--disabled',
  },
  {
    title: 'With Caption',
    id: 'components-checkbox-features--with-caption',
  },
  {
    title: 'With Leading Visual',
    id: 'components-checkbox-features--with-leading-visual',
  },
  {
    title: 'Indeterminate',
    id: 'components-checkbox-features--indeterminate',
  },
  {
    title: 'Visually Hidden',
    id: 'components-checkbox--playground',
    args: {
      visuallyHidden: true,
    },
  },
] as const

test.describe('Checkbox', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
              args: 'args' in story ? story.args : {},
            })

            // Default state
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `Checkbox.${story.title}.${theme}.png`,
            )

            // Focus state
            await page.keyboard.press('Tab')
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `Checkbox.${story.title}.focus.${theme}.png`,
            )
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
              args: 'args' in story ? story.args : {},
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }

  // The checkmark is drawn by the input's `::before`, which `toHaveCSS` cannot
  // target, so these read the computed style of the pseudo-element directly.
  const describeCheckmark = (page: Page) =>
    page.locator('[data-component="Checkbox"]').evaluate(element => {
      const {animationName, clipPath, visibility, transitionDelay} = getComputedStyle(element, '::before')
      return {animationName, clipPath, visibility, transitionDelay}
    })

  test.describe('reduced motion', () => {
    // `contextOptions` is what the root Playwright config uses to emulate
    // `prefers-reduced-motion`, so it is the option that has to be overridden.
    test.use({contextOptions: {reducedMotion: 'reduce'}})

    test('checkmark appears without the clip-path animation @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-checkbox--playground',
        args: {checked: true},
      })

      expect(await describeCheckmark(page)).toEqual({
        animationName: 'none',
        // Chromium reports a fully un-clipped value as `inset(0px)`
        clipPath: 'inset(0px)',
        visibility: 'visible',
        transitionDelay: '0s',
      })

      await visit(page, {
        id: 'components-checkbox-features--indeterminate',
      })

      expect(await describeCheckmark(page)).toEqual({
        animationName: 'none',
        clipPath: 'inset(0px)',
        visibility: 'visible',
        transitionDelay: '0s',
      })

      // Clearing the indeterminate state hides the mark immediately, with no
      // delay left over from the animation-out
      await page.locator('[data-component="Checkbox"]').click()

      expect(await describeCheckmark(page)).toEqual({
        animationName: 'none',
        clipPath: 'inset(16px 0px 0px)',
        visibility: 'hidden',
        transitionDelay: '0s',
      })
    })
  })

  test.describe('no preference for reduced motion', () => {
    test.use({contextOptions: {reducedMotion: 'no-preference'}})

    test('checkmark keeps its clip-path animation @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-checkbox-features--indeterminate',
      })

      // Names are scoped by CSS Modules, so only the base name is stable. The
      // clip-path itself is not worth asserting here: by the time it can be
      // read, the 80ms wipe has already run and landed on the un-clipped value.
      const checkmark = await describeCheckmark(page)
      expect(checkmark.animationName).toMatch(/checkmarkIn/)
      expect(checkmark.visibility).toBe('visible')

      await page.locator('[data-component="Checkbox"]').click()

      const cleared = await describeCheckmark(page)
      expect(cleared.animationName).toMatch(/checkmarkOut/)
      // The mark is kept visible until the wipe-out has run
      expect(cleared.transitionDelay).toBe('0.23s')
    })
  })
})
