import path from 'node:path'
import {expect, test, type Locator, type Page} from '@playwright/test'
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
        entry: path.join(packageRoot, 'script/page-layout-drag-browser.tsx'),
        formats: ['iife'],
        name: 'PageLayoutDragFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('PageLayout drag fixture build did not return a script')
  fixtureScript = script.code
})

async function setup(page: Page, strict: boolean, direction: 'ltr' | 'rtl', layout = '', width = 1024, scope = '') {
  await page.setViewportSize({width, height: 900})
  await page.goto(`about:blank?id=page-layout-drag${strict ? '&strict' : ''}&layout=${layout}&scope=${scope}`)
  await page.evaluate(dir => {
    document.documentElement.lang = 'en'
    document.documentElement.dir = dir
    document.title = 'Pane resizing'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  }, direction)
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
}

async function expectPhysicalResize(
  page: Page,
  layout: Locator,
  kind: 'pane' | 'sidebar',
  input: 'keyboard' | 'pointer',
  change: 'increase' | 'decrease',
) {
  const pane = layout.locator(`[data-component="PageLayout.${kind === 'pane' ? 'Pane' : 'Sidebar'}"]`)
  const handle = layout.getByRole('slider', {name: 'Draggable pane splitter'})
  await handle.scrollIntoViewIfNeeded()

  const paneBounds = await pane.boundingBox()
  const handleBounds = await handle.boundingBox()
  if (!paneBounds || !handleBounds) throw new Error('Expected a visible pane and drag handle')
  const paneOnLeft = paneBounds.x + paneBounds.width / 2 < handleBounds.x + handleBounds.width / 2
  const delta = input === 'keyboard' ? 3 : 36
  const movement = (paneOnLeft ? 1 : -1) * (change === 'increase' ? delta : -delta)
  if (input === 'keyboard') {
    await handle.focus()
    await page.keyboard.press(movement > 0 ? 'ArrowRight' : 'ArrowLeft')
  } else {
    const x = handleBounds.x + handleBounds.width / 2
    const y = handleBounds.y + handleBounds.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await expect(handle).toHaveAttribute('data-dragging', '')
    await page.mouse.move(x + movement, y, {steps: 4})
  }
  const expectedWidth = Math.round(paneBounds.width + (change === 'increase' ? delta : -delta))
  await expect.poll(async () => (await pane.boundingBox())?.width, {timeout: 1500}).toBeCloseTo(expectedWidth, 0)
  await expect
    .poll(async () => (await handle.boundingBox())?.x, {timeout: 1500})
    .toBeCloseTo(handleBounds.x + movement, 0)
  if (input === 'pointer') await page.mouse.up()
  await expect(handle).toHaveAttribute('aria-valuenow', String(expectedWidth))
  await expect(handle).toHaveAttribute('aria-valuetext', `Pane width ${expectedWidth} pixels`)
}

test('pane and sidebar resize handles use their respective labels @aat', async ({page}) => {
  await setup(page, false, 'ltr', 'labelled')
  const sidebar = page.getByRole('slider', {name: 'Navigation sidebar', exact: true})
  const pane = page.getByRole('slider', {name: 'Inspector', exact: true})
  await expect(sidebar).toHaveAttribute('aria-label', 'Navigation sidebar')
  await expect(pane).toHaveAttribute('aria-labelledby', 'inspector-heading')
  await expect(sidebar).toHaveAttribute('aria-valuenow', '296')
  await expect(pane).toHaveAttribute('aria-valuenow', '296')

  await pane.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(pane).toHaveAttribute('aria-valuenow', '299')
  await expect(sidebar).toHaveAttribute('aria-valuenow', '296')
})

for (const direction of ['ltr', 'rtl'] as const) {
  for (const kind of ['pane', 'sidebar'] as const) {
    for (const scope of ['frame', 'shadow'] as const) {
      test(`${kind} follows the owning ${scope} viewport and direction (${direction}) @aat`, async ({page}) => {
        await setup(page, false, direction, 'responsive', scope === 'frame' ? 1440 : 1024, scope)
        const layout =
          scope === 'frame'
            ? page.frameLocator('[data-testid="layout-frame"]').getByTestId(`${kind}-start`)
            : page.getByTestId(`${kind}-start`)
        const handle = layout.getByRole('slider', {name: 'Draggable pane splitter'})
        await expect(handle).toHaveCSS('direction', direction)
        await expect(handle).toHaveAttribute('aria-valuemax', '513')
        for (const input of ['keyboard', 'pointer'] as const) {
          await expectPhysicalResize(page, layout, kind, input, 'increase')
          await expectPhysicalResize(page, layout, kind, input, 'decrease')
        }
      })
    }
  }
}

