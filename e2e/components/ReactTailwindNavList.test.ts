import {expect, test, type Locator} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

async function screenshotPixels(locator: Locator) {
  const png = (await locator.screenshot()).toString('base64')
  return locator.page().evaluate(async source => {
    const image = new Image()
    image.src = `data:image/png;base64,${source}`
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D context is unavailable')
    context.drawImage(image, 0, 0)
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
    const digest = await crypto.subtle.digest('SHA-256', pixels)
    return {width: canvas.width, height: canvas.height, digest: Array.from(new Uint8Array(digest))}
  }, png)
}

test.describe('React Tailwind NavList group composition', () => {
  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`wrapped groups retain structure and appearance in ${theme} @aat`, async ({page}) => {
      await page.setViewportSize({width: 320, height: 900})
      await visit(page, {
        id: 'react-tailwind-navigation-navlist-features--with-wrapped-groups',
        globals: {colorScheme: theme},
      })

      for (const label of ['Without item gap', 'With item gap']) {
        const direct = page.getByRole('navigation', {name: `${label}, direct`})
        const wrapped = page.getByRole('navigation', {name: `${label}, wrapped`})
        for (const nav of [direct, wrapped]) {
          await expect(nav.getByRole('heading', {name: 'Settings', level: 2})).toBeVisible()
          await expect(nav.getByRole('list', {name: 'Settings'})).toBeVisible()
          await expect(nav.locator('[data-component="ActionList.Divider"]')).toBeVisible()
          await expect(nav.getByRole('link')).toHaveText(['Overview', 'General', 'Security', 'Help'])
          await expect(nav.locator('ul > section, ul > ul, li > li')).toHaveCount(0)
        }
        expect(await screenshotPixels(wrapped)).toEqual(await screenshotPixels(direct))
      }

      await expect(page).toHaveNoViolations()
      const collapsed = page.getByRole('navigation', {name: 'Collapsed navigation'})
      await expect(collapsed.locator('[data-component="ActionList.Divider"]')).toBeVisible()
      const trigger = collapsed.getByRole('button', {name: 'Collapsed settings'})
      await trigger.click()
      await expect(
        page.getByRole('dialog', {name: 'Settings links'}).getByRole('link', {name: 'General'}),
      ).toBeVisible()
      await expect(page).toHaveNoViolations()
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()
    })
  }
})
