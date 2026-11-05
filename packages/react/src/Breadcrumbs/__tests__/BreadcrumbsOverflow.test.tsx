import {Profiler} from 'react'
import {renderToString} from 'react-dom/server'
import {act, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {page} from 'vitest/browser'
import Breadcrumbs from '..'

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
    let renders = 0
    const {setWidth} = renderCrumbs(1200, 'menu', labels, () => renders++)
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
})
