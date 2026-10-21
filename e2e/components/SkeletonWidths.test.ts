import {test, expect, type Locator} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {skeletonWidths} from '../test-helpers/skeletonWidths'

const stories = [
  {
    name: 'FilteredActionList',
    id: 'components-filteredactionlist-features--loading-with-body-skeleton',
    text: '[data-component="SkeletonBox"]:last-child',
  },
  {
    name: 'TreeView',
    id: 'components-treeview-features--async-with-count',
    text: '[data-component="SkeletonText"]',
  },
  {
    name: 'DataTable',
    id: 'experimental-components-datatable-features--with-loading',
    text: '[data-component="SkeletonText"]',
  },
] as const

async function getWidths(rows: Locator, textSelector: string) {
  return rows.evaluateAll(
    (elements, selector) =>
      elements.map(row => {
        const style = getComputedStyle(row)
        const contentWidth =
          parseFloat(style.width) -
          (style.boxSizing === 'border-box'
            ? parseFloat(style.paddingLeft) +
              parseFloat(style.paddingRight) +
              parseFloat(style.borderLeftWidth) +
              parseFloat(style.borderRightWidth)
            : 0)
        const text = row.querySelector(selector)!
        return (parseFloat(getComputedStyle(text).width) / contentWidth) * 100
      }),
    textSelector,
  )
}

for (const randomSupported of [false, true]) {
  test.describe(randomSupported ? 'Random skeleton widths' : 'Fallback skeleton widths', () => {
    // WebKit implements random() natively; Chromium exercises the unsupported path.
    test.use({
      page: async ({playwright, contextOptions, viewport}, providePage) => {
        const browser = await (randomSupported ? playwright.webkit : playwright.chromium).launch()
        const page = await browser.newPage({...contextOptions, viewport})
        await providePage(page)
        await browser.close()
      },
    })

    for (const [index, story] of stories.entries()) {
      const {selector, property, widths} = skeletonWidths[index]

      test(`${story.name} preserves width ranges, stability, and overrides`, async ({page}) => {
        await visit(page, {
          id: story.id,
          args: {count: '10', responseTime: '60000'},
          randomSkeletonWidths: true,
        })
        expect(await page.evaluate(() => CSS.supports('width', 'random(40%, 80%)'))).toBe(randomSupported)

        if (story.name === 'TreeView') {
          await page.getByRole('treeitem', {name: 'Directory with async items'}).click()
        }

        const rows = page.locator(selector)
        await expect(rows.first()).toBeVisible()
        const initial = await getWidths(rows, story.text)
        expect(initial.length).toBeGreaterThanOrEqual(10)

        if (randomSupported) {
          for (const width of initial) {
            expect(width).toBeGreaterThanOrEqual(Math.min(...widths) - 0.05)
            expect(width).toBeLessThanOrEqual(Math.max(...widths) + 0.05)
          }
          expect(new Set(initial.slice(0, 10)).size).toBeGreaterThan(5)
        } else {
          for (const [rowIndex, width] of initial.entries()) {
            expect(width).toBeCloseTo(widths[rowIndex % widths.length], 1)
          }
        }

        await rows.first().hover()
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        expect(await getWidths(rows, story.text)).toEqual(initial)

        await page.setViewportSize({width: 800, height: 768})
        const resized = await getWidths(rows, story.text)
        for (const [rowIndex, width] of resized.entries()) {
          expect(width).toBeCloseTo(initial[rowIndex], 1)
        }

        await rows.first().evaluate((row, name) => (row as HTMLElement).style.setProperty(name, '33%'), property)
        expect((await getWidths(rows, story.text))[0]).toBeCloseTo(33, 1)
        await rows
          .first()
          .locator(story.text)
          .evaluate(text => ((text as HTMLElement).style.width = '25%'))
        expect((await getWidths(rows, story.text))[0]).toBeCloseTo(25, 1)
      })

      test(`${story.name} uses deterministic widths for screenshots`, async ({page}) => {
        await visit(page, {id: story.id, args: {count: '10', responseTime: '60000'}})
        if (story.name === 'TreeView') {
          await page.getByRole('treeitem', {name: 'Directory with async items'}).click()
        }
        const rows = page.locator(selector)
        await expect(rows.first()).toBeVisible()
        const actual = await getWidths(rows, story.text)
        expect(actual.length).toBeGreaterThanOrEqual(10)
        for (const [rowIndex, width] of actual.entries()) {
          expect(width).toBeCloseTo(widths[rowIndex % widths.length], 1)
        }
      })
    }
  })
}
