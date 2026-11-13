import path from 'node:path'
import {expect, test, type Locator, type Page} from '@playwright/test'
import {
  buildReactTailwindFixture,
  reactTailwindHostUtilities,
  reactTailwindPackageRoot,
} from '../test-helpers/react-tailwind-fixture'

const packageRoot = reactTailwindPackageRoot
const alternateBaseUi = process.env.BASE_UI_REACT_DIR
let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/actionmenu-width-browser.tsx', alternateBaseUi)
})

async function setup(
  page: Page,
  width: number,
  direction: 'ltr' | 'rtl',
  includeBaseStyles = true,
  query = 'id=actionmenu-width-fixture',
  height = 900,
) {
  await page.setViewportSize({width, height})
  await page.goto(`about:blank?${query}`)
  await page.evaluate(dir => {
    document.documentElement.lang = 'en'
    document.documentElement.dir = dir
    document.title = 'Menu width'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  }, direction)
  if (includeBaseStyles) await page.addStyleTag({path: path.join(packageRoot, 'dist/base.css')})
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addStyleTag({path: reactTailwindHostUtilities})
  await page.addScriptTag({content: fixtureScript})
}

for (const direction of ['ltr', 'rtl'] as const) {
  for (const width of [200, 320]) {
    test(`a default radio menu wraps its block description at ${width}px (${direction}) @aat`, async ({page}) => {
      await setup(page, width, direction, true, 'scenario=review-effort', 256)
      const trigger = page.getByRole('button', {name: 'Balanced'})
      await trigger.focus()
      await page.keyboard.press('Enter')
      const menu = page.getByRole('menu', {name: 'Balanced'})
      const first = menu.getByRole('menuitemradio', {name: 'Default (Lite)'})
      const selected = menu.getByRole('menuitemradio', {name: 'Balanced'})
      const description = 'Inherit the GitHub default review effort level for this organization'
      await expect(menu).toBeVisible()
      await expect(first).toHaveAccessibleDescription(description)
      await expect(selected).toHaveAttribute('aria-checked', 'true')
      await expectWithinAvailableWidth(menu)
      const geometry = await menu.evaluate(element => {
        const bounds = element.getBoundingClientRect()
        return {
          left: bounds.left,
          right: bounds.right,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          documentClientWidth: document.documentElement.clientWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
        }
      })
      expect(geometry.left).toBeGreaterThanOrEqual(0)
      expect(geometry.right).toBeLessThanOrEqual(width)
      expect(geometry.scrollWidth - geometry.clientWidth).toBeLessThanOrEqual(1)
      expect(geometry.documentScrollWidth - geometry.documentClientWidth).toBeLessThanOrEqual(1)
      const lines = await first.getByText(description).evaluate(element => {
        const menu = element.closest('[role="menu"]')
        if (!menu) throw new Error('Expected the description inside a menu')
        const bounds = menu.getBoundingClientRect()
        const range = document.createRange()
        range.selectNodeContents(element)
        return Array.from(range.getClientRects(), line => ({
          left: line.left - bounds.left,
          right: bounds.right - line.right,
        }))
      })
      expect(lines.length).toBeGreaterThan(1)
      for (const line of lines) {
        expect(line.left).toBeGreaterThanOrEqual(-1)
        expect(line.right).toBeGreaterThanOrEqual(-1)
      }
      await page.keyboard.press('Home')
      await expect(first).toBeFocused()
      await page.keyboard.press('ArrowDown')
      await expect(selected).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(menu).toBeHidden()
      await expect(trigger).toBeFocused()
    })
  }
}

type HorizontalSide = 'left' | 'right' | 'inline-start' | 'inline-end'
type HorizontalAvoidance = 'default' | 'fallback' | 'none' | 'no-fallback' | 'start' | 'align-shift' | 'shift'

