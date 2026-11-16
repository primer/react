import {expect, test} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test('a focused dialog body keeps focus until blur after overflow ends @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 320})
  await visit(page, {id: 'react-tailwind-components-dialog-features--centered-long-content'})

  const trigger = page.getByRole('button', {name: 'Show dialog'})
  await trigger.focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog')
  const close = dialog.getByRole('button', {name: 'Close', exact: true})
  const body = dialog.locator('[data-component="Dialog.Body"]')
  await expect(close).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(body).toBeFocused()
  await expect(body).toHaveAttribute('tabindex', '0')
  await expect.poll(() => body.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0)

  await page.keyboard.press('End')
  await expect.poll(() => body.evaluate(element => element.scrollTop)).toBeGreaterThan(0)

  await page.setViewportSize({width: 1280, height: 1600})
  await expect.poll(() => body.evaluate(element => element.scrollHeight - element.clientHeight)).toBeLessThanOrEqual(1)
  await page.evaluate(
    () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  )
  await expect(body).toBeFocused()
  await expect(body).toHaveAttribute('tabindex', '0')

  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', {name: 'Cancel'})).toBeFocused()
  await expect(body).not.toHaveAttribute('tabindex')
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})
