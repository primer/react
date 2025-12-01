import {test, expect, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

const HEAVY_PERFORMANCE_STORY = 'components-pagelayout-performance-tests--heavy-content'

const dragHandleSelector = "[role='slider'][aria-label='Draggable pane splitter']"

async function readContentWrapperState(page: Page) {
  return page.evaluate(() => {
    const content = document.querySelector('[data-width]') as HTMLElement | null
    const wrapper = content?.parentElement as HTMLElement | null
    const getContain = (element: HTMLElement | null | undefined) => (element ? getComputedStyle(element).contain : '')
    const getPointerEvents = (element: HTMLElement | null | undefined) =>
      element ? getComputedStyle(element).pointerEvents : ''

    const handle = document.querySelector("[role='slider'][aria-label='Draggable pane splitter']") as HTMLElement | null

    return {
      wrapperContain: getContain(wrapper),
      wrapperPointerEvents: getPointerEvents(wrapper),
      contentContain: getContain(content),
      handleDraggingAttr: handle?.getAttribute('data-dragging') ?? null,
    }
  })
}

async function readPaneCssWidth(page: Page) {
  return page.evaluate(() => {
    const pane = document.querySelector('[data-resizable]') as HTMLElement | null
    if (!pane) return 0
    const value = getComputedStyle(pane).getPropertyValue('--pane-width').trim()
    if (!value) return 0
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  })
}

test.describe('PageLayout performance optimizations', () => {
  test('applies containment optimizations during pointer drag', async ({page}) => {
    await visit(page, {id: HEAVY_PERFORMANCE_STORY})

    const initialState = await readContentWrapperState(page)
    expect(initialState.wrapperContain.toLowerCase()).toContain('layout')
    expect(initialState.wrapperContain.toLowerCase()).not.toContain('paint')
    expect(initialState.wrapperContain.toLowerCase()).not.toContain('size')
    expect(initialState.wrapperPointerEvents).toBe('auto')
    expect(initialState.handleDraggingAttr).toBeNull()

    const handle = page.locator(dragHandleSelector)
    await expect(handle).toBeVisible()
    const box = await handle.boundingBox()
    if (!box) {
      throw new Error('Could not determine drag handle position')
    }

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await expect
      .poll(async () => (await readContentWrapperState(page)).wrapperPointerEvents, {
        interval: 20,
        timeout: 1000,
      })
      .toBe('none')

    const draggingState = await readContentWrapperState(page)
    expect(draggingState.wrapperContain.toLowerCase()).toContain('paint')
    expect(draggingState.wrapperContain.toLowerCase()).not.toContain('size')
    expect(draggingState.wrapperPointerEvents).toBe('none')
    expect(draggingState.handleDraggingAttr).toBe('true')
    expect(draggingState.contentContain.toLowerCase()).toContain('paint')

    await page.mouse.up()
    await expect
      .poll(async () => (await readContentWrapperState(page)).wrapperPointerEvents, {
        interval: 20,
        timeout: 1000,
      })
      .toBe('auto')

    const releasedState = await readContentWrapperState(page)
    expect(releasedState.wrapperContain.toLowerCase()).not.toContain('paint')
    expect(releasedState.wrapperPointerEvents).toBe('auto')
    expect(releasedState.handleDraggingAttr).toBeNull()
  })

  test('updates pane width via CSS variables and persists on drag end', async ({page}) => {
    await visit(page, {id: HEAVY_PERFORMANCE_STORY})
    await page.evaluate(() => localStorage.removeItem('paneWidth'))

    await expect.poll(async () => readPaneCssWidth(page), {interval: 50, timeout: 2000}).toBeGreaterThan(0)

    const recordedInitialWidth = await readPaneCssWidth(page)

    const handle = page.locator(dragHandleSelector)
    await expect(handle).toBeVisible()
    const box = await handle.boundingBox()
    if (!box) {
      throw new Error('Could not determine drag handle position')
    }

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2, {steps: 4})
    await expect
      .poll(async () => readPaneCssWidth(page), {interval: 20, timeout: 1000})
      .toBeGreaterThan(recordedInitialWidth)

    await page.mouse.up()
    await expect
      .poll(async () => readPaneCssWidth(page), {interval: 20, timeout: 1000})
      .toBeGreaterThan(recordedInitialWidth)

    const widthAfterDrag = await readPaneCssWidth(page)

    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('paneWidth')), {
        interval: 20,
        timeout: 1000,
      })
      .not.toBeNull()

    const storedValue = await page.evaluate(() => localStorage.getItem('paneWidth'))
    const parsedStoredWidth = storedValue ? Number.parseFloat(storedValue) : NaN
    expect(parsedStoredWidth).toBeCloseTo(widthAfterDrag, 0)
  })
})
