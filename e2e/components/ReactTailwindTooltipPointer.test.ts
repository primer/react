import path from 'node:path'
import {expect, test, type Locator, type Page} from '@playwright/test'
import {reactTailwindHostUtilities} from '../test-helpers/react-tailwind-fixture'
import {build} from 'vite'

const packageRoot = path.resolve(__dirname, '../../packages/react-tailwind')
const alternateBaseUi = process.env.BASE_UI_REACT_DIR
let fixtureScript: string

test.beforeAll(async () => {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    root: packageRoot,
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: alternateBaseUi ? [{find: /^@base-ui\/react\/(.+)$/, replacement: `${alternateBaseUi}/$1/index.mjs`}] : [],
    },
    define: {'process.env.NODE_ENV': JSON.stringify('production')},
    oxc: {jsx: {runtime: 'automatic'}},
    build: {
      write: false,
      minify: false,
      lib: {
        entry: path.join(packageRoot, 'script/tooltip-pointer-browser.tsx'),
        formats: ['iife'],
        name: 'TooltipPointerFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('Tooltip pointer fixture build did not return a script')
  if (alternateBaseUi && !script.moduleIds.some(id => id.startsWith(`${alternateBaseUi}/`))) {
    throw new Error('The alternate Base UI package was not included in the fixture')
  }
  fixtureScript = script.code
})

async function setup(page: Page, mode: string, extra = '') {
  await page.setViewportSize({width: 800, height: 600})
  await page.goto(`about:blank?mode=${mode}${extra}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/theme.css')})
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addStyleTag({path: reactTailwindHostUtilities})
  await page.addScriptTag({content: fixtureScript})
}

async function openByFocus(page: Page, mode: string) {
  const trigger = page.getByRole('button', {name: 'Add workflow name'})
  await page.keyboard.press('Tab')
  await expect(trigger).toBeFocused()
  const popup =
    mode === 'raw' ? page.getByTestId('raw-tooltip') : page.locator('[data-component="Tooltip.Content"][data-open]')
  await expect(popup).toBeVisible()
  if (mode !== 'raw') {
    const triggerId = await trigger.getAttribute('data-tooltip-trigger')
    if (!triggerId) throw new Error('Expected a tooltip trigger identifier')
    await expect(popup).toHaveAttribute('aria-hidden', 'true')
    await expect(popup).toHaveAttribute('data-tooltip-popup', triggerId)
  }
  return {trigger, popup, clear: page.getByRole('button', {name: 'Clear workflow name'})}
}

async function center(locator: Locator) {
  const bounds = await locator.boundingBox()
  if (!bounds) throw new Error('Expected a visible element')
  return {x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2}
}

async function containsPoint(locator: Locator, point: {x: number; y: number}) {
  const bounds = await locator.boundingBox()
  if (!bounds) throw new Error('Expected a visible element')
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  )
}

async function expectVisibleFor(locator: Locator, milliseconds: number) {
  const start = Date.now()
  let wasHidden = false
  await expect
    .poll(
      async () => {
        if (!(await locator.isVisible())) wasHidden = true
        return !wasHidden && Date.now() - start >= milliseconds
      },
      {timeout: milliseconds + 1000, intervals: [25]},
    )
    .toBe(true)
}

for (const mode of ['builtin', 'raw'] as const) {
  test.fail(`${mode} focus-open tooltip lets an overlapping control receive a pointer click @aat`, async ({page}) => {
    await setup(page, mode)
    const {clear} = await openByFocus(page, mode)
    const point = await center(clear)
    await page.mouse.click(point.x, point.y)
    await expect(page.getByTestId('clears')).toHaveText('1')
  })
}

test('a top-positioned built-in tooltip avoids the adjacent clear action when there is room @aat', async ({page}) => {
  await setup(page, 'top')
  const {trigger, popup, clear} = await openByFocus(page, 'top')
  const point = await center(clear)
  expect(await containsPoint(popup, point)).toBe(false)
  await page.mouse.click(point.x, point.y)
  await expect(page.getByTestId('clears')).toHaveText('1')
  await expect(trigger).toHaveAccessibleName('Add workflow name')
})

test('a top-positioned built-in tooltip remains hoverable and dismissible @aat', async ({page}) => {
  await setup(page, 'top', '&hint&hover')
  const {trigger, popup} = await openByFocus(page, 'top')
  await expect(trigger).toHaveAccessibleName('Add workflow name')
  await expect(trigger).toHaveAccessibleDescription(/\(control k\)/i)
  const triggerPoint = await center(trigger)
  await page.mouse.move(triggerPoint.x, triggerPoint.y)
  const popupPoint = await center(popup)
  await page.mouse.move(popupPoint.x, popupPoint.y, {steps: 8})
  await expectVisibleFor(popup, 200)
  await page.keyboard.press('Escape')
  await expect(popup).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test.fail(
  'a top-positioned tooltip still avoids the clear action when it flips at the viewport edge @aat',
  async ({page}) => {
    await setup(page, 'top', '&edge')
    const {clear} = await openByFocus(page, 'top')
    const point = await center(clear)
    await page.mouse.click(point.x, point.y)
    await expect(page.getByTestId('clears')).toHaveText('1')
  },
)

test.fail(
  'disabling pointer events on only the popup lets an overlapping control receive a click @aat',
  async ({page}) => {
    await setup(page, 'pass-through')
    const {clear} = await openByFocus(page, 'pass-through')
    const point = await center(clear)
    await page.mouse.click(point.x, point.y)
    await expect(page.getByTestId('clears')).toHaveText('1')
  },
)

for (const mode of ['pass-through-positioner', 'no-hover'] as const) {
  test(`${mode} tooltip allows a pointer click through the popup @aat`, async ({page}) => {
    await setup(page, mode)
    const {popup, clear} = await openByFocus(page, mode)
    const point = await center(clear)
    expect(await containsPoint(popup, point)).toBe(true)
    await page.mouse.click(point.x, point.y)
    await expect(page.getByTestId('clears')).toHaveText('1')
  })
}

for (const mode of ['composed', 'pass-through'] as const) {
  test(`${mode} tooltip remains visible while the pointer moves onto its content @aat`, async ({page}) => {
    await setup(page, mode, '&hover')
    const trigger = page.getByRole('button', {name: 'Add workflow name'})
    const triggerPoint = await center(trigger)
    await page.mouse.move(triggerPoint.x, triggerPoint.y)
    const popup = page.locator('[data-component="Tooltip.Content"][data-open]')
    await expect(popup).toBeVisible()
    const popupPoint = await center(popup)
    await page.mouse.move(popupPoint.x, popupPoint.y, {steps: 8})
    await expectVisibleFor(popup, 200)
  })
}

test.fail('a pointer-transparent positioner keeps a hover-open tooltip visible on its content @aat', async ({page}) => {
  await setup(page, 'pass-through-positioner', '&hover')
  const trigger = page.getByRole('button', {name: 'Add workflow name'})
  const triggerPoint = await center(trigger)
  await page.mouse.move(triggerPoint.x, triggerPoint.y)
  const popup = page.locator('[data-component="Tooltip.Content"][data-open]')
  await expect(popup).toBeVisible()
  const popupPoint = await center(popup)
  await page.mouse.move(popupPoint.x, popupPoint.y, {steps: 8})
  await expectVisibleFor(popup, 200)
})

test('disabling a hoverable popup closes it when the pointer leaves the trigger @aat', async ({page}) => {
  await setup(page, 'no-hover', '&hover')
  const trigger = page.getByRole('button', {name: 'Add workflow name'})
  const triggerPoint = await center(trigger)
  await page.mouse.move(triggerPoint.x, triggerPoint.y)
  const popup = page.locator('[data-component="Tooltip.Content"][data-open]')
  await expect(popup).toBeVisible()
  const popupPoint = await center(popup)
  await page.mouse.move(popupPoint.x, popupPoint.y, {steps: 8})
  await expect(popup).toHaveCount(0)
})
