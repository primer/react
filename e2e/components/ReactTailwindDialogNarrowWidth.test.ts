import path from 'node:path'
import {expect, test, type Locator, type Page} from '@playwright/test'
import {
  buildReactTailwindFixture,
  reactTailwindHostUtilities,
  reactTailwindPackageRoot,
} from '../test-helpers/react-tailwind-fixture'

const alternateBaseUi = process.env.BASE_UI_REACT_DIR
let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/dialog-narrow-width-browser.tsx', alternateBaseUi)
})

async function openDialog(
  page: Page,
  {
    actionIcon = false,
    actions,
    bodyControl = false,
    closeInitialFocus = false,
    customHeight = false,
    defaultOpen = false,
    direction = 'ltr',
    headerInitialFocus = false,
    headerTabIndex,
    height = 256,
    hostCase = false,
    iconControls = false,
    keepMounted = false,
    kind,
    linkFooter = false,
    linkVariant = false,
    modality,
    noActions = false,
    noClose = false,
    noInitialFocus = false,
    nowrapFooter = false,
    override,
    portalControl = false,
    position,
    rapidReopen = false,
    shadow = false,
    size,
    textScale = false,
    textSpacing = false,
    touchOpen = false,
    title,
    viewportWidth,
    width,
    wrapFooter = false,
    wrappedAction = false,
  }: {
    actionIcon?: boolean
    actions?: 'long'
    bodyControl?: boolean
    closeInitialFocus?: boolean
    customHeight?: boolean
    defaultOpen?: boolean
    direction?: 'ltr' | 'rtl'
    headerInitialFocus?: boolean
    headerTabIndex?: -1 | 0
    height?: number
    hostCase?: boolean
    iconControls?: boolean
    keepMounted?: boolean
    kind?: 'confirmation'
    linkFooter?: boolean
    linkVariant?: boolean
    modality?: 'non-modal' | 'trap-focus'
    noActions?: boolean
    noClose?: boolean
    noInitialFocus?: boolean
    nowrapFooter?: boolean
    override?: 'min' | 'body-min' | 'overflow'
    portalControl?: boolean
    position?: 'center' | 'left' | 'right' | 'bottom' | 'fullscreen' | 'responsive'
    rapidReopen?: boolean
    shadow?: boolean
    size?: 'small' | 'large'
    textScale?: boolean
    textSpacing?: boolean
    touchOpen?: boolean
    title?: 'long'
    viewportWidth: number
    width?: 'small' | 'medium' | 'large' | 'xlarge' | 'custom' | 'percent' | 'auto'
    wrapFooter?: boolean
    wrappedAction?: boolean
  },
) {
  await page.setViewportSize({width: viewportWidth, height})
  await page.emulateMedia({reducedMotion: 'reduce'})
  const params = new URLSearchParams()
  if (actionIcon) params.set('actionIcon', 'true')
  if (actions) params.set('actions', actions)
  if (bodyControl) params.set('bodyControl', 'true')
  if (closeInitialFocus) params.set('closeInitialFocus', 'true')
  if (customHeight) params.set('customHeight', 'true')
  if (defaultOpen) params.set('defaultOpen', 'true')
  if (headerInitialFocus) params.set('headerInitialFocus', 'true')
  if (headerTabIndex !== undefined) params.set('headerTabIndex', String(headerTabIndex))
  if (hostCase) params.set('case', 'host')
  if (iconControls) params.set('iconControls', 'true')
  if (keepMounted) params.set('keepMounted', 'true')
  if (kind) params.set('kind', kind)
  if (linkFooter) params.set('linkFooter', 'true')
  if (linkVariant) params.set('linkVariant', 'true')
  if (modality) params.set('modality', modality)
  if (noActions) params.set('noActions', 'true')
  if (noClose) params.set('noClose', 'true')
  if (noInitialFocus) params.set('noInitialFocus', 'true')
  if (nowrapFooter) params.set('nowrapFooter', 'true')
  if (override) params.set('override', override)
  if (position) params.set('position', position)
  if (rapidReopen) params.set('rapidReopen', 'true')
  if (size) params.set('size', size)
  if (textSpacing) params.set('textSpacing', 'true')
  if (title) params.set('title', title)
  if (width) params.set('width', width)
  if (wrapFooter) params.set('wrapFooter', 'true')
  if (wrappedAction) params.set('wrappedAction', 'true')
  await page.goto(`about:blank?${params}`)
  await page.evaluate(
    ({dir, portalControl, shadow}) => {
      document.documentElement.lang = 'en'
      document.documentElement.dir = dir
      document.documentElement.setAttribute('data-color-mode', 'light')
      document.documentElement.setAttribute('data-light-theme', 'light')
      document.title = 'Dialog sizing'
      const root = document.createElement('main')
      root.id = 'root'
      if (shadow) {
        const host = document.createElement('div')
        host.id = 'dialog-shadow-host'
        const shadowRoot = host.attachShadow({mode: 'open'})
        const dialogContainer = document.createElement('div')
        dialogContainer.id = 'dialog-container'
        shadowRoot.append(root, dialogContainer)
        document.body.append(host)
      } else {
        document.body.append(root)
      }
      if (portalControl) {
        const portalTarget = document.createElement('div')
        portalTarget.id = 'portal-target'
        document.body.append(portalTarget)
      }
    },
    {dir: direction, portalControl, shadow},
  )
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addStyleTag({path: reactTailwindHostUtilities})
  await page.addStyleTag({path: require.resolve('@primer/primitives/dist/css/functional/size/z-index.css')})
  if (textScale) {
    await page.addStyleTag({content: 'html { font-size: 200% !important; }'})
  }
  if (textSpacing) {
    await page.addStyleTag({
      content:
        '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }',
    })
  }
  if (shadow) {
    await page.evaluate(() => {
      const shadowRoot = document.getElementById('dialog-shadow-host')?.shadowRoot
      if (!shadowRoot) throw new Error('Expected the dialog shadow root')
      for (const style of document.head.querySelectorAll('style')) shadowRoot.append(style.cloneNode(true))
    })
  }
  await page.addScriptTag({content: fixtureScript})
  const trigger = page.getByRole('button', {name: kind ? 'Open confirmation' : 'Open dialog', exact: true})
  if (!defaultOpen) {
    if (touchOpen) await trigger.tap()
    else {
      await trigger.focus()
      await page.keyboard.press('Enter')
    }
  }
  const dialog = page.getByRole(kind ? 'alertdialog' : 'dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).not.toHaveAttribute('data-starting-style')
  return {dialog, trigger}
}

async function expectWithinViewport(dialog: ReturnType<Page['getByRole']>) {
  const metrics = await dialog.evaluate(element => {
    const viewport = element.closest(
      '[data-component="Dialog.Viewport"], [data-component="ConfirmationDialog.Viewport"]',
    )
    if (!(viewport instanceof HTMLElement)) throw new Error('Expected a dialog viewport')
    const bounds = element.getBoundingClientRect()
    return {
      left: bounds.left,
      right: bounds.right,
      viewportWidth: window.innerWidth,
      clientWidth: viewport.clientWidth,
      scrollWidth: viewport.scrollWidth,
    }
  })
  expect(metrics.left).toBeGreaterThanOrEqual(-1)
  expect(metrics.right).toBeLessThanOrEqual(metrics.viewportWidth + 1)
  expect(metrics.scrollWidth - metrics.clientWidth).toBeLessThanOrEqual(1)
}

async function expectFocusedControlReachable(control: Locator, within: string) {
  await expect(control).toBeFocused()
  await expect
    .poll(() =>
      control.evaluate((element, selector) => {
        const container = element.closest(selector)
        const popup = element.closest('[role="dialog"]')
        if (!container || !popup) throw new Error('Expected the control inside its dialog and clipping container')
        const bounds = element.getBoundingClientRect()
        const containerBounds = container.getBoundingClientRect()
        const popupBounds = popup.getBoundingClientRect()
        const hit = document.elementFromPoint((bounds.left + bounds.right) / 2, (bounds.top + bounds.bottom) / 2)
        return (
          bounds.top >= Math.max(containerBounds.top, popupBounds.top) - 1 &&
          bounds.bottom <= Math.min(containerBounds.bottom, popupBounds.bottom) + 1 &&
          bounds.left >= Math.max(containerBounds.left, popupBounds.left) - 1 &&
          bounds.right <= Math.min(containerBounds.right, popupBounds.right) + 1 &&
          (hit === element || element.contains(hit))
        )
      }, within),
    )
    .toBe(true)
}

async function expectActionLabelFits(control: Locator) {
  const metrics = await control.evaluate(element => {
    const label = element.querySelector('[data-component="text"]')
    if (!label) throw new Error('Expected the action label')
    const bounds = element.getBoundingClientRect()
    const range = document.createRange()
    range.selectNodeContents(label)
    return {
      top: bounds.top,
      bottom: bounds.bottom,
      left: bounds.left,
      right: bounds.right,
      lines: Array.from(range.getClientRects(), line => ({
        top: line.top,
        bottom: line.bottom,
        left: line.left,
        right: line.right,
      })),
    }
  })
  expect(metrics.lines.length).toBeGreaterThan(0)
  for (const line of metrics.lines) {
    expect(line.top).toBeGreaterThanOrEqual(metrics.top - 1)
    expect(line.bottom).toBeLessThanOrEqual(metrics.bottom + 1)
    expect(line.left).toBeGreaterThanOrEqual(metrics.left - 1)
    expect(line.right).toBeLessThanOrEqual(metrics.right + 1)
  }
}

for (const direction of ['ltr', 'rtl'] as const) {
  for (const viewportWidth of [200, 280, 320, 360, 1024]) {
    test(`centers a default dialog within ${viewportWidth}px (${direction}) @aat`, async ({page}) => {
      const {dialog, trigger} = await openDialog(page, {
        direction,
        height: viewportWidth === 1024 ? 768 : 256,
        viewportWidth,
      })
      await expectWithinViewport(dialog)
      await expect(dialog).toHaveAttribute('aria-modal', 'true')
      const close = dialog.getByRole('button', {name: 'Close'})
      await expect(close).toBeFocused()
      await page.keyboard.press('Tab')
      const body = dialog.locator('[data-component="Dialog.Body"]')
      if ((await body.getAttribute('tabindex')) === '0') {
        await expect(body).toBeFocused()
        const scrollable = await body.evaluate(element => element.scrollHeight > element.clientHeight)
        if (scrollable) {
          await page.keyboard.press('End')
          await expect.poll(() => body.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
        }
        await page.keyboard.press('Tab')
      }
      await expect(dialog.getByRole('button', {name: 'Cancel'})).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(dialog.getByRole('button', {name: 'Confirm'})).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(close).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(dialog.getByRole('button', {name: 'Confirm'})).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
      await expect(trigger).toBeFocused()
    })
  }

  for (const width of ['small', 'medium', 'large', 'xlarge', 'custom', 'percent', 'auto'] as const) {
    for (const viewportWidth of [200, 320, 1024]) {
      test(`fits ${width} width in ${viewportWidth}px (${direction}) @aat`, async ({page}) => {
        const {dialog} = await openDialog(page, {direction, viewportWidth, width})
        await expectWithinViewport(dialog)
        if (viewportWidth === 1024) {
          const expected = {small: 296, medium: 320, large: 480, xlarge: 640, custom: 400, percent: 720, auto: 296}
          expect(await dialog.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(
            expected[width],
            0,
          )
        }
      })
    }
  }

  for (const position of ['left', 'right', 'bottom', 'fullscreen', 'responsive'] as const) {
    for (const viewportWidth of [200, 320, 1024]) {
      test(`fits ${position} position in ${viewportWidth}px (${direction}) @aat`, async ({page}) => {
        const {dialog} = await openDialog(page, {direction, position, viewportWidth})
        await expectWithinViewport(dialog)
      })
    }
  }

  for (const viewportWidth of [200, 320]) {
    test(`reflows a long title within ${viewportWidth}px (${direction}) @aat`, async ({page}) => {
      const {dialog} = await openDialog(page, {direction, height: 480, title: 'long', viewportWidth})
      await expectWithinViewport(dialog)
      const title = dialog.getByRole('heading')
      const titleMetrics = await title.evaluate(element => {
        const bounds = element.getBoundingClientRect()
        const range = document.createRange()
        range.selectNodeContents(element)
        const textBounds = Array.from(range.getClientRects(), rect => ({left: rect.left, right: rect.right}))
        return {left: bounds.left, right: bounds.right, textBounds}
      })
      expect(titleMetrics.textBounds.length).toBeGreaterThan(0)
      for (const bounds of titleMetrics.textBounds) {
        expect(bounds.left).toBeGreaterThanOrEqual(titleMetrics.left - 1)
        expect(bounds.right).toBeLessThanOrEqual(titleMetrics.right + 1)
      }
    })

    test(`keeps a wrapping long action inside ${viewportWidth}px (${direction}) @aat`, async ({page}) => {
      const {dialog} = await openDialog(page, {actions: 'long', direction, viewportWidth})
      const action = dialog.getByRole('button', {name: 'Repositoryzugriffsberechtigung'})
      await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused()
      for (
        let count = 0;
        count < 3 && !(await action.evaluate(element => element === document.activeElement));
        count++
      ) {
        await page.keyboard.press('Tab')
      }
      await expect(action).toBeFocused()
      await expectWithinViewport(dialog)
      const metrics = await action.evaluate(element => {
        const dialog = element.closest('[role="dialog"]')
        const label = element.querySelector('[data-component="text"]')
        if (!dialog || !label) throw new Error('Expected the action and label inside the dialog')
        const actionBounds = element.getBoundingClientRect()
        const dialogBounds = dialog.getBoundingClientRect()
        const range = document.createRange()
        range.selectNodeContents(label)
        const labelBounds = Array.from(range.getClientRects(), rect => ({
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        }))
        return {
          left: actionBounds.left,
          right: actionBounds.right,
          dialogLeft: dialogBounds.left,
          dialogRight: dialogBounds.right,
          dialogTop: dialogBounds.top,
          dialogBottom: dialogBounds.bottom,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          labelBounds,
        }
      })
      expect(metrics.left).toBeGreaterThanOrEqual(metrics.dialogLeft - 1)
      expect(metrics.right).toBeLessThanOrEqual(metrics.dialogRight + 1)
      expect(metrics.scrollWidth - metrics.clientWidth).toBeLessThanOrEqual(1)
      expect(metrics.labelBounds.length).toBeGreaterThan(0)
      for (const bounds of metrics.labelBounds) {
        expect(bounds.top).toBeGreaterThanOrEqual(metrics.dialogTop - 1)
        expect(bounds.bottom).toBeLessThanOrEqual(metrics.dialogBottom + 1)
        expect(bounds.left).toBeGreaterThanOrEqual(metrics.dialogLeft - 1)
        expect(bounds.right).toBeLessThanOrEqual(metrics.dialogRight + 1)
      }
    })

    for (const textSpacing of [false, true]) {
      test(`scrolls combined long dialog content at ${viewportWidth}px (${direction}, spacing ${textSpacing}) @aat`, async ({
        page,
      }) => {
        const {dialog, trigger} = await openDialog(page, {
          actions: 'long',
          direction,
          textSpacing,
          title: 'long',
          viewportWidth,
        })
        await expectWithinViewport(dialog)
        const action = dialog.getByRole('button', {name: 'Repositoryzugriffsberechtigung'})
        const header = dialog.locator('[data-component="Dialog.Header"]')
        await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused()
        if ((await header.evaluate(element => element.scrollHeight - element.clientHeight)) > 0) {
          await page.keyboard.press('End')
          await expect
            .poll(() => header.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop))
            .toBeLessThanOrEqual(1)
        }
        const titleEnd = await header.evaluate(element => {
          const heading = element.querySelector('[data-component="Dialog.Title"]')
          const text = heading?.firstChild
          if (!(text instanceof Text)) throw new Error('Expected the dialog title text')
          const range = document.createRange()
          range.setStart(text, text.length - 1)
          range.setEnd(text, text.length)
          const character = range.getBoundingClientRect()
          const container = element.getBoundingClientRect()
          return {
            top: character.top,
            bottom: character.bottom,
            left: character.left,
            right: character.right,
            containerTop: container.top,
            containerBottom: container.bottom,
            containerLeft: container.left,
            containerRight: container.right,
          }
        })
        expect(titleEnd.top).toBeGreaterThanOrEqual(titleEnd.containerTop - 1)
        expect(titleEnd.bottom).toBeLessThanOrEqual(titleEnd.containerBottom + 1)
        expect(titleEnd.left).toBeGreaterThanOrEqual(titleEnd.containerLeft - 1)
        expect(titleEnd.right).toBeLessThanOrEqual(titleEnd.containerRight + 1)

        expect(await dialog.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0)
        const box = await dialog.boundingBox()
        if (!box) throw new Error('Expected the dialog bounds')
        await page.mouse.move(box.x + box.width / 2, box.y + box.height - 4)
        await page.mouse.wheel(0, 200)
        await expect.poll(() => dialog.evaluate(element => element.scrollTop)).toBeGreaterThan(0)

        for (
          let count = 0;
          count < 3 && !(await action.evaluate(element => element === document.activeElement));
          count++
        ) {
          await page.keyboard.press('Tab')
        }
        await expect(action).toBeFocused()
        const metrics = await action.evaluate(element => {
          const dialog = element.closest('[role="dialog"]')
          const label = element.querySelector('[data-component="text"]')
          if (!dialog || !label) throw new Error('Expected the action and label inside the dialog')
          const dialogBounds = dialog.getBoundingClientRect()
          const range = document.createRange()
          range.selectNodeContents(label)
          const labelBounds = Array.from(range.getClientRects(), rect => ({
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
          }))
          return {
            top: dialogBounds.top,
            bottom: dialogBounds.bottom,
            left: dialogBounds.left,
            right: dialogBounds.right,
            labelBounds,
          }
        })
        expect(metrics.labelBounds.length).toBeGreaterThan(0)
        for (const bounds of metrics.labelBounds) {
          expect(bounds.top).toBeGreaterThanOrEqual(metrics.top - 1)
          expect(bounds.bottom).toBeLessThanOrEqual(metrics.bottom + 1)
          expect(bounds.left).toBeGreaterThanOrEqual(metrics.left - 1)
          expect(bounds.right).toBeLessThanOrEqual(metrics.right + 1)
        }
        await page.keyboard.press('Escape')
        await expect(dialog).toBeHidden()
        await expect(trigger).toBeFocused()
      })
    }
  }

  for (const {viewportWidth, height, textScale, wrapFooter} of [
    {viewportWidth: 200, height: 256, textScale: false, wrapFooter: false},
    {viewportWidth: 320, height: 256, textScale: false, wrapFooter: false},
    {viewportWidth: 400, height: 512, textScale: true, wrapFooter: true},
    {viewportWidth: 640, height: 512, textScale: true, wrapFooter: true},
  ]) {
    test(`keeps the host's long body and footer reachable at ${viewportWidth}px (${direction}, text scale ${textScale}) @aat`, async ({
      page,
    }) => {
      const {dialog, trigger} = await openDialog(page, {
        direction,
        height,
        hostCase: true,
        textScale,
        textSpacing: true,
        viewportWidth,
        wrapFooter,
      })
      await expectWithinViewport(dialog)
      const close = dialog.getByRole('button', {name: 'Close'})
      const header = dialog.locator('[data-component="Dialog.Header"]')
      const body = dialog.locator('[data-component="Dialog.Body"]')
      const cancel = dialog.getByRole('button', {name: 'Cancel'})
      const save = dialog.getByRole('button', {name: 'Save changes'})
      const headerOverflows = (await header.evaluate(element => element.scrollHeight - element.clientHeight)) > 0
      await expectFocusedControlReachable(close, '[data-component="Dialog.Header"]')
      if (headerOverflows) {
        await page.keyboard.press('End')
        await expect
          .poll(() => header.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop))
          .toBeLessThanOrEqual(1)
        await expectFocusedControlReachable(close, '[data-component="Dialog.Header"]')
        await page.keyboard.press('Home')
        await expect.poll(() => header.evaluate(element => element.scrollTop)).toBeLessThanOrEqual(1)
      }
      await page.keyboard.press('Tab')
      await expect(body).toBeFocused()
      expect(await body.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
      const firstCharacter = await body.evaluate(element => {
        const paragraph = element.querySelector('p:first-child')
        const text = paragraph?.firstChild
        if (!(text instanceof Text)) throw new Error('Expected the first paragraph')
        const range = document.createRange()
        range.setStart(text, 0)
        range.setEnd(text, 1)
        const character = range.getBoundingClientRect()
        const body = element.getBoundingClientRect()
        const popup = element.closest('[role="dialog"]')?.getBoundingClientRect()
        if (!popup) throw new Error('Expected the dialog popup')
        return {
          top: character.top,
          bottom: character.bottom,
          visibleTop: Math.max(body.top, popup.top),
          visibleBottom: Math.min(body.bottom, popup.bottom),
        }
      })
      expect(firstCharacter.top).toBeGreaterThanOrEqual(firstCharacter.visibleTop - 1)
      expect(firstCharacter.bottom).toBeLessThanOrEqual(firstCharacter.visibleBottom + 1)
      const bodyPoint = await body.evaluate(element => {
        const popup = element.closest('[role="dialog"]')
        if (!popup) throw new Error('Expected the dialog popup')
        const body = element.getBoundingClientRect()
        const dialog = popup.getBoundingClientRect()
        return {
          x: (Math.max(body.left, dialog.left) + Math.min(body.right, dialog.right)) / 2,
          y: (Math.max(body.top, dialog.top) + Math.min(body.bottom, dialog.bottom)) / 2,
        }
      })
      await page.mouse.move(bodyPoint.x, bodyPoint.y)
      await page.mouse.wheel(0, 200)
      await expect.poll(() => body.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
      await page.keyboard.press('End')
      await expect
        .poll(() => body.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop))
        .toBeLessThanOrEqual(1)
      const lastCharacter = await body.evaluate(element => {
        const paragraph = element.querySelector('p:last-child')
        const text = paragraph?.lastChild
        if (!(text instanceof Text)) throw new Error('Expected the final paragraph')
        const range = document.createRange()
        range.setStart(text, text.length - 1)
        range.setEnd(text, text.length)
        const character = range.getBoundingClientRect()
        const body = element.getBoundingClientRect()
        const popup = element.closest('[role="dialog"]')?.getBoundingClientRect()
        if (!popup) throw new Error('Expected the dialog popup')
        return {
          top: character.top,
          bottom: character.bottom,
          left: character.left,
          right: character.right,
          visibleTop: Math.max(body.top, popup.top),
          visibleBottom: Math.min(body.bottom, popup.bottom),
          visibleLeft: Math.max(body.left, popup.left),
          visibleRight: Math.min(body.right, popup.right),
        }
      })
      expect(lastCharacter.top).toBeGreaterThanOrEqual(lastCharacter.visibleTop - 1)
      expect(lastCharacter.bottom).toBeLessThanOrEqual(lastCharacter.visibleBottom + 1)
      expect(lastCharacter.left).toBeGreaterThanOrEqual(lastCharacter.visibleLeft - 1)
      expect(lastCharacter.right).toBeLessThanOrEqual(lastCharacter.visibleRight + 1)

      await page.keyboard.press('Tab')
      await expectFocusedControlReachable(cancel, '[role="dialog"]')
      await page.keyboard.press('Tab')
      await expectFocusedControlReachable(save, '[role="dialog"]')
      const saveLabel = await save.evaluate(element => {
        const label = element.querySelector('[data-component="text"]')
        if (!label) throw new Error('Expected the save action label')
        const bounds = element.getBoundingClientRect()
        const range = document.createRange()
        range.selectNodeContents(label)
        return {
          top: bounds.top,
          bottom: bounds.bottom,
          left: bounds.left,
          right: bounds.right,
          lines: Array.from(range.getClientRects(), line => ({
            top: line.top,
            bottom: line.bottom,
            left: line.left,
            right: line.right,
          })),
        }
      })
      expect(saveLabel.lines.length).toBeGreaterThan(0)
      for (const line of saveLabel.lines) {
        expect(line.top).toBeGreaterThanOrEqual(saveLabel.top - 1)
        expect(line.bottom).toBeLessThanOrEqual(saveLabel.bottom + 1)
        expect(line.left).toBeGreaterThanOrEqual(saveLabel.left - 1)
        expect(line.right).toBeLessThanOrEqual(saveLabel.right + 1)
      }
      await page.keyboard.press('Tab')
      if (headerOverflows) {
        await expect(header).toBeFocused()
        await page.keyboard.press('Tab')
      }
      await expectFocusedControlReachable(close, '[data-component="Dialog.Header"]')
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
      await expect(trigger).toBeFocused()
    })
  }

  for (const {linkFooter, linkVariant, size, actionIcon, wrappedAction} of [
    {linkFooter: false, linkVariant: false, size: 'small', actionIcon: true, wrappedAction: true},
    {linkFooter: true, linkVariant: false, size: 'large', actionIcon: true, wrappedAction: false},
    {linkFooter: false, linkVariant: true, size: undefined, actionIcon: false, wrappedAction: false},
    {linkFooter: true, linkVariant: true, size: undefined, actionIcon: false, wrappedAction: false},
  ] as const) {
    test(`wraps a ${size ?? 'medium'} ${linkFooter ? 'link' : 'button'} footer action${linkVariant ? ' with link styling' : ''} at 200px (${direction}) @aat`, async ({
      page,
    }) => {
      const {dialog} = await openDialog(page, {
        actionIcon,
        direction,
        hostCase: true,
        linkFooter,
        linkVariant,
        size,
        textSpacing: true,
        viewportWidth: 200,
        wrappedAction,
      })
      const action = dialog.getByRole(linkFooter ? 'link' : 'button', {name: 'Save changes'})
      await action.focus()
      await expectFocusedControlReachable(action, '[role="dialog"]')
      await expectActionLabelFits(action)
      await expectWithinViewport(dialog)
    })
  }

  test(`wraps a long LinkButton label at 200px (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      actions: 'long',
      direction,
      linkFooter: true,
      viewportWidth: 200,
    })
    const action = dialog.getByRole('link', {name: 'Repositoryzugriffsberechtigung'})
    await action.focus()
    await expectFocusedControlReachable(action, '[role="dialog"]')
    await expectActionLabelFits(action)
    await expectWithinViewport(dialog)
  })

  test(`makes an overflowing title keyboard-scrollable at 200px (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {direction, title: 'long', viewportWidth: 200})
    const header = dialog.locator('[data-component="Dialog.Header"]')
    expect(await header.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0)
    await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(header).toBeFocused()
    const focusStyle = await header.evaluate(element => {
      const style = getComputedStyle(element)
      return {style: style.outlineStyle, width: parseFloat(style.outlineWidth)}
    })
    expect(focusStyle.style).not.toBe('none')
    expect(focusStyle.width).toBeGreaterThan(0)
    await page.keyboard.press('End')
    await expect
      .poll(() => header.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop))
      .toBeLessThanOrEqual(1)
    const lastCharacter = await header.evaluate(element => {
      const heading = element.querySelector('[data-component="Dialog.Title"]')
      const text = heading?.firstChild
      if (!(text instanceof Text)) throw new Error('Expected the dialog title text')
      const range = document.createRange()
      range.setStart(text, text.length - 1)
      range.setEnd(text, text.length)
      const character = range.getBoundingClientRect()
      const container = element.getBoundingClientRect()
      return {
        top: character.top,
        bottom: character.bottom,
        containerTop: container.top,
        containerBottom: container.bottom,
      }
    })
    expect(lastCharacter.top).toBeGreaterThanOrEqual(lastCharacter.containerTop - 1)
    expect(lastCharacter.bottom).toBeLessThanOrEqual(lastCharacter.containerBottom + 1)
    await page.keyboard.press('Tab')
    await expectFocusedControlReachable(dialog.getByRole('button', {name: 'Close'}), '[data-component="Dialog.Header"]')
  })

  test(`makes an overflowing title reachable without a close button at 200px (${direction}) @aat`, async ({page}) => {
    const {dialog, trigger} = await openDialog(page, {
      direction,
      noClose: true,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    expect(await header.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0)
    const cancel = dialog.getByRole('button', {name: 'Cancel'})
    await cancel.focus()
    for (let count = 0; count < 4 && !(await header.evaluate(element => element === document.activeElement)); count++) {
      await page.keyboard.press('Shift+Tab')
    }
    await expect(header).toBeFocused()
    await page.keyboard.press('End')
    await expect
      .poll(() => header.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop))
      .toBeLessThanOrEqual(1)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test(`updates header keyboard access when the viewport changes (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      direction,
      height: 768,
      textSpacing: true,
      title: 'long',
      viewportWidth: 1024,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    const close = dialog.getByRole('button', {name: 'Close'})
    await expect(header).not.toHaveAttribute('tabindex')
    await expect(close).toBeFocused()

    await page.setViewportSize({width: 200, height: 256})
    await expect(header).toHaveAttribute('tabindex', '0')
    await expect(close).toBeFocused()
    await page.keyboard.press('End')
    await expect
      .poll(() => header.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop))
      .toBeLessThanOrEqual(1)
    await page.keyboard.press('Shift+Tab')
    await expect(header).toBeFocused()

    await page.setViewportSize({width: 1024, height: 768})
    await expect(header).toHaveAttribute('tabindex', '0')
    await expect(header).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(close).toBeFocused()
    await expect(header).not.toHaveAttribute('tabindex')
  })

  test(`retains body focus when resizing removes overflow (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      direction,
      hostCase: true,
      textSpacing: true,
      viewportWidth: 200,
    })
    const body = dialog.locator('[data-component="Dialog.Body"]')
    await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(body).toBeFocused()
    expect(await body.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0)

    await page.setViewportSize({width: 1024, height: 1600})
    await expect
      .poll(() => body.evaluate(element => element.scrollHeight - element.clientHeight))
      .toBeLessThanOrEqual(1)
    await expect(body).toHaveAttribute('tabindex', '0')
    await expect(body).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(dialog.getByRole('button', {name: 'Cancel'})).toBeFocused()
    await expect(body).not.toHaveAttribute('tabindex')
  })

  test(`retains header focus inside a shadow root after resize (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      direction,
      shadow: true,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    const close = dialog.getByRole('button', {name: 'Close'})
    await expect(close).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(header).toBeFocused()

    await page.setViewportSize({width: 1024, height: 768})
    await expect
      .poll(() => header.evaluate(element => element.scrollHeight - element.clientHeight))
      .toBeLessThanOrEqual(1)
    await expect(header).toHaveAttribute('tabindex', '0')
    await expect(header).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(close).toBeFocused()
    await expect(header).not.toHaveAttribute('tabindex')
  })

  test(`retains body focus inside a shadow root after resize (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      direction,
      hostCase: true,
      shadow: true,
      textSpacing: true,
      viewportWidth: 200,
    })
    const body = dialog.locator('[data-component="Dialog.Body"]')
    await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(body).toBeFocused()

    await page.setViewportSize({width: 1024, height: 1600})
    await expect
      .poll(() => body.evaluate(element => element.scrollHeight - element.clientHeight))
      .toBeLessThanOrEqual(1)
    await expect(body).toHaveAttribute('tabindex', '0')
    await expect(body).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(dialog.getByRole('button', {name: 'Cancel'})).toBeFocused()
    await expect(body).not.toHaveAttribute('tabindex')
  })

  test(`honors explicit initial focus when the header overflows (${direction}) @aat`, async ({page}) => {
    const {dialog, trigger} = await openDialog(page, {
      closeInitialFocus: true,
      direction,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    const close = dialog.getByRole('button', {name: 'Close'})
    await expect(header).toHaveAttribute('tabindex', '0')
    await expect(close).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(header).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test(`allows explicit initial focus on an overflowing header (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      direction,
      headerInitialFocus: true,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    await expect(header).toBeFocused()
    await expect(header).toHaveAttribute('tabindex', '0')
    await page.keyboard.press('End')
    await expect
      .poll(() => header.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop))
      .toBeLessThanOrEqual(1)
  })

  test(`preserves explicit header tabIndex (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      direction,
      headerTabIndex: -1,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused()
    await expect(header).toHaveAttribute('tabindex', '-1')
    await page.keyboard.press('Shift+Tab')
    await expect(header).not.toBeFocused()
  })

  test(`honors an explicitly tabbable header (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      direction,
      headerTabIndex: 0,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    await expect(header).toBeFocused()
    await expect(header).toHaveAttribute('tabindex', '0')
  })

  for (const modality of ['non-modal', 'trap-focus'] as const) {
    test(`preserves ${modality} initial focus with an overflowing header (${direction}) @aat`, async ({page}) => {
      const {dialog} = await openDialog(page, {
        direction,
        modality,
        textSpacing: true,
        title: 'long',
        viewportWidth: 200,
      })
      const header = dialog.locator('[data-component="Dialog.Header"]')
      await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(header).toBeFocused()
      await page.keyboard.press('End')
      await expect
        .poll(() => header.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop))
        .toBeLessThanOrEqual(1)
    })
  }

  test(`preserves initial focus when an overflowing header is kept mounted (${direction}) @aat`, async ({page}) => {
    const {dialog, trigger} = await openDialog(page, {
      direction,
      keepMounted: true,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    const close = dialog.getByRole('button', {name: 'Close'})
    for (let cycle = 0; cycle < 3; cycle++) {
      await expect(close).toBeFocused()
      await expect(header).toHaveAttribute('tabindex', '0')
      await page.keyboard.press('Shift+Tab')
      await expect(header).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
      await expect(trigger).toBeFocused()
      if (cycle < 2) {
        await page.keyboard.press('Enter')
        await expect(dialog).toBeVisible()
      }
    }
  })

  test(`retains header keyboard access after rapid controlled reopening (${direction}) @aat`, async ({page}) => {
    const {dialog, trigger} = await openDialog(page, {
      direction,
      keepMounted: true,
      modality: 'non-modal',
      noInitialFocus: true,
      rapidReopen: true,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    await dialog.getByRole('button', {name: 'Close'}).focus()
    await expect(header).toHaveAttribute('tabindex', '0')
    const closeTransitions = await dialog.evaluate(async popup => {
      const records: MutationRecord[] = []
      const observer = new MutationObserver(changes => records.push(...changes))
      observer.observe(popup, {attributes: true, attributeFilter: ['data-open'], attributeOldValue: true})
      const reopen = document.querySelector<HTMLElement>('[data-testid="rapid-reopen"]')
      if (!reopen) throw new Error('Expected the rapid reopen control')
      reopen.click()
      await Promise.resolve()
      observer.disconnect()
      return records.filter(record => record.oldValue !== null).length
    })
    expect(closeTransitions).toBeGreaterThan(0)
    await expect(trigger).toBeFocused()
    await expect(header).toHaveAttribute('tabindex', '0')
    await page.keyboard.press('Tab')
    await expect(header).toBeFocused()
  })

  test(`preserves initial focus in a default-open dialog (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      defaultOpen: true,
      direction,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(header).toBeFocused()
  })

  test(`reaches a title-only header when initial focus is disabled (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {
      direction,
      noActions: true,
      noClose: true,
      noInitialFocus: true,
      textSpacing: true,
      title: 'long',
      viewportWidth: 200,
    })
    const header = dialog.locator('[data-component="Dialog.Header"]')
    const body = dialog.locator('[data-component="Dialog.Body"]')
    await expect(page.locator('button').filter({hasText: 'Open dialog'})).toBeFocused()
    await expect(header).toHaveAttribute('tabindex', '-1')
    await page.keyboard.press('Tab')
    await expect(body).toBeFocused()
    await expect(header).toHaveAttribute('tabindex', '0')
    await page.keyboard.press('Shift+Tab')
    await expect(header).toBeFocused()
    await expect(header).toHaveAttribute('tabindex', '0')
    await page.keyboard.press('End')
    await expect
      .poll(() => header.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop))
      .toBeLessThanOrEqual(1)
  })

  for (const viewportWidth of [200, 320]) {
    test(`fits a confirmation dialog with a long action in ${viewportWidth}px (${direction}) @aat`, async ({page}) => {
      const {dialog} = await openDialog(page, {actions: 'long', direction, kind: 'confirmation', viewportWidth})
      await expectWithinViewport(dialog)
      const action = dialog.getByRole('button', {name: 'Repositoryzugriffsberechtigung'})
      await expect(action).toBeFocused()
      const metrics = await action.evaluate(element => {
        const dialog = element.closest('[role="alertdialog"]')
        const label = element.querySelector('[data-component="text"]')
        if (!dialog || !label) throw new Error('Expected the action and label inside the confirmation dialog')
        const actionBounds = element.getBoundingClientRect()
        const dialogBounds = dialog.getBoundingClientRect()
        const range = document.createRange()
        range.selectNodeContents(label)
        const labelBounds = Array.from(range.getClientRects(), rect => ({
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        }))
        return {
          left: actionBounds.left,
          right: actionBounds.right,
          dialogLeft: dialogBounds.left,
          dialogRight: dialogBounds.right,
          dialogTop: dialogBounds.top,
          dialogBottom: dialogBounds.bottom,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          labelBounds,
        }
      })
      expect(metrics.left).toBeGreaterThanOrEqual(metrics.dialogLeft - 1)
      expect(metrics.right).toBeLessThanOrEqual(metrics.dialogRight + 1)
      expect(metrics.scrollWidth - metrics.clientWidth).toBeLessThanOrEqual(1)
      expect(metrics.labelBounds.length).toBeGreaterThan(0)
      for (const bounds of metrics.labelBounds) {
        expect(bounds.top).toBeGreaterThanOrEqual(metrics.dialogTop - 1)
        expect(bounds.bottom).toBeLessThanOrEqual(metrics.dialogBottom + 1)
        expect(bounds.left).toBeGreaterThanOrEqual(metrics.dialogLeft - 1)
        expect(bounds.right).toBeLessThanOrEqual(metrics.dialogRight + 1)
      }
    })

    test(`fits the default dialog with increased text spacing in ${viewportWidth}px (${direction}) @aat`, async ({
      page,
    }) => {
      const {dialog} = await openDialog(page, {direction, textSpacing: true, viewportWidth})
      await expectWithinViewport(dialog)
      for (const name of ['Close', 'Cancel', 'Confirm']) {
        const button = dialog.getByRole('button', {name})
        const metrics = await button.evaluate(element => {
          const dialog = element.closest('[role="dialog"]')
          if (!dialog) throw new Error('Expected the action inside the dialog')
          const bounds = element.getBoundingClientRect()
          const container = dialog.getBoundingClientRect()
          return {
            left: bounds.left,
            right: bounds.right,
            containerLeft: container.left,
            containerRight: container.right,
          }
        })
        expect(metrics.left).toBeGreaterThanOrEqual(metrics.containerLeft - 1)
        expect(metrics.right).toBeLessThanOrEqual(metrics.containerRight + 1)
      }
    })
  }

  test(`makes a tall confirmation title readable by keyboard at 200px (${direction}) @aat`, async ({page}) => {
    const {dialog, trigger} = await openDialog(page, {
      actions: 'long',
      direction,
      kind: 'confirmation',
      title: 'long',
      viewportWidth: 200,
    })
    await expect(dialog.getByRole('button', {name: 'Repositoryzugriffsberechtigung'})).toBeFocused()
    const initialScrollTop = await dialog.evaluate(element => element.scrollTop)
    expect(initialScrollTop).toBeGreaterThan(0)
    await page.keyboard.press('Home')
    await expect.poll(() => dialog.evaluate(element => element.scrollTop)).toBe(0)
    const metrics = await dialog.getByRole('heading').evaluate(element => {
      const dialog = element.closest('[role="alertdialog"]')
      if (!dialog) throw new Error('Expected the title inside the confirmation dialog')
      const bounds = dialog.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(element)
      const titleBounds = Array.from(range.getClientRects(), rect => ({
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
      }))
      return {top: bounds.top, bottom: bounds.bottom, left: bounds.left, right: bounds.right, titleBounds}
    })
    expect(metrics.titleBounds.length).toBeGreaterThan(0)
    for (const bounds of metrics.titleBounds) {
      expect(bounds.top).toBeGreaterThanOrEqual(metrics.top - 1)
      expect(bounds.bottom).toBeLessThanOrEqual(metrics.bottom + 1)
      expect(bounds.left).toBeGreaterThanOrEqual(metrics.left - 1)
      expect(bounds.right).toBeLessThanOrEqual(metrics.right + 1)
    }
    await page.keyboard.press('End')
    await expect.poll(() => dialog.evaluate(element => element.scrollTop)).toBeGreaterThanOrEqual(initialScrollTop)
    await expect(dialog.getByRole('button', {name: 'Repositoryzugriffsberechtigung'})).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test(`allows a consumer min-width override at 200px (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {direction, override: 'min', viewportWidth: 200})
    await expectWithinViewport(dialog)
  })

  test(`allows a consumer overflow override (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {direction, override: 'overflow', viewportWidth: 320})
    const overflow = await dialog.evaluate(element => {
      const style = getComputedStyle(element)
      return {x: style.overflowX, y: style.overflowY}
    })
    expect(overflow).toEqual({x: 'hidden', y: 'hidden'})
  })

  test(`allows a consumer body minimum override (${direction}) @aat`, async ({page}) => {
    const {dialog} = await openDialog(page, {direction, override: 'body-min', viewportWidth: 320})
    const body = dialog.locator('[data-component="Dialog.Body"]')
    await expect(body).toHaveCSS('min-height', '0px')
  })

  test(`keeps a confirmation dialog within 200px (${direction}) @aat`, async ({page}) => {
    const {dialog, trigger} = await openDialog(page, {direction, kind: 'confirmation', viewportWidth: 200})
    await expectWithinViewport(dialog)
    await expect(dialog.getByRole('button', {name: 'Confirm'})).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })
}

test('preserves popup initial focus after touch opening @aat', async ({browser}) => {
  const context = await browser.newContext({hasTouch: true})
  try {
    const page = await context.newPage()
    const {dialog} = await openDialog(page, {
      textSpacing: true,
      title: 'long',
      touchOpen: true,
      viewportWidth: 200,
    })
    await expect(dialog).toBeFocused()
    const header = dialog.locator('[data-component="Dialog.Header"]')
    await expect(header).toHaveAttribute('tabindex', '0')
  } finally {
    await context.close()
  }
})

test('preserves intrinsic auto width, consumer height, and controls outside the footer @aat', async ({page}) => {
  const {dialog} = await openDialog(page, {
    actions: 'long',
    bodyControl: true,
    customHeight: true,
    height: 768,
    iconControls: true,
    portalControl: true,
    viewportWidth: 1024,
    width: 'auto',
  })
  expect((await dialog.boundingBox())?.width).toBeGreaterThan(296)
  const action = dialog.getByRole('button', {name: 'Repositoryzugriffsberechtigung'})
  await expect(action).toHaveCSS('height', '40px')
  await expect(action.locator('[data-component="text"]')).toHaveCSS('white-space', 'normal')
  for (const control of [dialog.getByRole('button', {name: 'Body control'}), page.getByTestId('portaled-button')]) {
    await expect(control).toHaveCSS('height', '32px')
    await expect(control.locator('[data-component="text"]')).toHaveCSS('white-space', 'nowrap')
  }
  for (const control of [dialog.getByRole('button', {name: 'Add'}), dialog.getByRole('link', {name: 'Add link'})]) {
    await expect(control).toHaveCSS('height', '32px')
    await expect(control).toHaveCSS('width', '32px')
  }
})

test('honors an explicit footer labelWrap=false @aat', async ({page}) => {
  const {dialog} = await openDialog(page, {actions: 'long', height: 768, nowrapFooter: true, viewportWidth: 1024})
  const action = dialog.getByRole('button', {name: 'Repositoryzugriffsberechtigung'})
  await expect(action.locator('[data-component="text"]')).toHaveCSS('white-space', 'nowrap')
  await expect(action).toHaveCSS('height', '32px')
})
