import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('React Tailwind FormControl nonnative label', () => {
  for (const theme of themes) {
    test(`preserves names, descriptions, and field focus in ${theme} @aat`, async ({page}) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      await visit(page, {
        id: 'react-tailwind-forms-formcontrol-features--with-nonnative-label',
        globals: {colorScheme: theme},
      })
      const label = page.locator('[data-component="FormControl.Label"]')
      const input = page.getByRole('textbox', {name: 'Script', exact: true})
      await expect(label).toHaveJSProperty('tagName', 'SPAN')
      await expect(label).not.toHaveAttribute('for')
      await expect(input).toHaveAttribute('aria-labelledby', (await label.getAttribute('id'))!)
      await expect(input).toHaveAccessibleDescription('Enter a script')
      await label.click()
      await expect(input).toBeFocused()
      await page.getByRole('button', {name: 'Before', exact: true}).focus()
      await page.keyboard.press('Tab')
      await expect(input).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(page.getByRole('button', {name: 'After', exact: true})).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(input).toBeFocused()
      await expect(page).toHaveNoViolations()
      expect(errors).toEqual([])
    })
  }
})

const stories = [
  {
    title: 'Default',
    id: 'components-formcontrol--default',
  },
  {
    title: 'Custom Required',
    id: 'components-formcontrol-features--custom-required',
  },
  {
    title: 'Disabled Inputs',
    id: 'components-formcontrol-features--disabled-inputs',
  },
  {
    title: 'With Custom Input',
    id: 'components-formcontrol-features--with-custom-input',
  },
  {
    title: 'Single Input',
    id: 'components-formcontrol-features--single-input',
  },
  {
    title: 'Validation Example',
    id: 'components-formcontrol-features--validation-example',
  },
  {
    title: 'With Checkbox And Radio Inputs',
    id: 'components-formcontrol-features--with-checkbox-and-radio-inputs',
  },
  {
    title: 'With Complex Inputs',
    id: 'components-formcontrol-features--with-complex-inputs',
  },
  {
    title: 'With Leading Visual',
    id: 'components-formcontrol-features--with-leading-visual',
  },
  {
    title: 'With Select Panel',
    id: 'components-formcontrol-features--with-select-panel',
  },
  {
    title: 'With Caption',
    id: 'components-formcontrol-features--with-caption',
  },
  {
    title: 'With Caption And Disabled',
    id: 'components-formcontrol-features--with-caption-and-disabled',
  },
  {
    title: 'With Hidden Label',
    id: 'components-formcontrol-features--with-hidden-label',
  },
  {
    title: 'With Required Indicator',
    id: 'components-formcontrol-features--with-required-indicator',
  },
  {
    title: 'With Success Validation',
    id: 'components-formcontrol-features--with-success-validation',
  },
  {
    title: 'With Error Validation',
    id: 'components-formcontrol-features--with-error-validation',
  },
] as const

test.describe('React Tailwind FormControl standalone validation', () => {
  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`standalone and associated messages update independently in ${theme} @aat`, async ({page}) => {
      const pageErrors: string[] = []
      page.on('pageerror', error => pageErrors.push(error.message))
      await page.setViewportSize({width: 320, height: 800})
      await visit(page, {
        id: 'react-tailwind-forms-formcontrol-features--standalone-validation',
        globals: {colorScheme: theme},
      })
      const suggestion = page.getByRole('textbox', {name: 'Suggestion', exact: true})
      const repository = page.getByRole('textbox', {name: 'Repository', exact: true})
      await expect(suggestion).toHaveAttribute('aria-invalid', 'true')
      await expect(suggestion).toHaveAccessibleDescription('Suggestion could not be applied.')
      await expect(repository).toHaveAttribute('aria-invalid', 'true')
      await expect(repository).toHaveAccessibleDescription('Enter a valid repository.')
      await expect(page.getByRole('alert')).toHaveText('Suggestion could not be applied.')
      await suggestion.fill('Edited suggestion')
      const toggle = page.getByRole('button', {name: 'Toggle validation'})
      await toggle.focus()
      await page.keyboard.press('Enter')
      await expect(page.getByRole('status').filter({hasText: 'Suggestion applied.'})).toBeVisible()
      await expect(page.getByRole('alert')).toHaveCount(0)
      await expect(suggestion).not.toHaveAttribute('aria-invalid')
      await expect(suggestion).not.toHaveAttribute('aria-describedby')
      await expect(suggestion).toHaveValue('Edited suggestion')
      await expect(repository).not.toHaveAttribute('aria-invalid')
      await expect(repository).toHaveAccessibleDescription('Repository is valid.')
      await page.keyboard.press('Enter')
      await expect(page.getByRole('alert')).toHaveText('Suggestion could not be applied.')
      await expect(suggestion).toHaveAccessibleDescription('Suggestion could not be applied.')
      await expect(repository).toHaveAccessibleDescription('Enter a valid repository.')
      await expect(suggestion).toHaveValue('Edited suggestion')
      await expect(toggle).toBeFocused()
      await expect(page).toHaveNoViolations()
      expect(pageErrors).toEqual([])
    })
  }
})

test.describe('FormControl', () => {
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
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `FormControl.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
