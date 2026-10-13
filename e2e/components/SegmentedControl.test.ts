import {test, expect, type Locator} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'
import {expectVisibleFocus} from '../test-helpers/segmentedControl'

const stories = [
  {
    title: 'Default',
    id: 'components-segmentedcontrol--default',
  },
  {
    title: 'Playground',
    id: 'components-segmentedcontrol--playground',
  },
  {
    title: 'Associated with a Label and Caption',
    id: 'components-segmentedcontrol-features--associated-with-a-label-and-caption',
  },
  {
    title: 'Fullwidth Narrow',
    id: 'components-segmentedcontrol-features--fullwidth-narrow',
  },
  {
    title: 'Fullwidth Regular',
    id: 'components-segmentedcontrol-features--fullwidth-regular',
  },
  {
    title: 'Variant Narrow Action Menu',
    id: 'components-segmentedcontrol-features--variant-narrow-action-menu',
  },
  {
    title: 'Variant Narrow Action Menu With Action',
    id: 'components-segmentedcontrol-features--variant-narrow-action-menu-with-action',
  },
  {
    title: 'Variant Narrow Hide Labels',
    id: 'components-segmentedcontrol-features--variant-narrow-hide-labels',
  },
  {
    title: 'Variant Subtle',
    id: 'components-segmentedcontrol-features--variant-subtle',
  },
  {
    title: 'Controlled',
    id: 'components-segmentedcontrol-features--controlled',
  },
  {
    title: 'Fullwidth',
    id: 'components-segmentedcontrol-features--fullwidth-all',
  },
  {
    title: 'Icon Only',
    id: 'components-segmentedcontrol-features--icon-only',
  },
  {
    title: 'With Icons',
    id: 'components-segmentedcontrol-features--with-icons',
  },
  {
    title: 'With Counter Labels',
    id: 'components-segmentedcontrol-features--with-counter-labels',
  },
  {
    title: 'SegmentedControlButton Playground',
    id: 'components-segmentedcontrol-segmentedcontrol-button--playground',
  },
  {
    title: 'SegmentedControlIconButton Playground',
    id: 'components-segmentedcontrol-segmentedcontrol-iconbutton--playground',
  },
  {
    title: 'Dev: With Css',
    id: 'components-segmentedcontrol-dev--with-css',
  },
  {
    title: 'With Disabled Buttons',
    id: 'components-segmentedcontrol-examples--with-disabled-buttons',
  },
  {
    title: 'Compact Toolbar',
    id: 'components-segmentedcontrol-features--compact-toolbar',
  },
  {
    title: 'Multiline Labels',
    id: 'components-segmentedcontrol-features--multiline-labels',
  },
] as const

