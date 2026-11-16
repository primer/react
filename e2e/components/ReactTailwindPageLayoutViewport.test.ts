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
        entry: path.join(packageRoot, 'script/page-layout-viewport-browser.tsx'),
        formats: ['iife'],
        name: 'PageLayoutViewportFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('PageLayout viewport fixture build did not return a script')
  fixtureScript = script.code
})

async function setup(
  page: Page,
  mode: 'responsive' | 'sidebar' | 'frame' | 'moving' | 'controlled' | 'controlled-accept',
) {
  await page.setViewportSize({width: 1280, height: 720})
  await page.goto(`about:blank?mode=${mode}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
}

async function waitForResizeDelivery(page: Page) {
  await page.evaluate(
    () =>
      new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))),
  )
}

async function holdAnimationFramesUntilPointerUp(page: Page) {
  await page.evaluate(() => {
    const requestFrame = window.requestAnimationFrame
    const cancelFrame = window.cancelAnimationFrame
    window.requestAnimationFrame = () => -1
    window.cancelAnimationFrame = () => {}
    window.addEventListener(
      'pointerup',
      () => {
        window.requestAnimationFrame = requestFrame
        window.cancelAnimationFrame = cancelFrame
      },
      {once: true},
    )
  })
}

test('responsive pane updates across viewport resets without observer loop errors @aat', async ({page}) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await setup(page, 'responsive')
  const pane = page.getByTestId('responsive-pane')
  await expect(pane).toHaveAttribute('data-width', '296')

  await page.setViewportSize({width: 414, height: 896})
  await expect(pane).toHaveAttribute('data-width', '256')
  await expect(pane).toHaveCSS('height', '1600px')
  await waitForResizeDelivery(page)
  expect(errors).toEqual([])

  await page.setViewportSize({width: 1280, height: 720})
  await expect(pane).toHaveAttribute('data-width', '296')
  await expect(pane).toHaveCSS('height', '300px')
  await waitForResizeDelivery(page)
  expect(errors).toEqual([])
})

test('resizable sidebar retains viewport bounds across reset and restoration @aat', async ({page}) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await setup(page, 'sidebar')
  const sidebar = page.locator('[data-component="PageLayout.Sidebar"]')
  const handle = page.getByRole('slider', {name: 'Draggable pane splitter', includeHidden: true})
  await expect(sidebar).toHaveCSS('--pane-width', '300px')
  await expect(handle).toHaveAttribute('aria-valuemax', '321')

  await page.setViewportSize({width: 414, height: 896})
  await expect(sidebar).toHaveCSS('--pane-width', '240px')
  await expect(handle).toHaveAttribute('aria-valuemax', '240')
  await waitForResizeDelivery(page)
  expect(errors).toEqual([])

  await page.setViewportSize({width: 1280, height: 720})
  await expect(sidebar).toHaveCSS('--pane-width', '240px')
  await expect(handle).toHaveAttribute('aria-valuemax', '321')
  await waitForResizeDelivery(page)
  expect(errors).toEqual([])
})

test('controlled sidebar restores its width and preserves an active keyboard resize @aat', async ({page}) => {
  await setup(page, 'controlled')
  const sidebar = page.locator('[data-component="PageLayout.Sidebar"]')
  const handle = page.getByRole('slider', {name: 'Draggable pane splitter'})
  const lastResize = page.getByTestId('last-resize')
  await expect(sidebar).toHaveCSS('width', '321px')
  await expect(handle).toHaveAttribute('aria-valuenow', '321')

  await page.setViewportSize({width: 800, height: 720})
  await expect(sidebar).toHaveCSS('width', '289px')
  await expect(handle).toHaveAttribute('aria-valuenow', '289')
  await expect(lastResize).toHaveText('none')

  await page.setViewportSize({width: 1024, height: 720})
  await expect(sidebar).toHaveCSS('width', '400px')
  await expect(handle).toHaveAttribute('aria-valuenow', '400')
  await handle.focus()
  await page.keyboard.down('ArrowRight')
  await expect(handle).toHaveAttribute('aria-valuenow', '403')

  await page.setViewportSize({width: 1100, height: 720})
  await expect(sidebar).toHaveCSS('width', '403px')
  await expect(handle).toHaveAttribute('aria-valuenow', '403')
  await page.keyboard.up('ArrowRight')
  await expect(lastResize).toHaveText('403')
  await expect(sidebar).toHaveCSS('width', '400px')
  await expect(handle).toHaveAttribute('aria-valuenow', '400')
  await page.getByRole('button', {name: 'Apply requested width'}).click()
  await expect(sidebar).toHaveCSS('width', '403px')
  await expect(handle).toHaveAttribute('aria-valuenow', '403')
})

test('controlled sidebar preserves an active pointer resize across a viewport change @aat', async ({page}) => {
  await setup(page, 'controlled')
  const sidebar = page.locator('[data-component="PageLayout.Sidebar"]')
  const handle = page.getByRole('slider', {name: 'Draggable pane splitter'})
  await expect(sidebar).toHaveCSS('width', '321px')
  const bounds = await handle.boundingBox()
  if (!bounds) throw new Error('Expected a visible drag handle')
  const x = bounds.x + bounds.width / 2
  const y = bounds.y + bounds.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x - 20, y, {steps: 4})
  await expect(handle).toHaveAttribute('aria-valuenow', '301')

  await page.setViewportSize({width: 1100, height: 720})
  await expect(sidebar).toHaveCSS('width', '301px')
  await expect(handle).toHaveAttribute('aria-valuenow', '301')
  await page.mouse.up()
  await expect(page.getByTestId('last-resize')).toHaveText('301')
  await expect(sidebar).toHaveCSS('width', '400px')
  await expect(handle).toHaveAttribute('aria-valuenow', '400')
})

test('controlled sidebar retains an accepted keyboard resize @aat', async ({page}) => {
  await setup(page, 'controlled-accept')
  await page.setViewportSize({width: 1024, height: 720})
  const sidebar = page.locator('[data-component="PageLayout.Sidebar"]')
  const handle = page.getByRole('slider', {name: 'Draggable pane splitter'})
  await expect(sidebar).toHaveCSS('width', '400px')
  await handle.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('last-resize')).toHaveText('403')
  await expect(sidebar).toHaveCSS('width', '403px')
  await expect(handle).toHaveAttribute('aria-valuenow', '403')
})

for (const mode of ['sidebar', 'controlled', 'controlled-accept'] as const) {
  test(`${mode} applies the last pointer movement before release @aat`, async ({page}) => {
    await setup(page, mode)
    await page.setViewportSize({width: 1024, height: 720})
    const sidebar = page.locator('[data-component="PageLayout.Sidebar"]')
    const handle = page.getByRole('slider', {name: 'Draggable pane splitter'})
    const initialWidth = mode === 'sidebar' ? 300 : 400
    await expect(handle).toHaveAttribute('aria-valuenow', String(initialWidth))
    const bounds = await handle.boundingBox()
    if (!bounds) throw new Error('Expected a visible drag handle')
    const x = bounds.x + bounds.width / 2
    const y = bounds.y + bounds.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await expect(handle).toHaveAttribute('data-dragging', '')
    await holdAnimationFramesUntilPointerUp(page)
    await page.mouse.move(x + 35, y)
    await expect(handle).toHaveAttribute('aria-valuenow', String(initialWidth))
    await page.mouse.up()

    const proposedWidth = initialWidth + 35
    const finalWidth = mode === 'controlled' ? initialWidth : proposedWidth
    if (mode !== 'sidebar') await expect(page.getByTestId('last-resize')).toHaveText(String(proposedWidth))
    await expect(sidebar).toHaveCSS('width', `${finalWidth}px`)
    await expect(handle).toHaveAttribute('aria-valuenow', String(finalWidth))
    await expect(handle).not.toHaveAttribute('data-dragging')
  })
}

test('controlled sidebar applies a queued touch movement before release @aat', async ({page, browserName}) => {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(browserName !== 'chromium', 'Trusted touch dispatch requires the Chrome DevTools Protocol')
  await setup(page, 'controlled-accept')
  await page.setViewportSize({width: 1024, height: 720})
  const sidebar = page.locator('[data-component="PageLayout.Sidebar"]')
  const handle = page.getByRole('slider', {name: 'Draggable pane splitter'})
  await expect(handle).toHaveAttribute('aria-valuenow', '400')
  const bounds = await handle.boundingBox()
  if (!bounds) throw new Error('Expected a visible drag handle')
  const x = Math.round(bounds.x + bounds.width / 2)
  const y = Math.round(bounds.y + bounds.height / 2)
  const session = await page.context().newCDPSession(page)
  try {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{x, y, id: 1}],
    })
    await expect(handle).toHaveAttribute('data-dragging', '')
    await holdAnimationFramesUntilPointerUp(page)
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{x: x + 35, y, id: 1}],
    })
    await expect(handle).toHaveAttribute('aria-valuenow', '400')
    await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []})
    await expect(page.getByTestId('last-resize')).toHaveText('435')
    await expect(sidebar).toHaveCSS('width', '435px')
    await expect(handle).toHaveAttribute('aria-valuenow', '435')
    await expect(handle).not.toHaveAttribute('data-dragging')
  } finally {
    await session.detach()
  }
})

test('embedded panes respond to their own viewport instead of the parent viewport @aat', async ({page}) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await setup(page, 'frame')
  const frame = page.getByTestId('viewport-frame')
  const content = page.frameLocator('[data-testid="viewport-frame"]')
  const pane = content.locator('[data-component="PageLayout.Pane"]')
  const handle = content.getByRole('slider', {name: 'Draggable pane splitter', includeHidden: true})
  await expect(pane).toHaveCSS('--pane-width', '296px')
  await expect(handle).toHaveAttribute('aria-valuemax', '480')

  await frame.evaluate(element => {
    element.style.width = '900px'
  })
  await expect(pane).toHaveCSS('--pane-width', '256px')
  await expect(handle).toHaveAttribute('aria-valuemax', '389')
  await waitForResizeDelivery(page)

  await page.setViewportSize({width: 414, height: 896})
  await frame.evaluate(element => {
    element.style.width = '1024px'
  })
  await expect(pane).toHaveCSS('--pane-width', '296px')
  await expect(handle).toHaveAttribute('aria-valuemax', '480')
  await waitForResizeDelivery(page)
  expect(errors).toEqual([])
})

test('late and moved pane targets follow and unsubscribe from their owning viewport @aat', async ({page}) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await setup(page, 'moving')
  const frame = page.getByTestId('viewport-frame')
  const frameContent = page.frameLocator('[data-testid="viewport-frame"]')
  const parent = page.getByTestId('parent-target')

  await page.getByRole('button', {name: 'Move to frame'}).click()
  await expect(frameContent.getByTestId('moving-responsive')).toHaveAttribute('data-width', '256')
  await expect(frameContent.getByTestId('moving-resizable')).toHaveAttribute('data-width', '289')
  await expect(frameContent.getByTestId('moving-resizable-handle')).toHaveAttribute('aria-valuemax', '289')

  await frame.evaluate(element => {
    element.style.width = '1100px'
  })
  await expect(frameContent.getByTestId('moving-responsive')).toHaveAttribute('data-width', '296')
  await expect(frameContent.getByTestId('moving-resizable-handle')).toHaveAttribute('aria-valuemax', '480')

  await page.getByRole('button', {name: 'Move to parent'}).click()
  await expect(parent.getByTestId('moving-responsive')).toHaveAttribute('data-width', '296')
  await expect(parent.getByTestId('moving-resizable-handle')).toHaveAttribute('aria-valuemax', '321')
  await frame.evaluate(element => {
    element.style.width = '800px'
  })
  await waitForResizeDelivery(page)
  await expect(parent.getByTestId('moving-responsive')).toHaveAttribute('data-width', '296')
  await expect(parent.getByTestId('moving-resizable-handle')).toHaveAttribute('aria-valuemax', '321')

  await page.getByRole('button', {name: 'Move to frame'}).click()
  await expect(frameContent.getByTestId('moving-responsive')).toHaveAttribute('data-width', '256')
  await expect(frameContent.getByTestId('moving-resizable-handle')).toHaveAttribute('aria-valuemax', '289')
  await waitForResizeDelivery(page)
  expect(errors).toEqual([])
})