async function setupHorizontal(
  page: Page,
  {
    width,
    direction = 'ltr',
    side = 'left',
    trigger = 'wide',
    avoidance = 'default',
    boundary,
    fullscreen = false,
    height = 640,
    submenu = false,
    subtree,
    portal,
    label,
    styleCap = false,
    overrideMin = false,
  }: {
    width: number
    direction?: 'ltr' | 'rtl'
    side?: HorizontalSide
    trigger?: 'wide' | 'compact' | 'left' | 'right'
    avoidance?: HorizontalAvoidance
    boundary?: 'element'
    fullscreen?: boolean
    height?: number
    submenu?: boolean
    subtree?: 'rtl'
    portal?: 'subtree'
    label?: 'long'
    styleCap?: boolean
    overrideMin?: boolean
  },
) {
  const query = new URLSearchParams({
    id: 'actionmenu-horizontal-fixture',
    scenario: 'horizontal',
    side,
    trigger,
    avoidance,
    fullscreen: String(fullscreen),
    submenu: String(submenu),
    'style-cap': String(styleCap),
    'override-min': String(overrideMin),
  })
  if (boundary) query.set('boundary', boundary)
  if (subtree) query.set('subtree', subtree)
  if (portal) query.set('portal', portal)
  if (label) query.set('label', label)
  await setup(page, width, direction, true, query.toString(), height)
}

for (const width of [80, 120, 200, 320, 414]) {
  for (const direction of ['ltr', 'rtl'] as const) {
    test(`wide horizontal triggers fall back within a ${width}px ${direction.toUpperCase()} viewport @aat`, async ({
      page,
    }) => {
      for (const side of ['left', 'right', 'inline-start', 'inline-end'] as const) {
        await setupHorizontal(page, {width, direction, side})
        const trigger = page.getByRole('button', {name: 'Options'})
        const triggerBounds = await trigger.boundingBox()
        expect(triggerBounds?.x).toBeCloseTo(8, 0)
        expect(triggerBounds?.width).toBeCloseTo(width - 16, 0)
        await trigger.focus()
        await trigger.press('Enter')
        const menu = page.getByRole('menu', {name: 'Options menu'})
        await expect(menu).toBeVisible()
        await expect(menu).toHaveAttribute('data-side', 'bottom')
        const menuBounds = await menu.boundingBox()
        if (!menuBounds) throw new Error('Expected a visible menu.')
        expect(menuBounds.x).toBeGreaterThanOrEqual(0)
        expect(menuBounds.x + menuBounds.width).toBeLessThanOrEqual(width)
        expect(menuBounds.width).toBeGreaterThanOrEqual(Math.min(100, width - 16))
        const item = menu.getByRole('menuitem', {name: 'Copy'})
        await expect(item).toBeFocused()
        await item.click()
        await expect(page.getByTestId('horizontal-selections')).toHaveText('1')
        await expect(trigger).toBeFocused()
      }
    })
  }
}

