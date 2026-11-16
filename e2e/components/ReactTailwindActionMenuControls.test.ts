import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import path from 'node:path'
import {expect, test} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

const packageRequire = createRequire(path.join(reactTailwindPackageRoot, 'package.json'))
const baseUiManifest = process.env.BASE_UI_REACT_DIR
  ? path.join(process.env.BASE_UI_REACT_DIR, 'package.json')
  : packageRequire.resolve('@base-ui/react/package.json')
const baseUiPackage: unknown = JSON.parse(readFileSync(baseUiManifest, 'utf8'))
if (!baseUiPackage || typeof baseUiPackage !== 'object' || !('version' in baseUiPackage)) {
  throw new Error('Expected the Base UI package to have a version.')
}
const baseUiVersion = baseUiPackage.version
let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture(
    'script/actionmenu-controls-browser.tsx',
    process.env.BASE_UI_REACT_DIR,
  )
})

for (const triggerKind of ['button', 'primitive', 'render', 'icon', 'tooltip'] as const) {
  for (const omitControls of [false, true]) {
    test(`${triggerKind} menu trigger ${omitControls ? 'omits' : 'retains'} its popup relationship @aat`, async ({
      page,
    }) => {
      await page.setViewportSize({width: 320, height: 600})
      await page.goto(`about:blank?trigger=${triggerKind}&omit=${omitControls}`)
      await page.evaluate(() => {
        document.documentElement.lang = 'en'
        document.title = 'Menu trigger'
        const root = document.createElement('main')
        root.id = 'root'
        document.body.append(root)
      })
      await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
      await page.addScriptTag({content: fixtureScript})

      const trigger = page.getByRole('button', {name: 'Direct'})
      await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
      await expect(trigger).toHaveAttribute('aria-expanded', 'false')
      await trigger.focus()
      await trigger.press('Enter')

      const menu = page.getByRole('menu', {name: 'Direct'})
      const first = menu.getByRole('menuitem', {name: 'First'})
      const submenuTrigger = menu.getByRole('menuitem', {name: 'More'})
      await expect(first).toBeFocused()
      await expect(trigger).toHaveAttribute('aria-expanded', 'true')
      if (omitControls) {
        await expect(trigger).not.toHaveAttribute('aria-controls')
      } else {
        const menuId = await menu.getAttribute('id')
        if (!menuId) throw new Error('Expected the menu to have an id.')
        await expect(trigger).toHaveAttribute('aria-controls', menuId)
      }

      await page.keyboard.press('End')
      await expect(submenuTrigger).toBeFocused()
      await page.keyboard.press('ArrowRight')
      const submenu = page.getByRole('menu', {name: 'More'})
      await expect(submenu.getByRole('menuitem', {name: 'Nested choice'})).toBeFocused()
      await expect(submenuTrigger).toHaveAttribute('aria-haspopup', 'menu')
      const applePlatform = await page.evaluate(() => {
        const platform = navigator.platform.toLowerCase()
        return platform.startsWith('mac') || /^i(os$|p)/.test(platform)
      })
      if (baseUiVersion === '1.8.0' && applePlatform) {
        // Base UI suppresses this state for keyboard-opened submenus on Apple platforms; AT behavior is unverified.
        await expect(submenuTrigger).not.toHaveAttribute('aria-expanded')
      } else {
        await expect(submenuTrigger).toHaveAttribute('aria-expanded', 'true')
      }
      if (omitControls) {
        await expect(submenuTrigger).not.toHaveAttribute('aria-controls')
      } else {
        const submenuId = await submenu.getAttribute('id')
        if (!submenuId) throw new Error('Expected the submenu to have an id.')
        await expect(submenuTrigger).toHaveAttribute('aria-controls', submenuId)
      }

      await page.keyboard.press('Escape')
      await expect(submenuTrigger).toBeFocused()
      await page.keyboard.press('Home')
      await expect(first).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()
      await expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await trigger.click()
      await expect(trigger).toHaveAttribute('aria-expanded', 'true')
      if (omitControls) await expect(trigger).not.toHaveAttribute('aria-controls')
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()
    })
  }
}
