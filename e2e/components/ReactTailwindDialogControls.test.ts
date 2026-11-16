import path from 'node:path'
import {expect, test} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/dialog-controls-browser.tsx', process.env.BASE_UI_REACT_DIR)
})

const cases = [
  {trigger: 'native', omit: false},
  {trigger: 'native', omit: true},
  {trigger: 'render', omit: false},
  {trigger: 'render', omit: true},
  {trigger: 'render-omits', omit: false},
] as const

for (const {trigger: triggerKind, omit} of cases) {
  const removesControls = omit || triggerKind === 'render-omits'

  test(`${triggerKind} dialog trigger ${removesControls ? 'omits' : 'retains'} its popup relationship @aat`, async ({
    page,
  }) => {
    await page.setViewportSize({width: 320, height: 600})
    await page.goto(`about:blank?trigger=${triggerKind}&omit=${omit}`)
    await page.evaluate(() => {
      document.documentElement.lang = 'en'
      document.title = 'Dialog trigger'
      const root = document.createElement('main')
      root.id = 'root'
      document.body.append(root)
    })
    await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
    await page.addScriptTag({content: fixtureScript})

    const trigger = page.locator('[data-component="Dialog.Trigger"]')
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).not.toHaveAttribute('aria-controls')
    await trigger.focus()
    await page.keyboard.press('Enter')

    const dialog = page.getByRole('dialog', {name: 'Settings'})
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    if (removesControls) {
      await expect(trigger).not.toHaveAttribute('aria-controls')
    } else {
      const dialogId = await dialog.getAttribute('id')
      if (!dialogId) throw new Error('Expected the dialog to have an id.')
      await expect(trigger).toHaveAttribute('aria-controls', dialogId)
    }

    const close = dialog.getByRole('button', {name: 'Close', exact: true})
    await expect(close).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(dialog.getByRole('textbox', {name: 'Setting'})).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(dialog.getByRole('button', {name: 'Cancel'})).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(dialog.getByRole('button', {name: 'Save'})).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(close).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
}

test('a level-one dialog title retains its accessible name @aat', async ({page}) => {
  await page.goto('about:blank?trigger=native&title=h1')
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    document.title = 'Dialog title'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
  await page.getByRole('button', {name: 'Open settings'}).click()

  const dialog = page.getByRole('dialog', {name: 'Settings'})
  const title = dialog.getByRole('heading', {level: 1, name: 'Settings'})
  const titleId = await title.getAttribute('id')
  if (!titleId) throw new Error('Expected the dialog title to have an id.')
  await expect(dialog).toHaveAttribute('aria-labelledby', titleId)
  await expect(title).toHaveAttribute('data-component', 'Dialog.Title')
  await expect(dialog.getByRole('button', {name: 'Close', exact: true})).toBeFocused()
})

test('disabling pointer dismissal preserves a focus-trapping dialog draft @aat', async ({page}) => {
  await page.goto('about:blank?trigger=native&modal=trap-focus&disablePointerDismissal=true')
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    document.title = 'Focus-trapping dialog'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
  const trigger = page.locator('[data-component="Dialog.Trigger"]')
  await trigger.click()

  const dialog = page.getByRole('dialog', {name: 'Settings'})
  await expect(dialog).toBeVisible()
  const draft = dialog.getByRole('textbox', {name: 'Setting'})
  await draft.fill('unsaved draft')
  const outside = page.getByTestId('outside')
  const outsideBox = await outside.boundingBox()
  if (!outsideBox) throw new Error('Expected an outside control with a bounding box.')
  await page.mouse.move(outsideBox.x + outsideBox.width / 2, outsideBox.y + outsideBox.height / 2)
  await page.mouse.down()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await page.mouse.move(900, 50)
  await page.mouse.up()
  await expect(outside).toHaveText('Outside clicks: 0')
  await expect(dialog).toBeVisible()
  await expect(draft).toHaveValue('unsaved draft')

  await page.mouse.click(outsideBox.x + outsideBox.width / 2, outsideBox.y + outsideBox.height / 2)
  await expect(outside).toHaveText('Outside clicks: 1')
  await expect(dialog).toBeVisible()
  await expect(draft).toHaveValue('unsaved draft')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})
