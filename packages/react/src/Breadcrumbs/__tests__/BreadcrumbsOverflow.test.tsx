import {Profiler} from 'react'
import {act, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
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
    for (const label of labels) {
      expect(screen.getAllByRole('link', {name: label})).toHaveLength(1)
    }
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
})
