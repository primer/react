import {expect, test} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test('a focused scroll region keeps its semantics when its content fits', async ({page}) => {
  await page.setViewportSize({width: 800, height: 600})
  await visit(page, {id: 'react-tailwind-components-scrollableregion-features--horizontal-overflow'})
  const region = page.locator('[data-component="ScrollableRegion"]')
  const content = region.getByText('Wide content')
  await page.evaluate(() => {
    const input = document.createElement('input')
    input.setAttribute('aria-label', 'Continue')
    document.body.append(input)
  })

  await expect(page.getByRole('region', {name: 'Wide content'})).toHaveAttribute('tabindex', '0')
  await region.focus()
  await expect(region).toBeFocused()

  await content.evaluate(element => {
    element.setAttribute('style', 'width: 100px')
  })
  await expect.poll(() => region.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0)
  await page.evaluate(
    () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  )
  await expect(region).toBeFocused()
  await expect(region).toHaveAttribute('role', 'region')
  await expect(region).toHaveAttribute('aria-label', 'Wide content')
  await expect(region).toHaveAttribute('tabindex', '0')

  await page.keyboard.press('Tab')
  await expect(page.getByRole('textbox', {name: 'Continue'})).toBeFocused()
  await expect(region).not.toHaveAttribute('role')
  await expect(region).not.toHaveAttribute('aria-label')
  await expect(region).not.toHaveAttribute('tabindex')

  await content.evaluate(element => {
    element.setAttribute('style', 'width: 768px')
  })
  await expect(page.getByRole('region', {name: 'Wide content'})).toHaveAttribute('tabindex', '0')
})