for (const direction of ['ltr', 'rtl'] as const) {
  test(`horizontal fallback preserves menu semantics in ${direction.toUpperCase()} @aat`, async ({page}) => {
    await setupHorizontal(page, {width: 320, direction})
    const trigger = page.getByRole('button', {name: 'Options'})
    await trigger.focus()
    await trigger.press('Enter')
    const menu = page.getByRole('menu', {name: 'Options menu'})
    await expect(menu.getByRole('menuitem', {name: 'Copy'})).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page).toHaveNoViolations()
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test(`horizontal menus retain a fitting preferred side in ${direction.toUpperCase()} @aat`, async ({page}) => {
    for (const side of ['left', 'right', 'inline-start', 'inline-end'] as const) {
      await setupHorizontal(page, {width: 1024, direction, side, trigger: 'compact'})
      const trigger = page.getByRole('button', {name: 'Options'})
      await trigger.click()
      const menu = page.getByRole('menu', {name: 'Options menu'})
      await expect(menu).toBeVisible()
      const triggerBounds = await trigger.boundingBox()
      const menuBounds = await menu.boundingBox()
      if (!triggerBounds || !menuBounds) throw new Error('Expected visible trigger and menu bounds.')
      const expectedLeft =
        side === 'left' ||
        (side === 'inline-start' && direction === 'ltr') ||
        (side === 'inline-end' && direction === 'rtl')
      if (expectedLeft) expect(menuBounds.x + menuBounds.width, side).toBeLessThanOrEqual(triggerBounds.x)
      else expect(menuBounds.x, side).toBeGreaterThanOrEqual(triggerBounds.x + triggerBounds.width)
      expect(menuBounds.width).toBeCloseTo(320, 0)
    }
  })
}

test('horizontal menus prefer the opposite horizontal side before a perpendicular fallback @aat', async ({page}) => {
  await setupHorizontal(page, {width: 640, side: 'left', trigger: 'left'})
  await page.getByRole('button', {name: 'Options'}).click()
  await expect(page.getByRole('menu', {name: 'Options menu'})).toHaveAttribute('data-side', 'right')
})

test('horizontal anchored menu fits an 80px viewport with an inline maximum width @aat', async ({page}) => {
  await setupHorizontal(page, {width: 80, avoidance: 'fallback', styleCap: true})
  const trigger = page.getByRole('button', {name: 'Options'})
  const triggerBounds = await trigger.boundingBox()
  expect(triggerBounds?.width).toBeCloseTo(64, 0)
  await trigger.focus()
  await trigger.press('Enter')
  const menu = page.getByRole('menu', {name: 'Options menu'})
  await expect(menu).toBeVisible()
  const geometry = await menu.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const computed = getComputedStyle(element)
    return {
      left: bounds.left,
      right: bounds.right,
      width: bounds.width,
      minWidth: computed.minWidth,
      maxWidth: computed.maxWidth,
    }
  })
  expect(geometry.left).toBeGreaterThanOrEqual(0)
  expect(geometry.right).toBeLessThanOrEqual(80)
  expect(Number.parseFloat(geometry.minWidth)).toBeCloseTo(69, 0)
  expect(geometry.maxWidth).toBe('48px')
  expect(geometry.width).toBeCloseTo(Number.parseFloat(geometry.minWidth), 0)
  const item = menu.getByRole('menuitem', {name: 'Copy'})
  await expect(item).toBeFocused()
  await item.press('Enter')
  await expect(page.getByTestId('horizontal-selections')).toHaveText('1')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await menu.getByRole('menuitem', {name: 'Copy'}).click()
  await expect(page.getByTestId('horizontal-selections')).toHaveText('2')
  await expect(trigger).toBeFocused()
})

test('horizontal anchored menu honors an inline maximum after overriding its minimum @aat', async ({page}) => {
  await setupHorizontal(page, {width: 80, avoidance: 'fallback', styleCap: true, overrideMin: true})
  const trigger = page.getByRole('button', {name: 'Options'})
  await trigger.focus()
  await trigger.press('Enter')
  const menu = page.getByRole('menu', {name: 'Options menu'})
  await expect(menu).toBeVisible()
  const bounds = await menu.boundingBox()
  if (!bounds) throw new Error('Expected a visible menu.')
  expect(bounds.x).toBeGreaterThanOrEqual(0)
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(80)
  expect(bounds.width).toBeCloseTo(48, 0)
  const item = menu.getByRole('menuitem', {name: 'Copy'})
  await expect(item).toBeFocused()
  const dimensions = await item.evaluate(element => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
  await item.press('Enter')
  await expect(page.getByTestId('horizontal-selections')).toHaveText('1')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await menu.getByRole('menuitem', {name: 'Copy'}).click()
  await expect(page.getByTestId('horizontal-selections')).toHaveText('2')
  await expect(trigger).toBeFocused()
})

test('horizontal fallback respects explicit collision options @aat', async ({page}) => {
  for (const [avoidance, expectedSide] of [
    ['start', 'top'],
    ['align-shift', 'bottom'],
    ['no-fallback', 'left'],
    ['none', 'left'],
    ['shift', 'left'],
  ] as const) {
    await setupHorizontal(page, {width: 320, avoidance})
    await page.getByRole('button', {name: 'Options'}).click()
    await expect(page.getByRole('menu', {name: 'Options menu', includeHidden: true})).toHaveAttribute(
      'data-side',
      expectedSide,
    )
  }
})

for (const direction of ['ltr', 'rtl'] as const) {
  for (const width of [80, 200, 320]) {
    test(`horizontal menu wraps a long label at ${width}px in ${direction.toUpperCase()} @aat`, async ({page}) => {
      await setupHorizontal(page, {width, direction, label: 'long'})
      await page.getByRole('button', {name: 'Options'}).click()
      const menu = page.getByRole('menu', {name: 'Options menu'})
      const item = menu.getByRole('menuitem', {name: 'InternationalizationOptionsForRepositories'})
      await expect(item).toBeVisible()
      const dimensions = await item.evaluate(element => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        labelHeight: element.querySelector('[data-item-label]')?.getBoundingClientRect().height,
      }))
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
      if (width === 80) expect(dimensions.labelHeight).toBeGreaterThan(20)
      await item.click()
      await expect(page.getByTestId('horizontal-selections')).toHaveText('1')
    })
  }
}

