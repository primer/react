import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Danger',
    id: 'components-button-features--danger',
  },
  {
    title: 'Default',
    id: 'components-button--default',
  },
  {
    title: 'Disabled',
    id: 'components-button-features--disabled',
  },
  {
    title: 'Invisible',
    id: 'components-button-features--invisible',
  },
  {
    title: 'Link',
    id: 'components-button-features--link',
  },
  {
    title: 'Leading Visual',
    id: 'components-button-features--leading-visual',
  },
  {
    title: 'Medium',
    id: 'components-button-features--medium',
  },
  {
    title: 'Primary',
    id: 'components-button-features--primary',
  },
  {
    title: 'Small',
    id: 'components-button-features--small',
  },
  {
    title: 'Trailing Action',
    id: 'components-button-features--trailing-action',
  },
  {
    title: 'Trailing Counter',
    id: 'components-button-features--trailing-counter',
  },
  {
    title: 'Trailing Visual',
    id: 'components-button-features--trailing-visual',
  },
  {
    title: 'Inactive',
    id: 'components-button-features--inactive',
  },
  {
    title: 'Loading',
    id: 'components-button-features--loading',
  },
  {
    title: 'Loading With Leading Visual',
    id: 'components-button-features--loading-with-leading-visual',
  },
  {
    title: 'Loading With Trailing Visual',
    id: 'components-button-features--loading-with-trailing-visual',
  },
  {
    title: 'Loading With Trailing Action',
    id: 'components-button-features--loading-with-trailing-action',
  },
  {
    title: 'Dev Invisible Variants',
    id: 'components-button-dev--invisible-variants',
  },
  {
    title: 'Aria Expanded Buttons',
    id: 'components-button-features--expanded-button',
  },
  {
    title: 'Dev Disabled Variants',
    id: 'components-button-dev--disabled-button-variants',
  },
  {
    title: 'Trailing Counter No Text',
    id: 'components-button-features--trailing-counter-with-no-text',
  },
  {
    title: 'Keybinding Hint',
    id: 'components-button-features--keybinding-hint-basic',
  },
  {
    title: 'Keybinding Hint All Variants',
    id: 'components-button-features--keybinding-hint-all-variants',
  },
  {
    title: 'Keybinding Hint All Sizes',
    id: 'components-button-features--keybinding-hint-all-sizes',
  },
  {
    title: 'Keybinding Hint With Leading Visual',
    id: 'components-button-features--keybinding-hint-with-leading-visual',
  },
  {
    title: 'Dev Link Variant With Underline Preference',
    id: 'components-button-dev--link-variant-with-underline-preference',
  },
] as const

test.describe('Button', () => {
  test('link variant limits visual button underlines to the label', async ({page}) => {
    await visit(page, {
      id: 'components-button-dev--link-variant-with-underline-preference',
    })

    const button = (preference: 'on' | 'off', hasVisual: boolean) => {
      const visual = page.locator(
        '[data-component="leadingVisual"], [data-component="trailingVisual"], [data-component="trailingAction"]',
      )
      const preferenceButton = page
        .locator(`[data-a11y-link-underlines="${preference === 'on'}"]`)
        .getByRole('button', {name: `Underline pref ${preference}`})

      return preferenceButton.filter(hasVisual ? {has: visual} : {hasNot: visual})
    }

    const preferenceOnTextButton = button('on', false)
    await expect(preferenceOnTextButton).toHaveCSS('text-decoration-line', 'underline')
    await preferenceOnTextButton.hover()
    await expect(preferenceOnTextButton).toHaveCSS('text-decoration-line', 'none')
    await page.mouse.move(0, 0)

    const preferenceOnVisualButton = button('on', true)
    const preferenceOnVisualLabel = preferenceOnVisualButton.locator('[data-component="text"]')
    await expect(preferenceOnVisualButton).toHaveCSS('text-decoration-line', 'none')
    await expect(preferenceOnVisualButton).toHaveCSS('background-image', 'none')
    await expect(preferenceOnVisualLabel).toHaveCSS('text-decoration-line', 'underline')
    await expect(preferenceOnVisualLabel).toHaveCSS('text-underline-offset', '2px')
    await preferenceOnVisualButton.hover()
    await expect(preferenceOnVisualLabel).toHaveCSS('text-decoration-line', 'none')

    await preferenceOnVisualButton.evaluate(element => element.setAttribute('aria-disabled', 'true'))
    await expect(preferenceOnVisualLabel).toHaveCSS('text-decoration-line', 'underline')

    await preferenceOnVisualButton.evaluate(element => {
      element.removeAttribute('aria-disabled')
      element.setAttribute('data-inactive', 'true')
    })
    await expect(preferenceOnVisualLabel).toHaveCSS('text-decoration-line', 'underline')
    await page.mouse.move(0, 0)

    const preferenceOffTextButton = button('off', false)
    await expect(preferenceOffTextButton).toHaveCSS('text-decoration-line', 'none')
    await preferenceOffTextButton.hover()
    await expect(preferenceOffTextButton).toHaveCSS('text-decoration-line', 'underline')
    await page.mouse.move(0, 0)

    const preferenceOffVisualButton = button('off', true)
    const preferenceOffVisualLabel = preferenceOffVisualButton.locator('[data-component="text"]')
    await expect(preferenceOffVisualButton).toHaveCSS('text-decoration-line', 'none')
    await expect(preferenceOffVisualButton).toHaveCSS('background-image', 'none')
    await expect(preferenceOffVisualLabel).toHaveCSS('text-decoration-line', 'none')
    await preferenceOffVisualButton.hover()
    await expect(preferenceOffVisualLabel).toHaveCSS('text-decoration-line', 'underline')

    await preferenceOffVisualButton.evaluate(element => element.setAttribute('aria-disabled', 'true'))
    await expect(preferenceOffVisualLabel).toHaveCSS('text-decoration-line', 'none')

    await preferenceOffVisualButton.evaluate(element => {
      element.removeAttribute('aria-disabled')
      element.setAttribute('data-inactive', 'true')
    })
    await expect(preferenceOffVisualLabel).toHaveCSS('text-decoration-line', 'none')
  })

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
            })

            // Default state
            await expect(page).toHaveScreenshot(`Button.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
