import path from 'node:path'
import {expect, test} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/dialog-menu-handoff-browser.tsx')
})

for (const child of ['inline', 'external'] as const) {
  for (const width of [375, 1280]) {
    for (const input of ['keyboard', 'pointer'] as const) {
      test(`${child} child dialog retains focus after ${input} menu activation at ${width}px @aat`, async ({page}) => {
        await page.setViewportSize({width, height: 720})
        await page.goto(`about:blank?child=${child}`)
        await page.evaluate(() => {
          document.documentElement.lang = 'en'
          for (const id of ['root', 'external-root']) {
            const element = document.createElement('div')
            element.id = id
            document.body.append(element)
          }
        })
        await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
        await page.addStyleTag({content: ':root { --zIndex-modal: 400; --zIndex-popover: 500; }'})
        await page.addScriptTag({content: fixtureScript})

        const parent = page.getByRole('dialog', {name: 'Navigation'})
        const trigger = parent.getByRole('button', {name: 'Open menu'})
        await expect(parent).toBeVisible()
        if (input === 'keyboard') {
          await trigger.focus()
          await page.keyboard.press('Enter')
        } else {
          await trigger.click()
        }

        const item = page.getByRole('menuitem', {name: 'Start a session'})
        await expect(item).toBeVisible()
        if (input === 'keyboard') {
          await expect(item).toBeFocused()
          await page.keyboard.press('Enter')
        } else {
          await item.click()
        }

        const dialog = page.getByRole('dialog', {name: 'Start session'})
        const textarea = dialog.getByRole('textbox', {name: 'Prompt'})
        await expect(dialog).toHaveAttribute('aria-modal', 'true')
        await expect(textarea).toBeFocused()
        await page.evaluate(
          () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
        )
        await expect(textarea).toBeFocused()
        expect(await textarea.evaluate(element => Boolean(element.closest('[aria-hidden="true"], [inert]')))).toBe(
          false,
        )

        for (let count = 0; count < 4; count++) {
          await page.keyboard.press('Tab')
          await expect
            .poll(() => dialog.evaluate(element => element.contains(element.ownerDocument.activeElement)))
            .toBe(true)
        }
        await page.keyboard.press('Escape')
        await expect(dialog).toBeHidden()
        await expect(trigger).toBeFocused()

        await trigger.click()
        await expect(item).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(item).toBeHidden()
        await expect(trigger).toBeFocused()

        await page.mouse.click(5, 5)
        await expect(parent).toBeHidden()
      })
    }
  }
}