test('horizontal logical placement follows an RTL portal subtree @aat', async ({page}) => {
  await setupHorizontal(page, {
    width: 1024,
    side: 'inline-start',
    trigger: 'compact',
    subtree: 'rtl',
    portal: 'subtree',
  })
  const trigger = page.getByRole('button', {name: 'Options'})
  await trigger.click()
  const menu = page.getByRole('menu', {name: 'Options menu'})
  await expect(menu).toBeVisible()
  expect(await menu.evaluate(element => getComputedStyle(element).direction)).toBe('rtl')
  const triggerBounds = await trigger.boundingBox()
  const menuBounds = await menu.boundingBox()
  if (!triggerBounds || !menuBounds) throw new Error('Expected visible trigger and menu bounds.')
  expect(menuBounds.x).toBeGreaterThanOrEqual(triggerBounds.x + triggerBounds.width)
})

test('horizontal fallback respects an explicit collision boundary @aat', async ({page}) => {
  await setupHorizontal(page, {width: 320, boundary: 'element'})
  await page.getByRole('button', {name: 'Options'}).click()
  const menu = page.getByRole('menu', {name: 'Options menu'})
  await expect(menu).toBeVisible()
  await expect(menu).toHaveAttribute('data-side', 'bottom')
  const menuBounds = await menu.boundingBox()
  const boundaryBounds = await page.getByTestId('horizontal-boundary').boundingBox()
  if (!menuBounds || !boundaryBounds) throw new Error('Expected menu and boundary bounds.')
  expect(menuBounds.x).toBeGreaterThanOrEqual(boundaryBounds.x)
  expect(menuBounds.x + menuBounds.width).toBeLessThanOrEqual(boundaryBounds.x + boundaryBounds.width)
  expect(menuBounds.y).toBeGreaterThanOrEqual(boundaryBounds.y)
  expect(menuBounds.y + menuBounds.height).toBeLessThanOrEqual(boundaryBounds.y + boundaryBounds.height)
  await menu.getByRole('menuitem', {name: 'Copy'}).click()
  await expect(page.getByTestId('horizontal-selections')).toHaveText('1')
})

test('horizontal fallback remains keyboard-operable in a short viewport @aat', async ({page}) => {
  await setupHorizontal(page, {width: 200, height: 100})
  const trigger = page.getByRole('button', {name: 'Options'})
  await trigger.focus()
  await trigger.press('Enter')
  const menu = page.getByRole('menu', {name: 'Options menu'})
  await expect(menu).toBeVisible()
  await expect(menu).toHaveAttribute('data-side', 'top')
  const menuBounds = await menu.boundingBox()
  if (!menuBounds) throw new Error('Expected a visible menu.')
  expect(menuBounds.y).toBeGreaterThanOrEqual(0)
  expect(menuBounds.y + menuBounds.height).toBeLessThanOrEqual(100)
  const item = menu.getByRole('menuitem', {name: 'Copy'})
  await expect(item).toBeFocused()
  await item.press('Enter')
  await expect(page.getByTestId('horizontal-selections')).toHaveText('1')
  await expect(trigger).toBeFocused()
})

