import {Profiler} from 'react'
import {renderToString} from 'react-dom/server'
import {act, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent as browserUserEvent} from 'vitest/browser'
import Breadcrumbs from '..'
import {implementsClassName} from '../../utils/testing'
import classes from '../Breadcrumbs.module.css'

// Uses real layout and a real ResizeObserver.

const nextFrame = () =>
  act(
    () =>
      new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      }),
  )

const labels = ['Home', 'Organization', 'Engineering', 'core-productivity', 'collaboration', 'Current page']

function renderCrumbs(
  width: number,
  overflow: 'menu' | 'menu-with-root' = 'menu',
  items: string[] = labels,
  onRender?: () => void,
) {
  const ui = (w: number, crumbs: string[]) => (
    <div data-testid="container" style={{width: w, position: 'relative', overflow: 'auto'}}>
      <Profiler id="breadcrumbs" onRender={() => onRender?.()}>
        <Breadcrumbs overflow={overflow}>
          {crumbs.map((label, index) => (
            <Breadcrumbs.Item key={label} href={`#${label}`} selected={index === crumbs.length - 1}>
              {label}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
      </Profiler>
    </div>
  )
  const result = render(ui(width, items))
  const container = screen.getByTestId('container')
  const setWidth = async (w: number) => {
    container.style.width = `${w}px`
    await nextFrame()
  }
  return {...result, container, setWidth, rerenderWith: (crumbs: string[]) => result.rerender(ui(width, crumbs))}
}

const visibleLinks = () => screen.queryAllByRole('link').map(link => link.textContent)
const menuButton = () => screen.queryByRole('button', {name: /more breadcrumb items/i})

describe('Breadcrumbs overflow (real layout)', () => {
  implementsClassName(Breadcrumbs, classes.BreadcrumbsBase)

  it('collapses leading crumbs so the visible crumbs fit the container', async () => {
    const {container, setWidth} = renderCrumbs(1200)
    await nextFrame()
    expect(visibleLinks()).toEqual(labels.slice(2))

    await setWidth(300)
    const shown = visibleLinks()
    expect(shown.length).toBeLessThan(4)
    expect(shown.at(-1)).toBe('Current page')
    const nav = screen.getByRole('navigation')
    for (const link of screen.getAllByRole('link')) {
      expect(link.getBoundingClientRect().right).toBeLessThanOrEqual(nav.getBoundingClientRect().right + 1)
    }
    expect(menuButton()).toHaveAccessibleName(`${labels.length - shown.length} more breadcrumb items`)
    // Collapsed crumbs kept for measurement must not create overflow.
    expect(container.scrollWidth).toBe(container.clientWidth)

    await setWidth(1200)
    expect(visibleLinks()).toEqual(labels.slice(2))
  })

  it('keeps crumbs mounted when the collapse point moves', async () => {
    const {setWidth} = renderCrumbs(1200)
    await nextFrame()
    const leaf = screen.getByRole('link', {name: 'Current page'})
    const middle = screen.getByRole('link', {name: 'collaboration'})

    await setWidth(360)
    expect(screen.getByRole('link', {name: 'Current page'})).toBe(leaf)

    await setWidth(1200)
    expect(screen.getByRole('link', {name: 'Current page'})).toBe(leaf)
    expect(screen.getByRole('link', {name: 'collaboration'})).toBe(middle)
  })

  it('lists each collapsed crumb exactly once and hides it from assistive technology', async () => {
    const user = userEvent.setup()
    const {setWidth} = renderCrumbs(1200)
    await setWidth(300)
    const shown = visibleLinks()

    // Collapsed crumbs are not reachable by keyboard.
    for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-collapsed] a')) {
      link.focus()
      expect(link).not.toHaveFocus()
    }

    const button = menuButton()!
    const menu = button.closest<HTMLElement>('[data-component="Breadcrumbs.MenuItem"]')!
    expect(within(menu).queryAllByRole('link')).toHaveLength(0)

    await user.click(button)
    const menuLinks = within(menu)
      .getAllByRole('link')
      .map(link => link.textContent)
    expect(menuLinks).toEqual(labels.slice(0, labels.length - shown.length))
    // Collapsed crumbs are not also rendered in the list while the menu shows them.
    for (const label of labels) {
      expect(screen.getAllByText(label)).toHaveLength(1)
    }
  })

  it('never renders an empty overflow menu', () => {
    renderCrumbs(1200, 'menu-with-root', labels.slice(0, 4))
    expect(menuButton()).toBeNull()
    expect(visibleLinks()).toEqual(labels.slice(0, 4))
  })

  it('moves the root into the menu when only the leaf fits in menu-with-root mode', async () => {
    const user = userEvent.setup()
    const {setWidth} = renderCrumbs(1200, 'menu-with-root')
    await nextFrame()
    expect(visibleLinks()).toEqual(['Home', ...labels.slice(3)])

    await setWidth(150)
    expect(visibleLinks()).toEqual(['Current page'])
    await user.click(menuButton()!)
    expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument()
  })

  it('does not re-render on resizes that do not move the collapse point', async () => {
    const hoverAt = async (css: string) => {
      const probe = document.createElement('div')
      probe.style.cssText = `position:fixed;width:20px;height:20px;${css}`
      document.body.append(probe)
      await browserUserEvent.hover(probe)
      probe.remove()
    }
    // A pointer left over the spot where the menu button appears opens its tooltip (a state update),
    // which is not a resize-driven render. Park it there, then move it away before measuring.
    await hoverAt('left:0;top:0')
    let renders = 0
    const {setWidth} = renderCrumbs(1200, 'menu', labels, () => renders++)
    await nextFrame()
    await hoverAt('right:0;bottom:0')
    await nextFrame()
    renders = 0
    for (let width = 1190; width >= 900; width -= 10) {
      await setWidth(width)
    }
    expect(renders).toBe(0)
  })

  it('applies the count rule on the first render', () => {
    let renders = 0
    renderCrumbs(1200, 'menu', labels, () => renders++)
    expect(renders).toBe(1)
    expect(visibleLinks()).toEqual(labels.slice(2))
  })

  it('updates the collapsed crumbs when navigating', async () => {
    const {rerenderWith} = renderCrumbs(1200)
    await nextFrame()
    rerenderWith(labels.slice(0, 4))
    await nextFrame()
    expect(visibleLinks()).toEqual(labels.slice(0, 4))
    expect(menuButton()).toBeNull()

    rerenderWith([...labels, 'Deeper'])
    await nextFrame()
    expect(visibleLinks()).toEqual([...labels, 'Deeper'].slice(3))
  })

  it('keeps the hidden overflow menu out of the accessibility tree when nothing collapses', async () => {
    renderCrumbs(1200, 'menu', labels.slice(0, 3))
    await nextFrame()
    expect(menuButton()).toBeNull()
    expect(visibleLinks()).toEqual(labels.slice(0, 3))
  })
})

describe('Breadcrumbs overflow before hydration', () => {
  afterEach(async () => {
    await page.viewport(414, 896)
  })

  // Server markup in a real browser, as users see it before hydration, then hydrated.
  async function serverRender(width: number, overflow: 'menu' | 'menu-with-root', items: string[]) {
    const ui = (
      <Breadcrumbs overflow={overflow}>
        {items.map((label, index) => (
          <Breadcrumbs.Item key={label} href={`#${label}`} selected={index === items.length - 1}>
            {label}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>
    )
    const host = document.createElement('div')
    host.style.width = `${width}px`
    document.body.appendChild(host)
    // Rendering on the server is simulated in the browser, so React warns about layout effects.
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    host.innerHTML = renderToString(ui)
    error.mockRestore()
    const nav = host.querySelector('nav')!
    const snapshot = () => {
      const navRect = nav.getBoundingClientRect()
      const links = [...nav.querySelectorAll('a')].filter(link => {
        const rect = link.getBoundingClientRect()
        return (
          link.checkVisibility({visibilityProperty: true}) && rect.right > navRect.left && rect.left < navRect.right
        )
      })
      return {
        links: links.map(link => link.textContent),
        menu: [...nav.querySelectorAll('[data-component="Breadcrumbs.MenuItem"]')].some(menu => menu.checkVisibility()),
        overflowsNav: links.some(link => link.getBoundingClientRect().right > navRect.right + 1),
      }
    }
    const hydrate = async () => {
      const result = render(ui, {container: host, hydrate: true})
      await nextFrame()
      return result
    }
    return {nav, snapshot, hydrate}
  }

  it('applies the narrow rule on narrow viewports before hydration', async () => {
    await page.viewport(400, 800)
    const {snapshot, hydrate} = await serverRender(400, 'menu', labels.slice(0, 3))
    const before = snapshot()
    expect(before).toEqual({links: ['Engineering'], menu: true, overflowsNav: false})
    await hydrate()
    expect(snapshot()).toEqual(before)
  })

  it('never paints crumbs outside the nav before hydration, and keeps the leaf visible', async () => {
    const {snapshot, hydrate, nav} = await serverRender(300, 'menu-with-root', labels)
    const before = snapshot()
    expect(before.overflowsNav).toBe(false)
    expect(before.links.at(-1)).toBe('Current page')
    await hydrate()
    expect(nav).toHaveAttribute('data-hydrated')
    expect(snapshot().overflowsNav).toBe(false)
  })

  it('keeps every focusable crumb on screen when tabbing through unhydrated markup', async () => {
    const {nav} = await serverRender(300, 'menu-with-root', labels)
    const host = nav.parentElement!
    try {
      const navRect = nav.getBoundingClientRect()
      const tabStops = nav.querySelectorAll('a, button').length
      expect(tabStops).toBeGreaterThan(0)

      const offscreen: string[] = []
      for (let stop = 0; stop < tabStops; stop++) {
        await browserUserEvent.tab()
        const focused = document.activeElement as HTMLElement
        expect(nav).toContainElement(focused)
        const rect = focused.getBoundingClientRect()
        if (rect.left < navRect.left - 1 || rect.right > navRect.right + 1) {
          offscreen.push(`${focused.textContent || focused.getAttribute('aria-label')} (${rect.left}..${rect.right})`)
        }
      }
      expect(offscreen).toEqual([])
    } finally {
      host.remove()
    }
  })
})

describe('Breadcrumbs overflow regressions (real layout)', () => {
  const longLabels = [
    'Home',
    'organization-name-long',
    'engineering-team-long',
    'core-productivity-long',
    'Current page long',
  ]

  const crumbs = (overflow: 'wrap' | 'menu' | 'menu-with-root', items: string[], style?: React.CSSProperties) => (
    <Breadcrumbs overflow={overflow} style={style}>
      {items.map((label, index) => (
        <Breadcrumbs.Item key={label} href={`#${label}`} selected={index === items.length - 1}>
          {label}
        </Breadcrumbs.Item>
      ))}
    </Breadcrumbs>
  )

  const linksWithinNav = () => {
    const navRight = screen.getByRole('navigation').getBoundingClientRect().right
    return screen.queryAllByRole('link').every(link => link.getBoundingClientRect().right <= navRight + 1)
  }

  it.each([
    {overflow: 'menu', fontSize: 28, from: 600, to: 720, step: 8},
    {overflow: 'menu-with-root', fontSize: 28, from: 600, to: 720, step: 8},
    {overflow: 'menu', fontSize: 40, from: 600, to: 1000, step: 16},
    {overflow: 'menu-with-root', fontSize: 40, from: 600, to: 1000, step: 16},
  ] as const)(
    'settles and keeps visible crumbs inside the nav with $fontSize px text in $overflow mode',
    async ({overflow, fontSize, from, to, step}) => {
      // Text scaling grows the separator drawn between crumbs by `em`, but not the 16px icon
      // used once crumbs collapse, so the separators must be measured, not assumed.
      for (let width = from; width <= to; width += step) {
        const {unmount} = render(
          <div style={{width, ['--text-body-size-medium' as string]: `${fontSize}px`}}>
            {crumbs(overflow, ['Home', 'Organization', 'Engineering', 'Current page'])}
          </div>,
        )
        await nextFrame()
        const settled = visibleLinks()
        await nextFrame()
        await nextFrame()
        expect(visibleLinks(), `width ${width}`).toEqual(settled)
        expect(settled.at(-1), `width ${width}`).toBe('Current page')
        expect(linksWithinNav(), `width ${width}: ${settled.join(', ')}`).toBe(true)
        unmount()
      }
    },
  )

  it('keeps the same crumbs when the breadcrumbs are hidden and shown again', async () => {
    const {container, setWidth} = renderCrumbs(600, 'menu', longLabels)
    await nextFrame()
    const before = visibleLinks()
    expect(before.length).toBeLessThan(longLabels.length)
    expect(linksWithinNav()).toBe(true)

    container.style.display = 'none'
    await nextFrame()
    container.style.display = 'block'
    await nextFrame()
    expect(visibleLinks()).toEqual(before)
    expect(linksWithinNav()).toBe(true)

    // Still responds to resizes afterwards.
    await setWidth(300)
    expect(linksWithinNav()).toBe(true)
  })

  it('measures the content box, so padding does not change which crumbs collapse', async () => {
    // 520px of content is below the 544px narrow breakpoint with or without padding.
    const three = labels.slice(0, 3)
    const plain = render(<div style={{width: 520}}>{crumbs('menu', three)}</div>)
    await nextFrame()
    const withoutPadding = visibleLinks()
    expect(withoutPadding).toEqual(['Engineering'])
    plain.unmount()

    render(<div style={{width: 552}}>{crumbs('menu', three, {boxSizing: 'border-box', paddingInline: 16})}</div>)
    await nextFrame()
    expect(visibleLinks()).toEqual(withoutPadding)
  })

  it('measures the content box when a padded container is resized', async () => {
    const three = labels.slice(0, 3)
    render(
      <div data-testid="container" style={{width: 800}}>
        {crumbs('menu', three, {boxSizing: 'border-box', paddingInline: 16})}
      </div>,
    )
    await nextFrame()
    expect(visibleLinks()).toEqual(three)

    screen.getByTestId('container').style.width = '552px'
    await nextFrame()
    expect(visibleLinks()).toEqual(['Engineering'])
  })

  it('settles when crumbs have a min-width smaller than their content', async () => {
    // Downstream crumbs set `min-width: 3ch`. A collapsed crumb is a zero-width item, so it shrinks
    // to its min-width. Measuring it there makes both crumbs appear to fit, which expands them again.
    render(
      <div style={{width: 90}}>
        <Breadcrumbs overflow="menu">
          {['github', 'test-123'].map((label, index) => (
            <Breadcrumbs.Item key={label} href={`#${label}`} selected={index === 1} style={{minWidth: '3ch'}}>
              {label}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
      </div>,
    )
    await nextFrame()
    expect(screen.getByRole('navigation', {name: 'Breadcrumbs'})).toBeInTheDocument()
    expect(visibleLinks()).toEqual(['test-123'])
    expect(linksWithinNav()).toBe(true)
  })

  it('measures every element a crumb renders, so it collapses instead of spilling out', async () => {
    // Mirrors a header crumb that renders a link and a sibling button (a repository picker) in a
    // region that aligns to the end, so an under-measured crumb would spill out of its start edge.
    function CrumbWithPicker() {
      return (
        <>
          <Breadcrumbs.Item href="#repository" selected>
            repository
          </Breadcrumbs.Item>
          <button type="button" style={{width: 24}}>
            Switch
          </button>
        </>
      )
    }
    const ui = (width: number) => (
      <div data-testid="region" style={{display: 'flex', justifyContent: 'flex-end', width}}>
        <Breadcrumbs overflow="menu">
          <Breadcrumbs.Item key="owner" href="#owner">
            organization-with-a-long-name
          </Breadcrumbs.Item>
          <CrumbWithPicker key="repository" />
        </Breadcrumbs>
      </div>
    )
    const {rerender} = render(ui(800))
    await nextFrame()
    expect(menuButton()).toBeNull()

    // Narrower than the crumbs, but wider than they measure without the picker button.
    rerender(ui(screen.getByRole('list').getBoundingClientRect().width - 8))
    await nextFrame()
    expect(visibleLinks()).toEqual(['repository'])
    const region = screen.getByTestId('region').getBoundingClientRect()
    for (const element of [
      menuButton()!,
      ...screen.getAllByRole('link'),
      screen.getByRole('button', {name: 'Switch'}),
    ]) {
      const rect = element.getBoundingClientRect()
      if (rect.width === 0) continue
      expect(rect.left).toBeGreaterThanOrEqual(region.left - 1)
      expect(rect.right).toBeLessThanOrEqual(region.right + 1)
    }
  })

  it('collapses when it shares a flex row with a sibling that can shrink', async () => {
    // Mirrors a header region where the crumbs sit beside a search field. If the nav kept its
    // crumbs' width, the sibling would absorb the squeeze and the crumbs would always measure as
    // fitting, so nothing would collapse until the row was narrower than the crumbs alone.
    // Whole-pixel widths, so rounding can't decide whether the crumbs fit.
    const ui = (width: number) => (
      <div style={{display: 'flex', width, ['--text-body-size-medium' as string]: '20px'}}>
        <Breadcrumbs overflow="menu">
          {['owner', 'repository'].map((label, index) => (
            <Breadcrumbs.Item key={label} href={`#${label}`} selected={index === 1} style={{width: 150}}>
              {label}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
        <div style={{flex: '0 1 400px', minWidth: 100}} />
      </div>
    )
    const {rerender} = render(ui(1600))
    await nextFrame()
    expect(menuButton()).toBeNull()

    // The crumbs only fit if the sibling gives up everything above its minimum width.
    rerender(ui(screen.getByRole('list').getBoundingClientRect().width + 100))
    await nextFrame()
    expect(visibleLinks()).toEqual(['repository'])
  })

  it('starts with the overflow menu closed after switching to wrap and back', async () => {
    const user = userEvent.setup()
    const ui = (overflow: 'wrap' | 'menu') => <div style={{width: 300}}>{crumbs(overflow, labels)}</div>
    const {rerender} = render(ui('menu'))
    await nextFrame()
    await user.click(menuButton()!)
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true')

    rerender(ui('wrap'))
    await nextFrame()
    expect(menuButton()).toBeNull()

    rerender(ui('menu'))
    await nextFrame()
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false')
    const menu = menuButton()!.closest<HTMLElement>('[data-component="Breadcrumbs.MenuItem"]')!
    expect(within(menu).queryAllByRole('link')).toHaveLength(0)
  })
})
