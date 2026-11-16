import path from 'node:path'
import {expect, test, type Locator, type Page} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

const reason = 'Unavailable due to an outage'
const label = 'RepositoryNameThatNeedsToWrap'
const description = 'Owned by an organization with additional review requirements'
const trailing = 'EnterprisePolicyBlocksThisRepositoryWithoutAnySpaces'
let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/inactive-item-layout-browser.tsx')
})

async function loadFixture(page: Page, width: number, direction: 'ltr' | 'rtl', height = 900) {
  await page.setViewportSize({width, height})
  await page.goto('about:blank?id=inactive-item-layout')
  await page.evaluate(dir => {
    document.documentElement.lang = 'en'
    document.documentElement.dir = dir
    document.documentElement.setAttribute('data-color-mode', 'light')
    document.documentElement.setAttribute('data-light-theme', 'light')
    document.title = 'Inactive item layout'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  }, direction)
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addStyleTag({path: require.resolve('@primer/primitives/dist/css/functional/size/z-index.css')})
  await page.addStyleTag({
    content:
      'body { font-family: var(--fontStack-sansSerif); color: var(--fgColor-default); background: var(--bgColor-default); }',
  })
  await page.addScriptTag({content: fixtureScript})
}

async function expectTextInside(item: Locator, text: Locator) {
  const itemBounds = await item.boundingBox()
  if (!itemBounds) throw new Error('Expected an item with visible bounds.')
  const rects = await text.evaluate(element => {
    const range = document.createRange()
    range.selectNodeContents(element)
    return Array.from(range.getClientRects(), rect => ({
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    })).filter(rect => rect.right > rect.left && rect.bottom > rect.top)
  })
  expect(rects.length).toBeGreaterThan(0)
  for (const rect of rects) {
    expect(rect.left).toBeGreaterThanOrEqual(itemBounds.x - 1)
    expect(rect.right).toBeLessThanOrEqual(itemBounds.x + itemBounds.width + 1)
    expect(rect.top).toBeGreaterThanOrEqual(itemBounds.y - 1)
    expect(rect.bottom).toBeLessThanOrEqual(itemBounds.y + itemBounds.height + 1)
  }
  return rects
}

async function expectSharedContentLayout(item: Locator, trailingTestId: string) {
  const labelRects = await expectTextInside(item, item.locator('[data-item-label]'))
  const descriptionRects = await expectTextInside(item, item.getByText(description, {exact: true}))
  const trailingRects = await expectTextInside(item, item.getByTestId(trailingTestId))
  const reasonRects = await expectTextInside(item, item.getByText(reason, {exact: true}))
  expect(trailingRects.length).toBeLessThanOrEqual(12)
  for (const main of [...labelRects, ...descriptionRects]) {
    for (const visual of trailingRects) {
      expect(
        main.left < visual.right && main.right > visual.left && main.top < visual.bottom && main.bottom > visual.top,
      ).toBe(false)
    }
  }
  expect(Math.min(...reasonRects.map(rect => rect.top))).toBeGreaterThanOrEqual(
    Math.max(...[...labelRects, ...descriptionRects, ...trailingRects].map(rect => rect.bottom)) - 1,
  )
}

