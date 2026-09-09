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
  test('link variant underlines only the label', async ({page}) => {
    await visit(page, {
      id: 'components-button-dev--link-variant-with-underline-preference',
    })

    const preferenceOnButton = page.locator('[data-a11y-link-underlines="true"]').getByRole('button').nth(1)
    const preferenceOnLabel = preferenceOnButton.locator('[data-component="text"]')

    await expect(preferenceOnButton).toHaveCSS('text-decoration-line', 'none')
    await expect(preferenceOnButton).toHaveCSS('background-image', 'none')
    await expect(preferenceOnLabel).toHaveCSS('text-decoration-line', 'underline')
    await expect(preferenceOnLabel).toHaveCSS('text-underline-offset', '2px')

    await preferenceOnButton.hover()
    await expect(preferenceOnButton).toHaveCSS('text-decoration-line', 'none')
    await expect(preferenceOnButton).toHaveCSS('background-image', 'none')
    await expect(preferenceOnLabel).toHaveCSS('text-decoration-line', 'none')

    const preferenceOffButton = page.locator('[data-a11y-link-underlines="false"]').getByRole('button').nth(1)
    const preferenceOffLabel = preferenceOffButton.locator('[data-component="text"]')

    await expect(preferenceOffButton).toHaveCSS('text-decoration-line', 'none')
    await expect(preferenceOffButton).toHaveCSS('background-image', 'none')
    await expect(preferenceOffLabel).toHaveCSS('text-decoration-line', 'none')

    await preferenceOffButton.hover()
    await expect(preferenceOffButton).toHaveCSS('text-decoration-line', 'none')
    await expect(preferenceOffButton).toHaveCSS('background-image', 'none')
    await expect(preferenceOffLabel).toHaveCSS('text-decoration-line', 'underline')
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