for (const direction of ['ltr', 'rtl'] as const) {
  test(`horizontal submenus remain usable in ${direction.toUpperCase()} @aat`, async ({page}) => {
    await setupHorizontal(page, {width: 200, direction, submenu: true})
    const trigger = page.getByRole('button', {name: 'Options'})
    await trigger.focus()
    await trigger.press('Enter')
    const more = page.getByRole('menuitem', {name: 'More'})
    await expect(more).toBeFocused()
    await more.press(direction === 'ltr' ? 'ArrowRight' : 'ArrowLeft')
    const submenu = page.getByRole('menu', {name: 'More options'})
    await expect(submenu).toBeVisible()
    const bounds = await submenu.boundingBox()
    if (!bounds) throw new Error('Expected visible submenu bounds.')
    expect(bounds.x).toBeGreaterThanOrEqual(0)
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(200)
    const item = submenu.getByRole('menuitem', {name: 'Copy'})
    await expect(item).toBeFocused()
    await item.press('Enter')
    await expect(page.getByTestId('horizontal-selections')).toHaveText('1')
    await expect(trigger).toBeFocused()
  })
}

test('horizontal menu placement updates while the viewport is resized @aat', async ({page}) => {
  await setupHorizontal(page, {width: 1024, trigger: 'compact'})
  await page.getByRole('button', {name: 'Options'}).press('Enter')
  const menu = page.getByRole('menu', {name: 'Options menu'})
  await expect(menu).toHaveAttribute('data-side', 'left')
  await page.setViewportSize({width: 320, height: 640})
  await expect(menu).toHaveAttribute('data-side', 'bottom')
  await expect(menu.getByRole('menuitem', {name: 'Copy'})).toBeFocused()
  await page.setViewportSize({width: 1024, height: 640})
  await expect(menu).toHaveAttribute('data-side', 'left')
})

for (const direction of ['ltr', 'rtl'] as const) {
  for (const width of [80, 320]) {
    test(`horizontal fullscreen menus remain usable at ${width}px in ${direction.toUpperCase()} @aat`, async ({
      page,
    }) => {
      await setupHorizontal(page, {width, direction, fullscreen: true})
      const trigger = page.getByRole('button', {name: 'Options'})
      await trigger.focus()
      await trigger.press('Enter')
      const menu = page.getByRole('menu', {name: 'Options menu'})
      await expect(menu).toBeVisible()
      const close = menu.getByRole('menuitem', {name: 'Close'})
      await expect(close).toBeFocused()
      await close.press('Escape')
      await expect(trigger).toBeFocused()
      await trigger.click()
      await expect(menu).toBeVisible()
      const positionerBounds = await page.locator('[data-component="ActionMenu.Positioner"]').boundingBox()
      if (!positionerBounds) throw new Error('Expected a visible fullscreen positioner.')
      expect(positionerBounds.x).toBe(0)
      expect(positionerBounds.y).toBe(0)
      expect(positionerBounds.width).toBe(width)
      expect(positionerBounds.height).toBe(640)
      await menu.getByRole('menuitem', {name: 'Copy'}).click()
      await expect(page.getByTestId('horizontal-selections')).toHaveText('1')
      await expect(trigger).toBeFocused()
    })
  }
}

async function openMenu(page: Page, label: string) {
  const trigger = page.getByRole('button', {name: label, exact: true})
  await trigger.focus()
  await trigger.press('Enter')
  const menu = page.getByRole('menu', {name: `${label} menu`, exact: true})
  await expect(menu).toBeVisible()
  return {menu, trigger}
}