async function expectGeometry(
  control: Locator,
  minimumHeight: number,
  {horizontalContainment = true}: {horizontalContainment?: boolean} = {},
) {
  await control.scrollIntoViewIfNeeded()
  const geometry = await control.evaluate((root, horizontalContainment) => {
    const rect = root.getBoundingClientRect()
    const subtle = root.getAttribute('data-variant') === 'subtle'
    // Subtle items retain their existing one-pixel outset around the borderless root.
    const rootBounds = subtle ? new DOMRect(rect.left - 1, rect.top - 1, rect.width + 2, rect.height + 2) : rect
    const contains = (outer: DOMRect, inner: DOMRect) =>
      (!horizontalContainment || (inner.left >= outer.left - 0.5 && inner.right <= outer.right + 0.5)) &&
      inner.top >= outer.top - 0.5 &&
      inner.bottom <= outer.bottom + 0.5
    const visibleThroughAncestors = (element: Element, bounds: DOMRect) => {
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent)
        const box = parent.getBoundingClientRect()
        const left = box.left + parent.clientLeft
        const top = box.top + parent.clientTop
        if (
          (style.overflowX !== 'visible' &&
            (bounds.left < left - 0.5 || bounds.right > left + parent.clientWidth + 0.5)) ||
          (style.overflowY !== 'visible' && (bounds.top < top - 0.5 || bounds.bottom > top + parent.clientHeight + 0.5))
        ) {
          return false
        }
      }
      return true
    }
    const buttons = Array.from(root.querySelectorAll('button'))
    const boxes = buttons.map(button => button.getBoundingClientRect())
    const knob = getComputedStyle(root, '::before')
    const rootStyle = getComputedStyle(root)
    const paintsKnob = knob.content !== 'none' && knob.content !== 'normal' && knob.display !== 'none'
    const knobRect = paintsKnob
      ? new DOMRect(
          rect.left + Number.parseFloat(rootStyle.borderLeftWidth) + Number.parseFloat(knob.left),
          rect.top + Number.parseFloat(rootStyle.borderTopWidth) + Number.parseFloat(knob.top),
          Number.parseFloat(knob.width) +
            (knob.boxSizing === 'border-box'
              ? 0
              : Number.parseFloat(knob.borderLeftWidth) +
                Number.parseFloat(knob.borderRightWidth) +
                Number.parseFloat(knob.paddingLeft) +
                Number.parseFloat(knob.paddingRight)),
          Number.parseFloat(knob.height) +
            (knob.boxSizing === 'border-box'
              ? 0
              : Number.parseFloat(knob.borderTopWidth) +
                Number.parseFloat(knob.borderBottomWidth) +
                Number.parseFloat(knob.paddingTop) +
                Number.parseFloat(knob.paddingBottom)),
        )
      : null
    return {
      name: root.getAttribute('aria-label'),
      bounds: rect.toJSON(),
      height: rect.height,
      border: Number.parseFloat(getComputedStyle(root).borderTopWidth),
      overlaps: boxes.some((box, index) =>
        boxes
          .slice(index + 1)
          .some(
            other =>
              Math.min(box.right, other.right) - Math.max(box.left, other.left) > 0.5 &&
              Math.min(box.bottom, other.bottom) - Math.max(box.top, other.top) > 0.5,
          ),
      ),
      segments: buttons.map(button => {
        const buttonRect = button.getBoundingClientRect()
        const content = button.querySelector('.segmentedControl-content')!
        const contentRect = content.getBoundingClientRect()
        const descendants = Array.from(
          content.querySelectorAll('.segmentedControl-text, svg, [data-component="CounterLabel"]'),
        )
        const textRanges = Array.from(
          content.querySelectorAll('.segmentedControl-text, [data-component="CounterLabel"]'),
        ).flatMap(element => {
          const range = document.createRange()
          range.selectNodeContents(
            element.matches('.segmentedControl-text') ? (element.firstElementChild ?? element) : element,
          )
          return Array.from(range.getClientRects()).map(bounds => ({
            text: element.textContent,
            bounds: bounds.toJSON(),
            contained: contains(buttonRect, bounds) && contains(rootBounds, bounds),
            visible: visibleThroughAncestors(element, bounds),
          }))
        })
        const targets = [
          [buttonRect.left + 2, buttonRect.top + buttonRect.height / 2],
          [buttonRect.right - 2, buttonRect.top + buttonRect.height / 2],
          [buttonRect.left + buttonRect.width / 2, buttonRect.top + 2],
          [buttonRect.left + buttonRect.width / 2, buttonRect.bottom - 2],
        ]
        return {
          height: buttonRect.height,
          withinRoot: contains(rootBounds, buttonRect),
          selected: button.getAttribute('aria-pressed') === 'true',
          selectedBackgroundMatches:
            knobRect === null || (contains(buttonRect, knobRect) && contains(knobRect, buttonRect)),
          contentWidth: contentRect.width,
          buttonWidth: buttonRect.width,
          textRanges,
          targetsHit: targets.every(([x, y]) => {
            const hit = document.elementFromPoint(x, y)
            return hit === button || (hit !== null && button.contains(hit))
          }),
          contentTop: contentRect.top - buttonRect.top,
          contentBottom: buttonRect.bottom - contentRect.bottom,
          clipped: descendants.some(element => {
            const bounds = element.getBoundingClientRect()
            return (
              bounds.top < buttonRect.top - 0.5 ||
              bounds.bottom > buttonRect.bottom + 0.5 ||
              (horizontalContainment && (bounds.left < buttonRect.left - 0.5 || bounds.right > buttonRect.right + 0.5))
            )
          }),
          overflow:
            button.scrollHeight > button.clientHeight + 1 ||
            (horizontalContainment && button.scrollWidth > button.clientWidth + 1),
        }
      }),
    }
  }, horizontalContainment)
  expect(geometry.height).toBeGreaterThanOrEqual(minimumHeight)
  expect(geometry.overlaps).toBe(false)
  for (const segment of geometry.segments) {
    // The existing item margins compensate for the default variant's borders.
    expect(segment.height).toBeCloseTo(geometry.height + 2 - 2 * geometry.border, 0)
    expect(segment.contentTop).toBeGreaterThanOrEqual(-0.5)
    expect(segment.contentBottom).toBeGreaterThanOrEqual(-0.5)
    expect(segment.clipped).toBe(false)
    expect(segment.overflow).toBe(false)
    expect(segment.withinRoot, `${geometry.name}: segment lies outside supported root bounds`).toBe(true)
    for (const range of segment.textRanges) {
      expect(
        range.contained,
        `${geometry.name}: ${range.text} range ${JSON.stringify(range.bounds)} within supported root ${JSON.stringify(geometry.bounds)}`,
      ).toBe(true)
      expect(range.visible, `${geometry.name}: ${range.text} is not clipped by an ancestor`).toBe(true)
    }
    expect(segment.targetsHit).toBe(true)
    if (segment.selected) {
      expect(segment.selectedBackgroundMatches, `${geometry.name}: selected background fills its segment`).toBe(true)
      expect(segment.contentTop).toBeCloseTo(0, 0)
      expect(segment.contentBottom).toBeCloseTo(0, 0)
      expect(segment.contentWidth).toBeCloseTo(segment.buttonWidth, 0)
    }
  }
  return geometry.height
}