for (const direction of ['ltr', 'rtl'] as const) {
  for (const kind of ['pane', 'sidebar'] as const) {
    for (const position of ['start', 'end'] as const) {
      for (const input of ['keyboard', 'pointer'] as const) {
        test(`${kind} ${position} follows ${input} movement (${direction}) @aat`, async ({page}) => {
          await setup(page, false, direction, 'geometry')
          const layout = page.getByTestId(`${kind}-${position}`)
          await expectPhysicalResize(page, layout, kind, input, 'increase')
          await expectPhysicalResize(page, layout, kind, input, 'decrease')
        })
      }
    }
  }
}

for (const documentDirection of ['ltr', 'rtl'] as const) {
  for (const source of ['attribute', 'style'] as const) {
    for (const kind of ['pane', 'sidebar'] as const) {
      test(`${kind} uses inherited ${source} direction inside a ${documentDirection} document @aat`, async ({page}) => {
        await setup(page, false, documentDirection, 'geometry')
        const layout = page.getByTestId(`${kind}-start`)
        const direction = documentDirection === 'ltr' ? 'rtl' : 'ltr'
        await layout.evaluate(
          (element, options) => {
            if (options.source === 'attribute') element.setAttribute('dir', options.direction)
            else element.style.direction = options.direction
          },
          {source, direction},
        )
        const handle = layout.getByRole('slider', {name: 'Draggable pane splitter'})
        await expect(handle).toHaveCSS('direction', direction)
        for (const input of ['keyboard', 'pointer'] as const) {
          await expectPhysicalResize(page, layout, kind, input, 'increase')
          await expectPhysicalResize(page, layout, kind, input, 'decrease')
        }
      })
    }
  }
}

for (const direction of ['ltr', 'rtl'] as const) {
  for (const width of [1024, 1440]) {
    for (const kind of ['pane', 'sidebar'] as const) {
      for (const position of ['start', 'end'] as const) {
        test(`${kind} follows responsive ${position} position at ${width}px (${direction}) @aat`, async ({page}) => {
          await setup(page, false, direction, 'responsive', width)
          const layout = page.getByTestId(`${kind}-${position}`)
          const pane = layout.locator(`[data-component="PageLayout.${kind === 'pane' ? 'Pane' : 'Sidebar'}"]`)
          const handle = layout.getByRole('slider', {name: 'Draggable pane splitter'})
          await handle.scrollIntoViewIfNeeded()
          const paneBounds = await pane.boundingBox()
          const handleBounds = await handle.boundingBox()
          if (!paneBounds || !handleBounds) throw new Error('Expected a visible pane and drag handle')
          const paneOnLeft = paneBounds.x + paneBounds.width / 2 < handleBounds.x + handleBounds.width / 2
          const activePosition = width >= 1400 ? (position === 'start' ? 'end' : 'start') : position
          expect(paneOnLeft).toBe((activePosition === 'start') !== (direction === 'rtl'))
          for (const input of ['keyboard', 'pointer'] as const) {
            await expectPhysicalResize(page, layout, kind, input, 'increase')
            await expectPhysicalResize(page, layout, kind, input, 'decrease')
          }
        })
      }
    }
  }
}