for (const direction of ['ltr', 'rtl'] as const) {
  for (const width of [200, 320, 1024]) {
    test(`auto-sizes an inactive menu within ${width}px (${direction}) @aat`, async ({page}) => {
      await loadFixture(page, width, direction)
      await page.getByRole('button', {name: 'Open actions'}).click()
      const menu = page.getByRole('menu', {name: 'Actions'})
      const item = menu.getByRole('menuitem', {name: 'Workflows'})
      await expect(item).toHaveAccessibleDescription(reason)
      await expect(item).toHaveAttribute('aria-disabled', 'true')

      const menuBounds = await menu.boundingBox()
      const itemBounds = await item.boundingBox()
      const iconBounds = await page.getByTestId('menu-trailing-icon').boundingBox()
      if (!menuBounds || !itemBounds || !iconBounds) throw new Error('Expected visible menu item and icon bounds.')
      expect(menuBounds.width).toBeLessThanOrEqual(width)
      expect(menuBounds.x).toBeGreaterThanOrEqual(0)
      expect(menuBounds.x + menuBounds.width).toBeLessThanOrEqual(width)
      if (width >= 320) {
        expect(menuBounds.width).toBeGreaterThan(180)
        expect(menuBounds.width).toBeLessThan(250)
      }
      expect(iconBounds.width).toBeCloseTo(16, 0)
      expect(iconBounds.x).toBeGreaterThanOrEqual(itemBounds.x)
      expect(iconBounds.x + iconBounds.width).toBeLessThanOrEqual(itemBounds.x + itemBounds.width)
      const iconEdge = direction === 'ltr' ? iconBounds.x + iconBounds.width : iconBounds.x
      const itemEdge = direction === 'ltr' ? itemBounds.x + itemBounds.width - 8 : itemBounds.x + 8
      expect(iconEdge).toBeCloseTo(itemEdge, 0)
      const reasonRects = await expectTextInside(item, item.getByText(reason, {exact: true}))
      if (width >= 320) expect(reasonRects).toHaveLength(1)
      const horizontalOverflow = await menu.evaluate(element => element.scrollWidth - element.clientWidth)
      expect(horizontalOverflow).toBeLessThanOrEqual(1)
      await page.keyboard.press('Escape')
      await expect(page.getByRole('button', {name: 'Open actions'})).toBeFocused()
    })
  }

  test(`keeps inactive menu content visible with increased text spacing at 320x256 (${direction}) @aat`, async ({
    page,
  }) => {
    await loadFixture(page, 320, direction, 256)
    await page.addStyleTag({
      content: `
        * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
        p { margin-bottom: 2em !important; }
      `,
    })
    const trigger = page.getByRole('button', {name: 'Open actions'})
    await trigger.focus()
    await page.keyboard.press('Enter')
    const menu = page.getByRole('menu', {name: 'Actions'})
    const item = menu.getByRole('menuitem', {name: 'Workflows'})
    const another = menu.getByRole('menuitem', {name: 'Another action'})
    await expect(another).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(item).toBeFocused()
    await expect(item).toHaveAccessibleDescription(reason)
    await expectTextInside(item, item.getByText(reason, {exact: true}))
    await expectTextInside(menu, item.getByText(reason, {exact: true}))
    const itemBounds = await item.boundingBox()
    if (!itemBounds) throw new Error('Expected the inactive menu item to be visible.')
    expect(itemBounds.y).toBeGreaterThanOrEqual(0)
    expect(itemBounds.y + itemBounds.height).toBeLessThanOrEqual(256)
    expect(await menu.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    await page.keyboard.press('ArrowDown')
    await expect(another).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
  })

  test(`preserves shared inactive content and its descriptions (${direction}) @aat`, async ({page}) => {
    await loadFixture(page, 320, direction)
    const item = page.getByTestId('list-item')
    await expect(item).toHaveAccessibleName(`${label} ${trailing}`)
    await expect(item).toHaveAccessibleDescription(`${description} ${reason}`)
    await expect(item).toBeDisabled()
    await expectSharedContentLayout(item, 'list-trailing')

    await page.getByRole('button', {name: 'Open picker'}).click()
    const option = page.getByRole('option', {name: `${label} ${trailing}`})
    await expect(option).toHaveAccessibleDescription(`${description} ${reason}`)
    await expect(option).toHaveAttribute('aria-disabled', 'true')
    await expectSharedContentLayout(option, 'picker-trailing')
    await page.keyboard.press('Escape')
    await page.getByRole('button', {name: 'Make available'}).click()
    await expect(item).toBeEnabled()
    await expect(item).toHaveAccessibleDescription(description)
    await item.click()
    await expect(page.getByTestId('action-result')).toHaveText('list')
  })
}