async function expectWithinAvailableWidth(menu: Locator) {
  await expect
    .poll(() =>
      menu.evaluate(element => {
        const available = Number.parseFloat(
          getComputedStyle(element.parentElement!).getPropertyValue('--available-width'),
        )
        return element.getBoundingClientRect().width - available
      }),
    )
    .toBeLessThanOrEqual(0.5)
}

for (const direction of ['ltr', 'rtl'] as const) {
  test(`anchored menu widths fit the available viewport (${direction}) @aat`, async ({page}) => {
    await setup(page, 320, direction)
    for (const label of ['Medium', 'Large', 'Auto']) {
      const {menu, trigger} = await openMenu(page, label)
      await expectWithinAvailableWidth(menu)
      const rect = await menu.boundingBox()
      expect(rect).not.toBeNull()
      expect(rect!.x).toBeGreaterThanOrEqual(7.5)
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(312.5)
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()
    }
    await expect(page).toHaveNoViolations()
  })
}

for (const direction of ['ltr', 'rtl'] as const) {
  test(`a narrow explicit collision boundary keeps actions reachable (${direction}) @aat`, async ({page}) => {
    await setup(page, 320, direction)
    for (const label of ['Boundary', 'Auto boundary']) {
      const {menu, trigger} = await openMenu(page, label)
      await expectWithinAvailableWidth(menu)
      const boundary = await page.getByTestId(`${label}-boundary`).boundingBox()
      const popup = await menu.boundingBox()
      expect(boundary).not.toBeNull()
      expect(popup).not.toBeNull()
      expect(popup!.x).toBeGreaterThanOrEqual(boundary!.x + 7.5)
      expect(popup!.x + popup!.width).toBeLessThanOrEqual(boundary!.x + boundary!.width - 7.5)

      const action = menu.getByRole('menuitem', {name: 'A long menu action that should remain readable'})
      await expect(action).toBeFocused()
      const actionRect = await action.boundingBox()
      expect(actionRect).not.toBeNull()
      expect(actionRect!.x).toBeGreaterThanOrEqual(popup!.x - 0.5)
      expect(actionRect!.x + actionRect!.width).toBeLessThanOrEqual(popup!.x + popup!.width + 0.5)
      await action.press('Enter')
      await expect(page.getByTestId(`${label}-selections`)).toHaveText('1')
      await expect(trigger).toBeFocused()
    }
    await expect(page).toHaveNoViolations()
  })
}