for (const direction of ['ltr', 'rtl'] as const) {
  for (const kind of ['pane', 'sidebar'] as const) {
    test(`${kind} clamps keyboard and pointer resizing in ${direction} @aat`, async ({page}) => {
      await setup(page, false, direction, 'bounded')
      const layout = page.getByTestId(`${kind}-start`)
      const pane = layout.locator(`[data-component="PageLayout.${kind === 'pane' ? 'Pane' : 'Sidebar'}"]`)
      const handle = layout.getByRole('slider', {name: 'Draggable pane splitter'})
      await handle.scrollIntoViewIfNeeded()
      const paneBounds = await pane.boundingBox()
      const handleBounds = await handle.boundingBox()
      if (!paneBounds || !handleBounds) throw new Error('Expected a visible pane and drag handle')
      const paneOnLeft = paneBounds.x + paneBounds.width / 2 < handleBounds.x + handleBounds.width / 2
      const growKey = paneOnLeft ? 'ArrowRight' : 'ArrowLeft'
      const shrinkKey = paneOnLeft ? 'ArrowLeft' : 'ArrowRight'

      await expect(handle).toHaveAttribute('aria-valuemin', '280')
      await expect(handle).toHaveAttribute('aria-valuemax', '310')
      await handle.focus()
      for (let i = 0; i < 10; i++) await page.keyboard.press(shrinkKey)
      await expect(handle).toHaveAttribute('aria-valuenow', '280')
      await expect(handle).toHaveAttribute('aria-valuetext', 'Pane width 280 pixels')
      await expect.poll(async () => (await pane.boundingBox())?.width).toBeCloseTo(280, 0)
      for (let i = 0; i < 15; i++) await page.keyboard.press(growKey)
      await expect(handle).toHaveAttribute('aria-valuenow', '310')
      await expect(handle).toHaveAttribute('aria-valuetext', 'Pane width 310 pixels')
      await expect.poll(async () => (await pane.boundingBox())?.width).toBeCloseTo(310, 0)

      for (const [change, target] of [
        ['decrease', 280],
        ['increase', 310],
      ] as const) {
        const bounds = await handle.boundingBox()
        if (!bounds) throw new Error('Expected a visible drag handle')
        const x = bounds.x + bounds.width / 2
        const y = bounds.y + bounds.height / 2
        const movement = (paneOnLeft ? 1 : -1) * (change === 'increase' ? 80 : -80)
        await page.mouse.move(x, y)
        await page.mouse.down()
        await page.mouse.move(x + movement, y, {steps: 4})
        await expect.poll(async () => (await pane.boundingBox())?.width).toBeCloseTo(target, 0)
        await page.mouse.up()
        await expect(handle).toHaveAttribute('aria-valuenow', String(target))
        await expect(handle).toHaveAttribute('aria-valuetext', `Pane width ${target} pixels`)
      }
    })
  }
}

for (const strict of [false, true]) {
  test(`standalone drag targets track pointer capture and keyboard focus (StrictMode ${strict}) @aat`, async ({
    page,
  }) => {
    await setup(page, strict, 'ltr')
    const standalone = page.getByTestId('standalone')
    const handle = standalone.getByRole('slider', {name: 'Resize standalone pane'})
    const pane = standalone.getByTestId('standalone-pane')
    const content = standalone.getByTestId('standalone-content')
    const updates = standalone.getByTestId('standalone-updates')

    await handle.focus()
    await page.keyboard.down('ArrowRight')
    await expect(handle).toHaveAttribute('data-dragging', '')
    await expect(pane).toHaveAttribute('data-dragging', 'true')
    await expect(content).toHaveAttribute('data-dragging', 'true')
    await expect(updates).toContainText('"keyboard":1')
    await page.keyboard.up('ArrowRight')
    await expect(handle).not.toHaveAttribute('data-dragging')
    await expect(pane).not.toHaveAttribute('data-dragging')
    await expect(content).not.toHaveAttribute('data-dragging')
    await expect(updates).toContainText('"ends":1')
    await expect(handle).toBeFocused()

    await page.keyboard.down('ArrowLeft')
    await expect(pane).toHaveAttribute('data-dragging', 'true')
    await page.keyboard.press('Tab')
    await expect(standalone.getByRole('textbox', {name: 'After standalone handle'})).toBeFocused()
    await expect(pane).not.toHaveAttribute('data-dragging')
    await expect(content).not.toHaveAttribute('data-dragging')
    await expect(updates).toContainText('"ends":2')
    await page.keyboard.up('ArrowLeft')

    const bounds = await handle.boundingBox()
    if (!bounds) throw new Error('Expected a visible drag handle')
    const x = bounds.x + bounds.width / 2
    const y = bounds.y + bounds.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await expect(pane).toHaveAttribute('data-dragging', 'true')
    await expect(content).toHaveAttribute('data-dragging', 'true')
    await expect(updates).toContainText('"starts":1')
    await page.mouse.move(x + 40, y)
    await expect(updates).toContainText(/"pointer":[1-9]\d*/)
    await page.mouse.up()
    await expect(handle).not.toHaveAttribute('data-dragging')
    await expect(pane).not.toHaveAttribute('data-dragging')
    await expect(content).not.toHaveAttribute('data-dragging')
    await expect(updates).toContainText('"ends":3')
  })
}

