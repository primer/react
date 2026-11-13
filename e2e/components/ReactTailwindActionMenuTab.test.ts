import path from 'node:path'
import {expect, test, type Page} from '@playwright/test'
import {build} from 'vite'

const packageRoot = path.resolve(__dirname, '../../packages/react-tailwind')
let fixtureScript: string

test.beforeAll(async () => {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    root: packageRoot,
    resolve: {dedupe: ['react', 'react-dom']},
    define: {'process.env.NODE_ENV': JSON.stringify('production')},
    oxc: {jsx: {runtime: 'automatic'}},
    build: {
      write: false,
      minify: false,
      lib: {
        entry: path.join(packageRoot, 'script/actionmenu-tab-browser.tsx'),
        formats: ['iife'],
        name: 'ActionMenuTabFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('ActionMenu tab fixture build did not return a script')
  fixtureScript = script.code
})

async function setup(page: Page, mode: string, modal = false, portal = true) {
  await page.goto(`about:blank?mode=${mode}&modal=${modal}&portal=${portal}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    document.title = 'Menu keyboard focus'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/theme.css')})
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
}

for (const modal of [false, true]) {
  for (const portal of [false, true]) {
    test(`documents Tab traversal from pointer- and keyboard-opened menus (modal=${modal}, portal=${portal}) @aat`, async ({
      page,
    }) => {
      await setup(page, 'uncontrolled', modal, portal)
      const previous = page.getByRole('button', {name: 'Previous control', exact: true})
      const next = page.getByRole('button', {name: 'Next control', exact: true})
      const trigger = page.getByRole('button', {name: 'Options', exact: true})
      const menu = page.getByRole('menu', {name: 'Options menu', exact: true})

      await trigger.click()
      await expect(menu).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(menu).toBeHidden()
      await expect(trigger).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(previous).toBeFocused()

      await trigger.focus()
      await page.keyboard.press('Enter')
      await expect(page.getByRole('menuitemradio', {name: 'First option'})).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(menu).toBeHidden()
      await expect(trigger).toBeFocused()

      await trigger.click()
      await expect(menu).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(menu).toBeHidden()
      await expect(next).toBeFocused()
    })
  }
}

test('a controlled close request returns focus to the trigger @aat', async ({page}) => {
  await setup(page, 'controlled')
  const trigger = page.getByRole('button', {name: 'Options', exact: true})
  await trigger.click()
  await expect(page.getByRole('menu', {name: 'Options menu'})).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('menu', {name: 'Options menu'})).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.getByTestId('last-request')).toHaveText('close:focus-out')
})

for (const mode of ['reject', 'cancel', 'cancel-uncontrolled'] as const) {
  const closeDescription =
    mode === 'reject'
      ? 'controlled rejection'
      : mode === 'cancel'
        ? 'controlled cancellation'
        : 'uncontrolled cancellation'
  for (const modal of [false, true]) {
    for (const opening of ['pointer', 'keyboard'] as const) {
      test(`${closeDescription} keeps the ${opening}-opened menu visible (modal=${modal}) @aat`, async ({page}) => {
        await setup(page, mode, modal)
        const trigger = page.getByRole('button', {name: 'Options', exact: true})
        const menu = page.getByRole('menu', {name: 'Options menu'})
        if (opening === 'pointer') {
          await trigger.click()
          await expect(menu).toBeFocused()
        } else {
          await trigger.focus()
          await page.keyboard.press('Enter')
          await expect(page.getByRole('menuitemradio', {name: 'First option'})).toBeFocused()
        }
        await page.keyboard.press('Shift+Tab')
        await expect(menu).toBeVisible()
        await expect(trigger).toBeFocused()
        await expect(page.getByTestId('last-request')).toHaveText('close:focus-out')
        await page.evaluate(
          () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
        )
        await expect(menu).toBeVisible()
        await expect(trigger).toBeFocused()

        await menu.getByRole('menuitem', {name: 'Allow root close'}).click()
        await page.keyboard.press('Shift+Tab')
        await expect(menu).toBeHidden()
        await expect(trigger).toBeFocused()
      })
    }
  }
}

test('an explicit final focus target is honored after reverse traversal @aat', async ({page}) => {
  await setup(page, 'custom-final')
  await page.getByRole('button', {name: 'Options', exact: true}).click()
  await expect(page.getByRole('menu', {name: 'Options menu'})).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('menu', {name: 'Options menu'})).toBeHidden()
  await expect(page.getByRole('button', {name: 'Custom return target'})).toBeFocused()
})

test('documents preventFocusOnClose during reverse traversal @aat', async ({page}) => {
  await setup(page, 'prevent-return')
  const trigger = page.getByRole('button', {name: 'Options', exact: true})
  const menu = page.getByRole('menu', {name: 'Options menu'})
  await trigger.click()
  await expect(menu).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('accepted reverse traversal restores focus when close stays mounted @aat', async ({page}) => {
  await setup(page, 'keep-mounted')
  const trigger = page.getByRole('button', {name: 'Options', exact: true})
  const menu = page.getByRole('menu', {name: 'Options menu'})
  await trigger.click()
  await expect(menu).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(menu).toBeHidden()
  await expect(page.locator('[data-component="ActionMenu.Content"]')).toHaveCount(1)
  await expect(trigger).toBeFocused()
  await page.getByRole('button', {name: 'Finish closing'}).click()
  await expect(page.locator('[data-component="ActionMenu.Content"]')).toHaveCount(0)
})

test('documents a custom return target when close stays mounted @aat', async ({page}) => {
  await setup(page, 'custom-keep')
  const menu = page.getByRole('menu', {name: 'Options menu'})
  const trigger = page.getByRole('button', {name: 'Options', exact: true})
  const customTarget = page.getByRole('button', {name: 'Custom return target'})
  await trigger.click()
  await expect(menu).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(menu).toBeHidden()
  await expect(page.locator('[data-component="ActionMenu.Content"]')).toHaveCount(1)
  await expect(trigger).toBeFocused()
  await expect(customTarget).not.toBeFocused()
  await page.getByRole('button', {name: 'Finish closing'}).click()
  await expect(page.locator('[data-component="ActionMenu.Content"]')).toHaveCount(0)
})

test('an item can transfer focus from the closing menu to a dialog @aat', async ({page}) => {
  await setup(page, 'handoff')
  await page.getByRole('button', {name: 'Options', exact: true}).click()
  await page.getByRole('menuitem', {name: 'Open editor'}).click()
  const editor = page.getByRole('dialog', {name: 'Editor'})
  await expect(editor).toBeVisible()
  await expect(editor.getByRole('button', {name: 'Editor control'})).toBeFocused()
  await page.evaluate(
    () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  )
  await expect(editor.getByRole('button', {name: 'Editor control'})).toBeFocused()
})

test('outside dismissal does not pull focus away from the clicked control @aat', async ({page}) => {
  await setup(page, 'uncontrolled')
  await page.getByRole('button', {name: 'Options', exact: true}).click()
  await expect(page.getByRole('menu', {name: 'Options menu'})).toBeFocused()
  const next = page.getByRole('button', {name: 'Next control', exact: true})
  await next.click()
  await expect(page.getByRole('menu', {name: 'Options menu'})).toBeHidden()
  await expect(next).toBeFocused()
})

test('reverse traversal from a submenu returns to its parent item @aat', async ({page}) => {
  await setup(page, 'uncontrolled')
  await page.getByRole('button', {name: 'Options', exact: true}).click()
  await expect(page.getByRole('menu', {name: 'Options menu'})).toBeFocused()
  await page.keyboard.press('End')
  const submenuTrigger = page.getByRole('menuitem', {name: 'More options'})
  await expect(submenuTrigger).toBeFocused()
  await page.keyboard.press('ArrowRight')
  const submenu = page.getByRole('menu', {name: 'More options menu'})
  await expect(submenu).toBeVisible()
  await expect(page.getByRole('menuitem', {name: 'Nested option'})).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(submenu).toBeHidden()
  await expect(submenuTrigger).toBeFocused()
  await expect(page.getByRole('menu', {name: 'Options menu'})).toBeVisible()
})

for (const mode of ['submenu-reject', 'submenu-cancel', 'submenu-cancel-uncontrolled'] as const) {
  test(`${mode} preserves the open submenu and accepts a later close @aat`, async ({page}) => {
    await setup(page, mode)
    await page.getByRole('button', {name: 'Options', exact: true}).click()
    await expect(page.getByRole('menu', {name: 'Options menu'})).toBeFocused()
    await page.keyboard.press('End')
    const submenuTrigger = page.getByRole('menuitem', {name: 'More options'})
    await expect(submenuTrigger).toBeFocused()
    await page.keyboard.press('ArrowRight')
    const submenu = page.getByRole('menu', {name: 'More options menu'})
    const nestedItem = page.getByRole('menuitem', {name: 'Nested option'})
    await expect(nestedItem).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(submenu).toBeVisible()
    await expect(submenuTrigger).toBeFocused()
    await expect(page.getByTestId('last-request')).toHaveText('submenu:close:focus-out')

    await submenu.getByRole('menuitem', {name: 'Allow submenu close'}).click()
    await page.keyboard.press('Shift+Tab')
    await expect(submenu).toBeHidden()
    await expect(submenuTrigger).toBeFocused()
    await expect(page.getByRole('menu', {name: 'Options menu'})).toBeVisible()
  })
}
