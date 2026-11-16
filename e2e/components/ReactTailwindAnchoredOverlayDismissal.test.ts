import path from 'node:path'
import {expect, test, type Page} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture(
    'script/anchored-overlay-dismissal-browser.tsx',
    process.env.BASE_UI_REACT_DIR,
  )
})

async function openOverlay(page: Page, controlled: boolean, preventOutside: boolean) {
  await page.setViewportSize({width: 1280, height: 720})
  await page.goto(`about:blank?controlled=${controlled}&preventOutside=${preventOutside}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    document.title = 'Anchored overlay dismissal'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
  const trigger = page.getByRole('button', {name: 'Open editor'})
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog', {name: 'Editor'})).toBeVisible()
}

for (const controlled of [false, true]) {
  test(`${controlled ? 'controlled' : 'uncontrolled'} focus-trapping overlay supports outside-dismissal opt-out @aat`, async ({
    page,
  }) => {
    await openOverlay(page, controlled, true)
    const trigger = page.getByRole('button', {name: 'Open editor'})
    const overlay = page.getByRole('dialog', {name: 'Editor'})
    const draft = overlay.getByRole('textbox', {name: 'Draft'})
    const outside = page.getByTestId('outside')
    const reasons = page.getByTestId('reasons')
    await draft.fill('unsaved draft')
    const outsideBox = await outside.boundingBox()
    if (!outsideBox) throw new Error('Expected an outside control with a bounding box.')
    await page.mouse.move(outsideBox.x + outsideBox.width / 2, outsideBox.y + outsideBox.height / 2)
    await page.mouse.down()
    await expect(reasons).toHaveAttribute('data-reasons', /outside-press/)
    await expect(overlay).toBeVisible()
    await page.mouse.move(900, 50)
    await page.mouse.up()
    await expect(outside).toHaveText('Outside clicks: 0')
    await expect(overlay).toBeVisible()
    await expect(draft).toHaveValue('unsaved draft')

    await page.mouse.click(outsideBox.x + outsideBox.width / 2, outsideBox.y + outsideBox.height / 2)
    await expect(outside).toHaveText('Outside clicks: 1')
    await expect(overlay).toBeVisible()
    await expect(draft).toHaveValue('unsaved draft')
    await draft.focus()
    for (let index = 0; index < 3; index++) {
      await page.keyboard.press('Tab')
      await expect
        .poll(() => overlay.evaluate(element => element.contains(element.ownerDocument.activeElement)))
        .toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(overlay).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(reasons).toHaveAttribute('data-reasons', /escape-key/)

    await trigger.focus()
    await page.keyboard.press('Enter')
    await overlay.getByRole('button', {name: 'Close'}).click()
    await expect(overlay).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(reasons).toHaveAttribute('data-reasons', /close-press/)
  })

  test(`${controlled ? 'controlled' : 'uncontrolled'} focus-trapping overlay dismisses on outside interaction by default @aat`, async ({
    page,
  }) => {
    await openOverlay(page, controlled, false)
    await page.getByTestId('outside').click()
    await expect(page.getByTestId('outside')).toHaveText('Outside clicks: 1')
    await expect(page.getByRole('dialog', {name: 'Editor'})).toBeHidden()
    await expect(page.getByTestId('reasons')).toHaveAttribute('data-reasons', /outside-press/)
  })
}

test.describe('touch cancellation', () => {
  test.use({hasTouch: true})

  for (const controlled of [false, true]) {
    test(`${controlled ? 'controlled' : 'uncontrolled'} overlay retains its draft when outside dismissal is canceled @aat`, async ({
      browserName,
      page,
    }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(browserName !== 'chromium', 'Trusted touch cancellation requires Chromium CDP.')
      await openOverlay(page, controlled, true)
      const overlay = page.getByRole('dialog', {name: 'Editor'})
      const draft = overlay.getByRole('textbox', {name: 'Draft'})
      const outside = page.getByTestId('outside')
      await draft.fill('unsaved draft')
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
      await expect(page.getByTestId('reasons')).toHaveAttribute('data-reasons', /outside-press/)
      await expect(overlay).toBeVisible()
      await session.send('Input.dispatchTouchEvent', {type: 'touchCancel', touchPoints: []})
      await expect(outside).toHaveAttribute('data-pointercancel', 'true')
      await expect(outside).toHaveAttribute('data-touchcancel', 'true')
      await expect(outside).toHaveText('Outside clicks: 0')
      await expect(overlay).toBeVisible()
      await expect(draft).toHaveValue('unsaved draft')
    })
  }
})
