import path from 'node:path'
import {expect, test, type Page} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

const alternateBaseUi = process.env.BASE_UI_REACT_DIR
let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/anchored-overlay-info-browser.tsx', alternateBaseUi)
})

async function mountOverlay(page: Page, hasLink: boolean) {
  await page.goto(`about:blank?link=${hasLink}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
}

for (const hasLink of [true, false]) {
  test(`named non-modal informational overlay ${hasLink ? 'with' : 'without'} a link supports keyboard exit @aat`, async ({
    page,
  }) => {
    await mountOverlay(page, hasLink)
    const trigger = page.getByRole('button', {name: 'About billing credits'})
    const next = page.getByRole('button', {name: 'Next control'})
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await trigger.focus()
    await page.keyboard.press('Enter')
    const overlay = page.getByRole('dialog', {name: 'Billing credits information'})
    await expect(overlay).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(overlay).not.toHaveAttribute('aria-modal')
    await expect(hasLink ? overlay.getByRole('link', {name: 'Learn more'}) : overlay).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(next).toBeFocused()
    await expect(overlay).toBeHidden()
    await expect(page.locator('[data-component="AnchoredOverlay.Content"]')).toHaveCount(0)

    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(overlay).toBeVisible()
    await expect(hasLink ? overlay.getByRole('link', {name: 'Learn more'}) : overlay).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(overlay).toBeHidden()
    await expect(trigger).toBeFocused()
  })
}

test.fixme('rapid reopen after focus-out returns focus on Escape @aat', async ({page}) => {
  await mountOverlay(page, true)
  const trigger = page.getByRole('button', {name: 'About billing credits'})
  const next = page.getByRole('button', {name: 'Next control'})
  const overlay = page.getByRole('dialog', {name: 'Billing credits information'})
  const link = overlay.getByRole('link', {name: 'Learn more'})

  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(link).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(next).toBeFocused()
  await expect(overlay).toBeHidden()
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(link).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(overlay).toBeHidden()
  await expect(trigger).toBeFocused()
})
