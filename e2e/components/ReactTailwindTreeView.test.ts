import {expect, test, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

async function expectEquivalentPixels(page: Page, first: Buffer, second: Buffer) {
  const difference = await page.evaluate(
    async ({firstImage, secondImage}) => {
      async function pixels(base64: string) {
        const image = new Image()
        image.src = `data:image/png;base64,${base64}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Unable to compare rendered pixels')
        context.drawImage(image, 0, 0)
        return {
          width: image.width,
          height: image.height,
          data: context.getImageData(0, 0, image.width, image.height).data,
        }
      }

      const a = await pixels(firstImage)
      const b = await pixels(secondImage)
      if (a.width !== b.width || a.height !== b.height) {
        return {sameSize: false, differingPixels: 0, maxDifference: 0, pixelCount: 0}
      }
      let differingPixels = 0
      let maxDifference = 0
      for (let index = 0; index < a.data.length; index += 4) {
        let pixelDifference = 0
        for (let channel = 0; channel < 4; channel++) {
          pixelDifference = Math.max(pixelDifference, Math.abs(a.data[index + channel] - b.data[index + channel]))
        }
        if (pixelDifference > 0) differingPixels++
        maxDifference = Math.max(maxDifference, pixelDifference)
      }
      return {sameSize: true, differingPixels, maxDifference, pixelCount: a.width * a.height}
    },
    {firstImage: first.toString('base64'), secondImage: second.toString('base64')},
  )
  expect(difference.sameSize).toBe(true)
  expect(difference.maxDifference).toBeLessThanOrEqual(1)
  expect(difference.differingPixels).toBeLessThanOrEqual(difference.pixelCount * 0.0025)
}

test.describe('React Tailwind TreeView', () => {
  test('guide and row styling hooks preserve default indentation', async ({page}) => {
    await visit(page, {id: 'react-tailwind-navigation-treeview--playground'})
    const tree = page.getByRole('tree', {name: 'Files'})
    const parent = tree.getByRole('treeitem', {name: 'src', exact: true})
    const child = tree.getByRole('treeitem', {name: 'index.ts', exact: true})
    await expect(tree.locator('[data-component="TreeView.LevelGuide"]')).toHaveCount(2)
    const parentContent = await parent.locator('[data-component="TreeView.ItemContent"]').first().boundingBox()
    const childContent = await child.locator('[data-component="TreeView.ItemContent"]').boundingBox()
    expect(parentContent).not.toBeNull()
    expect(childContent).not.toBeNull()
    expect(childContent!.x - parentContent!.x).toBeCloseTo(8)
  })

  test('hidden guides retain custom indentation and nested keyboard navigation @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-navigation-treeview-features--without-guides'})
    const tree = page.getByRole('tree', {name: 'Files'})
    const parent = tree.getByRole('treeitem', {name: 'src', exact: true})
    const child = tree.getByRole('treeitem', {name: 'index.ts', exact: true})
    await expect(tree.locator('[data-component="TreeView.LevelGuides"]')).toHaveCount(0)
    await expect(parent.locator('[data-component="TreeView.Toggle"]')).toBeVisible()
    const parentContent = await parent.locator('[data-component="TreeView.ItemContent"]').first().boundingBox()
    const childContent = await child.locator('[data-component="TreeView.ItemContent"]').boundingBox()
    expect(parentContent).not.toBeNull()
    expect(childContent).not.toBeNull()
    expect(childContent!.x - parentContent!.x).toBeCloseTo(24)
    await expect(page).toHaveNoViolations()

    await parent.focus()
    await page.keyboard.press('ArrowRight')
    await expect(child).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(parent).toHaveAttribute('aria-expanded', 'false')
    await parent.locator('[data-component="TreeView.Toggle"]').click()
    await expect(parent).toHaveAttribute('aria-expanded', 'true')
  })

  test('untruncated labels reflow with increased text spacing at 320 pixels', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-navigation-treeview-features--multiline-items'})
    await page.addStyleTag({
      content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important }',
    })

    const label = page.getByText(
      'this is a very long directory name that we have intentionally allowed to wrap over multiple lines to demonstrate alignment',
      {exact: true},
    )
    const dimensions = await label.evaluate(element => {
      const style = getComputedStyle(element)
      const range = document.createRange()
      range.selectNodeContents(element)
      const lines = Array.from(range.getClientRects())
      const bounds = element.getBoundingClientRect()
      return {
        clientWidth: element.clientWidth,
        lineCount: lines.length,
        lineHeight: Number.parseFloat(style.lineHeight),
        fontSize: Number.parseFloat(style.fontSize),
        linesFit: lines.every(line => line.left >= bounds.left - 1 && line.right <= bounds.right + 1),
        scrollWidth: element.scrollWidth,
      }
    })
    expect(dimensions.lineCount).toBeGreaterThan(1)
    expect(dimensions.lineHeight).toBeGreaterThanOrEqual(dimensions.fontSize * 1.5)
    expect(dimensions.linesFit).toBe(true)
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
  })

  test('the label hook identifies clipped text with an explicit accessible name @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-navigation-treeview-features--label-clipping'})
    const tree = page.getByRole('tree', {name: 'Files'})
    const item = tree.getByRole('treeitem', {name: 'Very-long-file-name-with-changes.tsx, modified'})
    const label = item.locator('[data-component="TreeView.Item.Label"]')
    await expect(label).toHaveText('Very-long-file-name-with-changes.tsx')
    await expect(item).not.toHaveAttribute('aria-labelledby')
    const clipped = () =>
      label.evaluate(element => ({
        clientWidth: element.clientWidth,
        overflow: getComputedStyle(element).overflowX,
        scrollWidth: element.scrollWidth,
        textOverflow: getComputedStyle(element).textOverflow,
      }))
    const narrow = await clipped()
    expect(narrow.overflow).toBe('hidden')
    expect(narrow.textOverflow).toBe('ellipsis')
    expect(narrow.scrollWidth).toBeGreaterThan(narrow.clientWidth)
    await expect(page).toHaveNoViolations()

    await tree.evaluate(element => {
      if (element.parentElement) element.parentElement.style.width = '480px'
    })
    await expect
      .poll(async () => {
        const dimensions = await clipped()
        return dimensions.scrollWidth - dimensions.clientWidth
      })
      .toBeLessThanOrEqual(1)
  })

  test('linked trees expose owned items and groups and retain tree navigation @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-navigation-treeview-features--linked-files'})
    const tree = page.getByRole('tree', {name: 'Files'})
    const src = tree.getByRole('treeitem', {name: 'src', exact: true})
    const index = tree.getByRole('treeitem', {name: 'File index.ts, modified'})
    const button = tree.getByRole('treeitem', {name: 'Button.tsx'})
    const docs = tree.getByRole('treeitem', {name: 'docs', exact: true})
    const guide = tree.getByRole('treeitem', {name: 'guide.md'})
    await expect(tree).toHaveJSProperty('tagName', 'DIV')
    await expect(index).toHaveJSProperty('tagName', 'A')
    await expect(index).toHaveAttribute('href', '#index-ts')
    await expect(index).toHaveAttribute('aria-current', 'true')
    await expect(index.locator('[data-component="TreeView.Item.Label"]')).toHaveText('index.ts')
    await expect(tree.locator('li[role="none"], li[role="presentation"]')).toHaveCount(0)
    await expect(page).toHaveNoViolations()

    const session = await page.context().newCDPSession(page)
    const {nodes} = await session.send('Accessibility.getFullAXTree')
    const exposedChildren = (node: (typeof nodes)[number]): typeof nodes =>
      (node.childIds ?? []).flatMap(id => {
        const child = nodes.find(candidate => candidate.nodeId === id)
        return child ? (child.ignored ? exposedChildren(child) : [child]) : []
      })
    const treeNode = nodes.find(node => node.role?.value === 'tree' && node.name?.value === 'Files')
    expect(treeNode).toBeDefined()
    const treeChildren = exposedChildren(treeNode!)
    const srcNode = treeChildren.find(node => node.role?.value === 'treeitem' && node.name?.value === 'src')
    const docsNode = treeChildren.find(node => node.role?.value === 'treeitem' && node.name?.value === 'docs')
    expect(srcNode).toBeDefined()
    expect(docsNode).toBeDefined()
    const srcGroup = exposedChildren(srcNode!).find(node => node.role?.value === 'group')
    const docsGroup = exposedChildren(docsNode!).find(node => node.role?.value === 'group')
    expect(srcGroup).toBeDefined()
    expect(docsGroup).toBeDefined()
    expect(
      exposedChildren(srcGroup!)
        .filter(node => node.role?.value === 'treeitem')
        .map(node => node.name?.value),
    ).toEqual(['File index.ts, modified', 'Button.tsx'])
    expect(
      exposedChildren(docsGroup!)
        .filter(node => node.role?.value === 'treeitem')
        .map(node => node.name?.value),
    ).toEqual(['guide.md'])
    await session.detach()

    await src.focus()
    await page.keyboard.press('ArrowRight')
    await expect(index).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(button).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(docs).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(guide).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await expect(docs).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await expect(docs).toHaveAttribute('aria-expanded', 'false')
    const url = page.url()
    await docs.locator('[data-component="TreeView.Toggle"]').click()
    await expect(docs).toHaveAttribute('aria-expanded', 'true')
    expect(page.url()).toBe(url)
  })

  test('native linked tree items retain browser navigation gestures', async ({page, context}) => {
    await visit(page, {id: 'react-tailwind-navigation-treeview-features--linked-files'})
    const link = page.getByRole('treeitem', {name: 'Button.tsx'})
    await link.focus()
    await page.keyboard.press('Enter')
    await expect.poll(() => new URL(page.url()).hash).toBe('#button-ts')
    await page.evaluate(() => {
      history.replaceState(null, '', location.pathname + location.search)
    })

    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control'
    const [modifiedPage] = await Promise.all([context.waitForEvent('page'), link.click({modifiers: [modifier]})])
    await modifiedPage.waitForLoadState()
    await expect.poll(() => new URL(modifiedPage.url()).hash).toBe('#button-ts')
    await modifiedPage.close()
    expect(new URL(page.url()).hash).toBe('')

    const [middlePage] = await Promise.all([context.waitForEvent('page'), link.click({button: 'middle'})])
    await middlePage.waitForLoadState()
    await expect.poll(() => new URL(middlePage.url()).hash).toBe('#button-ts')
    await middlePage.close()
    expect(new URL(page.url()).hash).toBe('')

    const contextMenu = page.evaluate(() => {
      return new Promise<{defaultPrevented: boolean; href: string}>(resolve => {
        document.addEventListener(
          'contextmenu',
          event => {
            const anchor = (event.target as Element).closest('a')
            resolve({defaultPrevented: event.defaultPrevented, href: anchor?.getAttribute('href') ?? ''})
          },
          {once: true},
        )
      })
    })
    await link.click({button: 'right'})
    expect(await contextMenu).toEqual({defaultPrevented: false, href: '#button-ts'})
  })

  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`linked rows match ordinary tree rows in ${theme}`, async ({page}) => {
      await visit(page, {
        id: 'react-tailwind-navigation-treeview-features--link-tree-visual-parity',
        globals: {colorScheme: theme},
      })
      const standard = page.getByRole('tree', {name: 'Standard files'})
      const linked = page.getByRole('tree', {name: 'Linked files'})
      const standardItem = standard.getByRole('treeitem', {name: 'index.ts'})
      const linkedItem = linked.getByRole('treeitem', {name: 'index.ts'})
      const standardRow = standardItem.locator('[data-component="TreeView.Row"]')
      const linkedRow = linkedItem.locator('[data-component="TreeView.Row"]')
      await expectEquivalentPixels(page, await standard.screenshot(), await linked.screenshot())

      await standardItem.hover()
      const standardHover = await standardRow.screenshot()
      await linkedItem.hover()
      await expectEquivalentPixels(page, standardHover, await linkedRow.screenshot())
      await page.mouse.move(0, 0)
      await page.keyboard.press('Tab')
      await standardItem.focus()
      expect(await standardItem.evaluate(element => element.matches(':focus-visible'))).toBe(true)
      const standardFocus = await standardRow.screenshot()
      await linkedItem.focus()
      expect(await linkedItem.evaluate(element => element.matches(':focus-visible'))).toBe(true)
      await expectEquivalentPixels(page, standardFocus, await linkedRow.screenshot())
    })
  }
})
