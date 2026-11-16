import path from 'node:path'
import {expect, test} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture(
    'script/confirmation-dialog-modal-browser.tsx',
    process.env.BASE_UI_REACT_DIR,
  )
})

for (const compound of [false, true]) {
  for (const mode of ['default', 'modal', 'non-modal', 'trap-focus']) {
    test(`${compound ? 'compound' : 'configuration'} ${mode} confirmation dialog preserves modality @aat`, async ({
      page,
    }) => {
      await page.goto(`about:blank?compound=${compound}&mode=${mode}`)
      await page.evaluate(() => {
        document.documentElement.lang = 'en'
        document.title = 'Confirmation dialog modality'
        const root = document.createElement('main')
        root.id = 'root'
        document.body.append(root)
      })
      await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
      await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
      await page.addStyleTag({path: require.resolve('@primer/primitives/dist/css/functional/size/z-index.css')})
      await page.addScriptTag({content: fixtureScript})

      const outside = page.getByTestId('outside')
      const trigger = page.locator('[data-component="ConfirmationDialog.Trigger"]')
      await trigger.focus()
      await page.keyboard.press('Enter')

      const dialog = page.getByRole('alertdialog', {name: 'Continue?'})
      await expect(dialog).toBeVisible()
      if (mode === 'default' || mode === 'modal') {
        await expect(dialog).toHaveAttribute('aria-modal', 'true')
      } else {
        await expect(dialog).not.toHaveAttribute('aria-modal')
      }

      if (mode !== 'non-modal') {
        await dialog.getByRole('button', {name: 'Confirm'}).focus()
        await page.keyboard.press('Tab')
        await expect
          .poll(() => dialog.evaluate(element => element.contains(element.ownerDocument.activeElement)))
          .toBe(true)
      }

      const outsideBox = await outside.boundingBox()
      if (!outsideBox) throw new Error('Expected an outside control with a bounding box.')
      await page.mouse.click(outsideBox.x + outsideBox.width / 2, outsideBox.y + outsideBox.height / 2)
      await expect(outside).toHaveText(`Outside clicks: ${mode === 'default' || mode === 'modal' ? 0 : 1}`)
      await expect(dialog).toBeVisible()

      await dialog.getByRole('button', {name: 'Confirm'}).focus()
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
      await expect(trigger).toBeFocused()
    })
  }

  for (const mode of ['non-modal', 'trap-focus']) {
    test(`${compound ? 'compound' : 'configuration'} ${mode} confirmation retains its draft without pointer dismissal @aat`, async ({
      page,
    }) => {
      await page.goto(`about:blank?compound=${compound}&mode=${mode}&dismissOutside=false&draft=true`)
      await page.evaluate(() => {
        document.documentElement.lang = 'en'
        document.title = 'Confirmation dialog dismissal'
        const root = document.createElement('main')
        root.id = 'root'
        document.body.append(root)
      })
      await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
      await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
      await page.addScriptTag({content: fixtureScript})
      const trigger = page.locator('[data-component="ConfirmationDialog.Trigger"]')
      await trigger.click()

      const dialog = page.getByRole('alertdialog', {name: 'Continue?'})
      await expect(dialog).toBeVisible()
      const draft = dialog.getByRole('textbox', {name: 'Draft'})
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
      if (mode === 'non-modal') {
        await outside.focus()
        await expect(outside).toBeFocused()
        await expect(dialog).toBeVisible()
      }
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
    })
  }

  test(`${compound ? 'compound' : 'configuration'} non-modal confirmation can dismiss on outside interaction @aat`, async ({
    page,
  }) => {
    await page.goto(`about:blank?compound=${compound}&mode=non-modal&dismissOutside=true`)
    await page.evaluate(() => {
      document.documentElement.lang = 'en'
      document.title = 'Confirmation dialog outside interaction'
      const root = document.createElement('main')
      root.id = 'root'
      document.body.append(root)
    })
    await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
    await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
    await page.addScriptTag({content: fixtureScript})
    await page.locator('[data-component="ConfirmationDialog.Trigger"]').click()

    const dialog = page.getByRole('alertdialog', {name: 'Continue?'})
    const outside = page.getByTestId('outside')
    const outsideBox = await outside.boundingBox()
    if (!outsideBox) throw new Error('Expected an outside control with a bounding box.')
    await page.mouse.click(outsideBox.x + outsideBox.width / 2, outsideBox.y + outsideBox.height / 2)
    await expect(outside).toHaveText('Outside clicks: 1')
    await expect(dialog).toBeHidden()
  })

  test(`${compound ? 'compound' : 'configuration'} confirmation updates modality while open @aat`, async ({page}) => {
    await page.goto(`about:blank?compound=${compound}&mode=modal&dynamic=true`)
    await page.evaluate(() => {
      document.documentElement.lang = 'en'
      document.title = 'Changing confirmation modality'
      const root = document.createElement('main')
      root.id = 'root'
      document.body.append(root)
    })
    await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
    await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
    await page.addScriptTag({content: fixtureScript})
    await page.getByRole('button', {name: 'Open confirmation'}).click()

    const dialog = page.getByRole('alertdialog', {name: 'Continue?'})
    const outside = page.getByTestId('outside')
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await dialog.getByRole('button', {name: 'Allow outside interaction'}).click()
    await expect(dialog).not.toHaveAttribute('aria-modal')

    const outsideBox = await outside.boundingBox()
    if (!outsideBox) throw new Error('Expected an outside control with a bounding box.')
    await page.mouse.click(outsideBox.x + outsideBox.width / 2, outsideBox.y + outsideBox.height / 2)
    await expect(outside).toHaveText('Outside clicks: 1')
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', {name: 'Restore modal interaction'}).click()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await page.mouse.click(outsideBox.x + outsideBox.width / 2, outsideBox.y + outsideBox.height / 2)
    await expect(outside).toHaveText('Outside clicks: 1')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test(`${compound ? 'compound' : 'configuration'} trigger can omit its popup relationship @aat`, async ({page}) => {
    await page.goto(`about:blank?compound=${compound}&mode=default&omit=true`)
    await page.evaluate(() => {
      document.documentElement.lang = 'en'
      document.title = 'Confirmation dialog trigger'
      const root = document.createElement('main')
      root.id = 'root'
      document.body.append(root)
    })
    await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
    await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
    await page.addScriptTag({content: fixtureScript})

    const trigger = page.locator('[data-component="ConfirmationDialog.Trigger"]')
    await trigger.focus()
    await page.keyboard.press('Enter')

    const dialog = page.getByRole('alertdialog', {name: 'Continue?'})
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(trigger).not.toHaveAttribute('aria-controls')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })
}

test.describe('touch cancellation', () => {
  test.use({hasTouch: true})

  for (const compound of [false, true]) {
    for (const mode of ['non-modal', 'trap-focus']) {
      test(`${compound ? 'compound' : 'configuration'} ${mode} confirmation retains its draft @aat`, async ({
        browserName,
        page,
      }) => {
        // eslint-disable-next-line playwright/no-skipped-test
        test.skip(browserName !== 'chromium', 'Trusted touch cancellation requires Chromium CDP.')
        await page.goto(`about:blank?compound=${compound}&mode=${mode}&dismissOutside=true&draft=true`)
        await page.evaluate(() => {
          document.documentElement.lang = 'en'
          document.title = 'Confirmation dialog touch cancellation'
          const root = document.createElement('main')
          root.id = 'root'
          document.body.append(root)
        })
        await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
        await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
        await page.addScriptTag({content: fixtureScript})
        const trigger = page.locator('[data-component="ConfirmationDialog.Trigger"]')
        await trigger.click()
        const dialog = page.getByRole('alertdialog', {name: 'Continue?'})
        const draft = dialog.getByRole('textbox', {name: 'Draft'})
        await draft.fill('unsaved draft')
        const outside = page.getByTestId('outside')
        await outside.evaluate(element => {
          element.style.touchAction = 'none'
          for (const type of ['pointercancel', 'touchcancel']) {
            element.addEventListener(type, event => {
              element.setAttribute(`data-${type}`, String(event.isTrusted))
            })
          }
        })
        const box = await outside.boundingBox()
        if (!box) throw new Error('Expected an outside control with a bounding box.')
        const x = box.x + box.width / 2
        const y = box.y + box.height / 2
        const session = await page.context().newCDPSession(page)
        await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]})
        await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: x + 20, y}]})
        await expect(trigger).toHaveAttribute('aria-expanded', 'true')
        await session.send('Input.dispatchTouchEvent', {type: 'touchCancel', touchPoints: []})
        await expect(outside).toHaveAttribute('data-pointercancel', 'true')
        await expect(outside).toHaveAttribute('data-touchcancel', 'true')
        await expect(outside).toHaveText('Outside clicks: 0')
        await expect(dialog).toBeVisible()
        await expect(draft).toHaveValue('unsaved draft')
      })
    }
  }
})
