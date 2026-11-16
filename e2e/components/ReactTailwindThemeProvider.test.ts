import {expect, test} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test('applies the documented high-contrast schemes in explicit and automatic modes', async ({page}) => {
  await page.emulateMedia({colorScheme: 'light'})
  await visit(page, {id: 'react-tailwind-behaviors-themeprovider-features--high-contrast-schemes'})

  const expected = await page.evaluate(() => {
    function foreground(mode: 'light' | 'dark', scheme: string) {
      const element = document.createElement('div')
      element.setAttribute('data-color-mode', mode)
      element.setAttribute(mode === 'light' ? 'data-light-theme' : 'data-dark-theme', scheme)
      document.body.append(element)
      const value = getComputedStyle(element).getPropertyValue('--fgColor-default').trim()
      element.remove()
      return value
    }
    return {
      light: foreground('light', 'light'),
      lightHighContrast: foreground('light', 'light_high_contrast'),
      dark: foreground('dark', 'dark'),
      darkHighContrast: foreground('dark', 'dark_high_contrast'),
    }
  })

  expect(expected.lightHighContrast).toBeTruthy()
  expect(expected.darkHighContrast).toBeTruthy()
  expect(expected.lightHighContrast).not.toBe(expected.light)
  expect(expected.darkHighContrast).not.toBe(expected.dark)

  const light = page.getByTestId('light-high-contrast')
  const dark = page.getByTestId('dark-high-contrast')
  const auto = page.getByTestId('auto-high-contrast')
  const foreground = (element: typeof light) =>
    element.evaluate(node => getComputedStyle(node).getPropertyValue('--fgColor-default').trim())

  await expect(light).toHaveAttribute('data-light-theme', 'light_high_contrast')
  await expect(dark).toHaveAttribute('data-dark-theme', 'dark_high_contrast')
  await expect(auto).toHaveAttribute('data-color-mode', 'auto')
  await expect.poll(() => foreground(light)).toBe(expected.lightHighContrast)
  await expect.poll(() => foreground(dark)).toBe(expected.darkHighContrast)
  await expect.poll(() => foreground(auto)).toBe(expected.lightHighContrast)
  await expect(page.getByTestId('resolved-mode')).toHaveText('light')

  await page.emulateMedia({colorScheme: 'dark'})
  await expect.poll(() => foreground(auto)).toBe(expected.darkHighContrast)
  await expect(page.getByTestId('resolved-mode')).toHaveText('dark')
})