test('menu content fits without a global box-sizing reset in increased contrast @aat', async ({page}) => {
  await page.emulateMedia({contrast: 'more'})
  await setup(page, 320, 'ltr', false)
  for (const label of ['Medium', 'Boundary']) {
    const {menu, trigger} = await openMenu(page, label)
    await expectWithinAvailableWidth(menu)
    const popup = await menu.boundingBox()
    const action = await menu
      .getByRole('menuitem', {name: 'A long menu action that should remain readable'})
      .boundingBox()
    expect(popup).not.toBeNull()
    expect(action).not.toBeNull()
    expect(action!.x + action!.width).toBeLessThanOrEqual(popup!.x + popup!.width + 0.5)
    expect(await menu.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
  }
})

test('configured maximum width applies while the viewport is resized @aat', async ({page}) => {
  await setup(page, 1024, 'ltr')
  const {menu} = await openMenu(page, 'Capped')
  await expect.poll(() => menu.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(256, 0)
  await page.setViewportSize({width: 220, height: 900})
  await expect.poll(() => menu.evaluate(element => element.getBoundingClientRect().right)).toBeLessThanOrEqual(212.5)
  await expectWithinAvailableWidth(menu)
  const rect = await menu.boundingBox()
  expect(rect).not.toBeNull()
  expect(rect!.x).toBeGreaterThanOrEqual(7.5)
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(212.5)
  await page.setViewportSize({width: 1024, height: 900})
  await expect.poll(() => menu.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(256, 0)
})

test('configured widths and intrinsic short menus retain their normal size when space permits @aat', async ({page}) => {
  await setup(page, 1400, 'ltr')
  for (const [label, expectedWidth] of [
    ['Small width', 256],
    ['Medium', 320],
    ['Large', 480],
    ['Extra large width', 640],
    ['Double extra large width', 960],
    ['Default width', 192],
    ['Short auto', 192],
  ] as const) {
    const {menu, trigger} = await openMenu(page, label)
    await expect
      .poll(() => menu.evaluate(element => element.getBoundingClientRect().width))
      .toBeCloseTo(expectedWidth, 0)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
  }
})

test('intrinsic menu content wraps inside a narrow viewport @aat', async ({page}) => {
  await setup(page, 320, 'ltr')
  const {menu} = await openMenu(page, 'Long auto')
  await expectWithinAvailableWidth(menu)
  const lines = await menu
    .getByRole('menuitem', {name: 'LongUnbrokenWord'.repeat(8)})
    .locator('[data-item-label]')
    .evaluate(element => {
      const menuRect = element.closest('[role="menu"]')!.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(element)
      return Array.from(range.getClientRects(), rect => ({
        left: rect.left - menuRect.left,
        right: menuRect.right - rect.right,
      }))
    })
  expect(lines.length).toBeGreaterThan(1)
  for (const line of lines) {
    expect(line.left).toBeGreaterThanOrEqual(-0.5)
    expect(line.right).toBeGreaterThanOrEqual(-0.5)
  }
  await expect(page).toHaveNoViolations()
})

test('all configured maximum sizes remain effective when space permits @aat', async ({page}) => {
  await setup(page, 1400, 'ltr')
  for (const [label, expectedWidth] of [
    ['Capped', 256],
    ['Medium cap', 320],
    ['Large cap', 480],
    ['Extra large cap', 640],
    ['Double extra large cap', 960],
  ] as const) {
    const {menu, trigger} = await openMenu(page, label)
    await expect
      .poll(() => menu.evaluate(element => element.getBoundingClientRect().width))
      .toBeCloseTo(expectedWidth, 0)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
  }
})

test('a caller can intentionally override the width @aat', async ({page}) => {
  await setup(page, 320, 'ltr')
  const {menu} = await openMenu(page, 'Custom width')
  await expect.poll(() => menu.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(480, 0)
})

test('a caller can override a configured maximum width when space permits @aat', async ({page}) => {
  await setup(page, 1400, 'ltr')
  const {menu} = await openMenu(page, 'Custom max')
  await expect.poll(() => menu.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(480, 0)
})

test('fullscreen menus retain full viewport width on narrow screens @aat', async ({page}) => {
  await setup(page, 320, 'ltr')
  const {menu, trigger} = await openMenu(page, 'Fullscreen')
  await expect.poll(() => menu.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(320, 0)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})

for (const label of ['Medium', 'Boundary']) {
  test(`a keyboard-opened submenu fits its ${label.toLowerCase()} constraints @aat`, async ({page}) => {
    await setup(page, 320, 'ltr')
    const {menu} = await openMenu(page, label)
    const submenuTrigger = menu.getByRole('menuitem', {name: 'Nested actions'})
    await submenuTrigger.focus()
    await submenuTrigger.press('ArrowRight')
    const submenu = page.getByRole('menu', {name: `${label} submenu`})
    await expect(submenu).toBeVisible()
    await expectWithinAvailableWidth(submenu)
    const rect = await submenu.boundingBox()
    const boundary = await page.getByTestId(`${label}-boundary`).boundingBox()
    expect(rect).not.toBeNull()
    expect(boundary).not.toBeNull()
    expect(rect!.width).toBeGreaterThan(100)
    expect(rect!.x).toBeGreaterThanOrEqual(boundary!.x + 7.5)
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(boundary!.x + boundary!.width - 7.5)
    await expect(submenu.getByRole('menuitem', {name: 'Nested option'})).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(submenuTrigger).toBeFocused()
  })
}