async function getSegmentBounds(control: Locator) {
  return control.evaluate(root => {
    const bounds = root.getBoundingClientRect()
    return Array.from(root.querySelectorAll('button')).map(button => {
      const rect = button.getBoundingClientRect()
      return {left: rect.left - bounds.left, top: rect.top - bounds.top, width: rect.width, height: rect.height}
    })
  })
}

test.describe('SegmentedControl', () => {
  test('single-line sizing across inherited typography @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--content-sizing'})
    for (const size of ['small', 'medium']) {
      const height = size === 'small' ? 28 : 32
      for (const variant of ['default', 'subtle']) {
        for (const typography of ['ordinary', 'consumer', 'absolute']) {
          const control = page.getByRole('list', {name: `${size} ${variant} ${typography}`, exact: true})
          if (typography === 'consumer') {
            await expect(control).toHaveCSS('font-size', '14px')
            await expect(control.getByRole('button').first()).toHaveCSS('line-height', '21px')
          }
          expect(await expectGeometry(control, height)).toBe(height)
          const bounds = await getSegmentBounds(control)
          await control.getByRole('button', {name: 'Blame'}).click()
          expect(await expectGeometry(control, height)).toBe(height)
          expect(await getSegmentBounds(control)).toEqual(bounds)
        }
      }
      const iconsControl = page.getByRole('list', {name: `${size} icons`, exact: true})
      expect(await expectGeometry(iconsControl, height)).toBe(height)
      const iconBounds = await getSegmentBounds(iconsControl)
      await iconsControl.getByRole('button', {name: 'Code'}).click()
      expect(await expectGeometry(iconsControl, height)).toBe(height)
      expect(await getSegmentBounds(iconsControl)).toEqual(iconBounds)
      const contentControl = page.getByRole('list', {name: `${size} icons and counters`, exact: true})
      for (const consumerTypography of [false, true]) {
        if (consumerTypography) {
          await contentControl.evaluate(root => {
            root.style.fontSize = 'var(--text-body-size-medium, 14px)'
            for (const button of root.querySelectorAll('button')) button.style.lineHeight = 'inherit'
          })
          await expect(contentControl).toHaveCSS('font-size', '14px')
          await expect(contentControl.getByRole('button').first()).toHaveCSS('line-height', '21px')
        }
        expect(await expectGeometry(contentControl, height)).toBe(height)
        await expect(contentControl.locator('[data-component="CounterLabel"]')).toHaveCount(2)
        expect(await contentControl.locator('svg').evaluate(element => element.getBoundingClientRect().height)).toBe(16)
        const contentBounds = await getSegmentBounds(contentControl)
        await contentControl.getByRole('button', {name: 'Code'}).click()
        expect(await expectGeometry(contentControl, height)).toBe(height)
        expect(await getSegmentBounds(contentControl)).toEqual(contentBounds)
        await contentControl.getByRole('button').first().click()
        expect(await expectGeometry(contentControl, height)).toBe(height)
        expect(await getSegmentBounds(contentControl)).toEqual(contentBounds)
      }
    }
  })

  test('multiline sizing and selection @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--multiline-labels'})
    // Accommodate both sizes' existing intrinsic icon/counter widths while retaining label wrapping.
    await page
      .getByRole('list')
      .first()
      .evaluate(root => {
        root.parentElement!.style.width = '260px'
      })
    for (const size of ['small', 'medium']) {
      const minimum = size === 'small' ? 28 : 32
      for (const variant of ['default', 'subtle']) {
        const control = page.getByRole('list', {name: `${size} ${variant}`, exact: true})
        const label = control.locator('.segmentedControl-text').first()
        expect(
          await label.evaluate(element => {
            const range = document.createRange()
            range.selectNodeContents(element.firstElementChild ?? element)
            return range.getClientRects().length
          }),
        ).toBeGreaterThan(1)
        const height = await expectGeometry(control, minimum)
        expect(height).toBeGreaterThan(minimum)
        const bounds = await getSegmentBounds(control)
        await control.getByRole('button', {name: 'Code', exact: true}).click()
        expect(await expectGeometry(control, minimum)).toBe(height)
        expect(await getSegmentBounds(control)).toEqual(bounds)
        // Re-enter with the keyboard: pointer/programmatic focus alone does not imply :focus-visible.
        await control.getByRole('button').first().focus()
        await page.keyboard.press('Tab')
        await page.keyboard.press('Shift+Tab')
        await page.keyboard.press('Space')
        await expect(control.getByRole('button').first()).toBeFocused()
        await expect(control.getByRole('button').first()).toHaveAttribute('aria-pressed', 'true')
        await expectVisibleFocus(control.getByRole('button').first())
        expect(await expectGeometry(control, minimum)).toBe(height)
        expect(await getSegmentBounds(control)).toEqual(bounds)
        await control.getByRole('button', {name: 'Blame', exact: true}).click()
        expect(await expectGeometry(control, minimum)).toBe(height)
        expect(await getSegmentBounds(control)).toEqual(bounds)
        await control.getByRole('button').first().click()
        expect(await expectGeometry(control, minimum)).toBe(height)
        expect(await getSegmentBounds(control)).toEqual(bounds)
      }
    }
  })

  test('compact toolbar geometry @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--compact-toolbar'})
    const control = page.getByRole('list', {name: 'File view'})
    expect(await expectGeometry(control, 28)).toBe(28)
    await expect(control).toHaveCSS('font-size', '14px')
    await expect(page.getByRole('button', {name: 'Raw', exact: true})).toHaveCSS('height', '28px')
  })

  // Oversized custom content may retain the existing min-content horizontal overflow.
  // These stress cases cover vertical growth and selection stability, not horizontal reflow.
  test('expanded typography grows with stable vertical geometry @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--multiline-labels'})
    await expect(page.getByRole('list')).toHaveCount(4)
    await page.addStyleTag({
      content:
        '[data-component="SegmentedControl"] { font-size: 24px; line-height: 2; } [data-component="SegmentedControl"] button { line-height: inherit; }',
    })
    for (const control of await page.getByRole('list').all()) {
      const height = await expectGeometry(control, 32, {horizontalContainment: false})
      expect(height).toBeGreaterThan(32)
      await control.getByRole('button', {name: 'Code', exact: true}).click()
      expect(await expectGeometry(control, 32, {horizontalContainment: false})).toBe(height)
    }
  })

  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`keyboard focus remains visible ${theme} @aat`, async ({page}) => {
      for (const story of ['compact-toolbar', 'multiline-labels']) {
        await visit(page, {id: `components-segmentedcontrol-features--${story}`, globals: {colorScheme: theme}})
        await expect(page.getByRole('list')).toHaveCount(story === 'compact-toolbar' ? 1 : 4)
        for (const control of await page.getByRole('list').all()) {
          const buttons = control.getByRole('button')
          await buttons.last().focus()
          await page.keyboard.press('Shift+Tab')
          await page.keyboard.press('Tab')
          for (let index = (await buttons.count()) - 1; index >= 0; index--) {
            await expectVisibleFocus(buttons.nth(index))
            if (index > 0) await page.keyboard.press('Shift+Tab')
          }
        }
      }
    })
  }

  test('text spacing preserves vertical geometry @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--multiline-labels'})
    await expect(page.getByRole('list')).toHaveCount(4)
    await page.addStyleTag({
      content:
        '[data-component="SegmentedControl"] button { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }',
    })
    for (const control of await page.getByRole('list').all()) {
      const height = await expectGeometry(control, 28, {horizontalContainment: false})
      await control.getByRole('button', {name: 'Code', exact: true}).click()
      expect(await expectGeometry(control, 28, {horizontalContainment: false})).toBe(height)
    }
  })

  // This height fix introduces no colors. Axe leaves pseudo-element contrast incomplete;
  // baseline dark subtle hover/active contrast is recorded separately, not certified here.
  for (const story of ['content-sizing', 'multiline-labels', 'compact-toolbar']) {
    test(`${story} accessibility @aat`, async ({page}) => {
      await visit(page, {id: `components-segmentedcontrol-features--${story}`})
      await expect(page.getByRole('list')).toHaveCount(
        story === 'content-sizing' ? 16 : story === 'multiline-labels' ? 4 : 1,
      )
      for (const button of await page.getByRole('list').getByRole('button').all()) {
        const label = button.locator('.segmentedControl-text')
        if (await label.count()) {
          const text = await label.getAttribute('data-text')
          const counter = button.locator('[data-component="CounterLabel"]')
          const count = (await counter.count()) ? await counter.textContent() : null
          await expect(button).toHaveAccessibleName(`${text}${count === null ? '' : ` (${count})`}`)
        }
      }
      await expect(page).toHaveNoViolations()
    })
  }

  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            if (story.title.includes('Narrow')) {
              // Set viewport to narrow
              await page.setViewportSize({width: viewports['primer.breakpoint.sm'], height: 768})
            }

            // Default state
            await expect(page).toHaveScreenshot(`SegmentedControl.${story.title}.${theme}.png`)

            if (story.title === 'Default') {
              // Focus state
              await page.keyboard.press('Tab')
              await expect(page).toHaveScreenshot(`SegmentedControl.${story.title}.${theme}.focus.png`)

              // Middle Button Focus state
              await page.keyboard.press('Tab')
              await page.keyboard.press('Enter')
              await page.keyboard.press('Shift+Tab')
              await expect(page).toHaveScreenshot(`SegmentedControl.${story.title}.${theme}.middle.selected.focus.png`)
            }

            if (story.title === 'Variant Narrow Action Menu With Action') {
              await page.setViewportSize({width: viewports['primer.breakpoint.xs'], height: 768})
              await page.locator('[data-component="ActionMenu.Button"]').click()
              await expect(page).toHaveScreenshot(`SegmentedControl.${story.title}.${theme}.menu.png`)
            }
          })
        })
      }
    })
  }
})
