import type {Locator} from '@playwright/test'

export async function activateWithoutPointerFocus(control: Locator) {
  await control.evaluate(element => {
    if (!(element instanceof HTMLButtonElement)) throw new Error('Expected a button element')
    element.click()
  })
}