test('keyboard and pointer resizing retain separate interaction ownership @aat', async ({page}) => {
  await setup(page, true, 'ltr')
  const standalone = page.getByTestId('standalone')
  const handle = standalone.getByRole('slider', {name: 'Resize standalone pane'})
  const pane = standalone.getByTestId('standalone-pane')
  const updates = standalone.getByTestId('standalone-updates')
  const bounds = await handle.boundingBox()
  if (!bounds) throw new Error('Expected a visible drag handle')
  const x = bounds.x + bounds.width / 2
  const y = bounds.y + bounds.height / 2

  await page.mouse.move(x, y)
  await handle.focus()
  await page.keyboard.down('ArrowRight')
  await page.mouse.move(x + bounds.width / 4, y)
  await expect(updates).toContainText('"keyboard":1')
  await expect(updates).toContainText('"pointer":0')
  await expect(updates).toContainText('"ends":0')

  await page.mouse.down()
  await expect(updates).toContainText('"ends":1')
  await expect(updates).toContainText('"starts":1')
  await page.keyboard.up('ArrowRight')
  await page.keyboard.press('ArrowLeft')
  await expect(updates).toContainText('"keyboard":1')
  await expect(updates).toContainText('"ends":1')
  await expect(pane).toHaveAttribute('data-dragging', 'true')

  await page.mouse.move(x + 40, y)
  await expect(updates).toContainText(/"pointer":[1-9]\d*/)
  await page.mouse.up()
  await expect(updates).toContainText('"ends":2')
  await expect(pane).not.toHaveAttribute('data-dragging')
})

test('resizable pane controls have no automated accessibility violations @aat', async ({page}) => {
  await setup(page, true, 'ltr')
  await expect(page.getByRole('slider')).toHaveCount(3)
  await expect(page).toHaveNoViolations()
})

for (const direction of ['ltr', 'rtl'] as const) {
  test(`pane and sidebar mark the appropriate content during keyboard resizing (${direction}) @aat`, async ({page}) => {
    await setup(page, true, direction)
    const paneLayout = page.getByTestId('pane-layout')
    const pane = paneLayout.locator('[data-component="PageLayout.Pane"]')
    const paneContent = paneLayout.getByRole('region', {name: 'Pane content'})
    const paneHandle = paneLayout.getByRole('slider', {name: 'Draggable pane splitter'})
    await paneHandle.focus()
    await page.keyboard.down('ArrowRight')
    await expect(pane).toHaveAttribute('data-dragging', 'true')
    await expect(paneContent).toHaveAttribute('data-dragging', 'true')
    await page.keyboard.up('ArrowRight')
    await expect(pane).not.toHaveAttribute('data-dragging')
    await expect(paneContent).not.toHaveAttribute('data-dragging')

    const sidebarLayout = page.getByTestId('sidebar-layout')
    const sidebar = sidebarLayout.locator('[data-component="PageLayout.Sidebar"]')
    const wrapper = sidebarLayout.locator('.sidebar-wrapper')
    const sidebarHandle = sidebarLayout.getByRole('slider', {name: 'Draggable pane splitter'})
    await sidebarHandle.focus()
    await page.keyboard.down('ArrowLeft')
    await expect(sidebar).toHaveAttribute('data-dragging', 'true')
    await expect(wrapper).toHaveAttribute('data-dragging', 'true')
    await page.keyboard.up('ArrowLeft')
    await expect(sidebar).not.toHaveAttribute('data-dragging')
    await expect(wrapper).not.toHaveAttribute('data-dragging')
  })
}
