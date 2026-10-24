import React from 'react'
import {renderToString} from 'react-dom/server'
import {render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import Breadcrumbs from '..'
import type {BreadcrumbsProps} from '..'
import {FeatureFlags} from '../../FeatureFlags'
import {implementsClassName} from '../../utils/testing'
import classes from '../Breadcrumbs.module.css'

const SHORT_LABELS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']
const LONG_LABELS = [
  'A rather long first breadcrumb',
  'A rather long second breadcrumb',
  'A rather long third breadcrumb',
  'The current page',
]

function TestBreadcrumbs({
  labels,
  width,
  ...props
}: Omit<BreadcrumbsProps, 'children'> & {labels: string[]; width: number}) {
  return (
    <FeatureFlags flags={{primer_react_breadcrumbs_css_overflow: true}}>
      <div style={{width}}>
        <Breadcrumbs {...props}>
          {labels.map((label, index) => (
            <Breadcrumbs.Item key={label} href={`/${index}`} selected={index === labels.length - 1}>
              {label}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
      </div>
    </FeatureFlags>
  )
}

const nextFrames = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

const getMenuButton = () => screen.getByRole('button', {name: /more breadcrumb items/i})

const getVisibleCrumbLabels = () =>
  within(screen.getByRole('navigation'))
    .getAllByRole('listitem')
    .flatMap(item => within(item).queryAllByRole('link'))
    .filter(link => !link.closest('details') && !link.closest('[inert]'))
    .map(link => link.textContent)

async function getMenuLabels() {
  await userEvent.click(getMenuButton())
  const details = getMenuButton().closest('details')!
  return within(details)
    .getAllByRole('link')
    .map(link => link.textContent)
}

describe('Breadcrumbs with primer_react_breadcrumbs_css_overflow', () => {
  implementsClassName(
    (props: BreadcrumbsProps) => (
      <FeatureFlags flags={{primer_react_breadcrumbs_css_overflow: true}}>
        <Breadcrumbs overflow="menu" {...props} />
      </FeatureFlags>
    ),
    classes.BreadcrumbsBase,
  )
  it('collapses all but the last four items into the menu', async () => {
    render(<TestBreadcrumbs overflow="menu" labels={SHORT_LABELS} width={1000} />)

    expect(getVisibleCrumbLabels()).toEqual(['Three', 'Four', 'Five', 'Six'])
    expect(getMenuButton()).toHaveAccessibleName('2 more breadcrumb items')
    expect(await getMenuLabels()).toEqual(['One', 'Two'])
  })

  it('keeps the root visible with menu-with-root', async () => {
    render(<TestBreadcrumbs overflow="menu-with-root" labels={SHORT_LABELS} width={1000} />)

    expect(getVisibleCrumbLabels()).toEqual(['One', 'Four', 'Five', 'Six'])
    expect(await getMenuLabels()).toEqual(['Two', 'Three'])
  })

  it('does not show the menu when every item fits', () => {
    render(<TestBreadcrumbs overflow="menu" labels={SHORT_LABELS.slice(0, 3)} width={1000} />)

    expect(getVisibleCrumbLabels()).toEqual(['One', 'Two', 'Three'])
    expect(screen.queryByRole('button', {name: /more breadcrumb items/i})).not.toBeInTheDocument()
  })

  it('collapses leading items that do not fit the width', async () => {
    render(<TestBreadcrumbs overflow="menu" labels={LONG_LABELS} width={600} />)

    await waitFor(() => expect(getVisibleCrumbLabels()).not.toContain(LONG_LABELS[0]))
    const visible = getVisibleCrumbLabels()
    expect(visible.at(-1)).toBe('The current page')

    const nav = screen.getByRole('navigation').getBoundingClientRect()
    for (const label of visible) {
      const rect = screen.getByRole('link', {name: label!}).getBoundingClientRect()
      expect(rect.left).toBeGreaterThanOrEqual(nav.left)
      expect(rect.right).toBeLessThanOrEqual(nav.right)
      expect(rect.top).toBeGreaterThanOrEqual(nav.top)
      expect(rect.bottom).toBeLessThanOrEqual(nav.bottom)
    }
    expect([...(await getMenuLabels()), ...visible]).toEqual(LONG_LABELS)
  })

  it('shows only the leaf in narrow containers', async () => {
    render(<TestBreadcrumbs overflow="menu" labels={SHORT_LABELS.slice(0, 4)} width={400} />)

    await waitFor(() => expect(getMenuButton()).toHaveAccessibleName('3 more breadcrumb items'))
    expect(getVisibleCrumbLabels()).toEqual(['Four'])
  })

  it('truncates the leaf when it does not fit on its own', async () => {
    const labels = ['Home', 'Section', 'An extremely long current page title that cannot fit']
    render(<TestBreadcrumbs overflow="menu-with-root" labels={labels} width={300} />)

    await waitFor(() => expect(getVisibleCrumbLabels()).toEqual([labels[2]]))
    const leaf = screen.getByRole('link', {name: labels[2]})
    const nav = screen.getByRole('navigation').getBoundingClientRect()
    expect(leaf.getBoundingClientRect().right).toBeLessThanOrEqual(nav.right)
    expect(leaf.scrollWidth).toBeGreaterThan(leaf.clientWidth)
  })

  it('fits the visible row to crumbs taller than a line of text', async () => {
    render(
      <FeatureFlags flags={{primer_react_breadcrumbs_css_overflow: true}}>
        <Breadcrumbs overflow="menu">
          <span style={{padding: 8}}>
            <Breadcrumbs.Item href="/1">Padded</Breadcrumbs.Item>
          </span>
          <Breadcrumbs.Item href="/2">Leaf</Breadcrumbs.Item>
        </Breadcrumbs>
      </FeatureFlags>,
    )

    await waitFor(() => {
      const nav = screen.getByRole('navigation').getBoundingClientRect()
      const padded = screen.getByRole('link', {name: 'Padded'}).parentElement!.getBoundingClientRect()
      expect(padded.top).toBeGreaterThanOrEqual(nav.top)
      expect(padded.bottom).toBeLessThanOrEqual(nav.bottom)
    })
  })

  it('exposes a single flat list to assistive technology', () => {
    render(<TestBreadcrumbs overflow="menu-with-root" labels={SHORT_LABELS} width={1000} />)

    const nav = screen.getByRole('navigation')
    // The overflow menu's own list lives inside the closed <details>.
    const lists = within(nav)
      .getAllByRole('list')
      .filter(list => !list.closest('details'))
    expect(lists).toHaveLength(1)
    // root, menu, and the three trailing crumbs
    expect(
      within(lists[0])
        .getAllByRole('listitem')
        .filter(item => !item.closest('details')),
    ).toHaveLength(5)
  })

  it('does not re-render on resizes that keep the same items collapsed', async () => {
    const onRender = vi.fn()
    render(
      <React.Profiler id="breadcrumbs" onRender={onRender}>
        <TestBreadcrumbs overflow="menu" labels={SHORT_LABELS} width={1000} />
      </React.Profiler>,
    )
    await nextFrames()
    const rendersAfterMount = onRender.mock.calls.length

    for (const width of [990, 1010, 900]) {
      const wrapper = screen.getByRole('navigation').parentElement!
      wrapper.style.width = `${width}px`
      await nextFrames()
    }

    expect(onRender).toHaveBeenCalledTimes(rendersAfterMount)
  })

  it('renders collapsed markup on the server', () => {
    const html = renderToString(<TestBreadcrumbs overflow="menu" labels={SHORT_LABELS} width={1000} />)
    const container = document.createElement('div')
    container.innerHTML = html

    const row = Array.from(container.querySelectorAll('ol[role="none"] > li')).map(item => item.textContent)
    expect(row).toEqual(['Three', 'Four', 'Five', 'Six'])
    expect(container.querySelector('[data-has-overflow]')).not.toBeNull()
  })

  it('moves the root into the menu before squeezing the leaf', async () => {
    const labels = ['collaboration-workflows-org', 'Teams', 'global-reviewers']
    render(<TestBreadcrumbs overflow="menu-with-root" labels={labels} width={220} />)

    await waitFor(() => expect(getVisibleCrumbLabels()).not.toContain(labels[0]))
    const leaf = screen.getByRole('link', {name: labels[2]})
    expect(leaf.scrollWidth).toBeLessThanOrEqual(leaf.clientWidth + 1)
    expect(await getMenuLabels()).toContain(labels[0])
  })

  it('keeps observer-owned DOM state across re-renders', async () => {
    const {rerender} = render(<TestBreadcrumbs overflow="menu" labels={LONG_LABELS} width={600} />)
    const list = screen.getByRole('list')
    const firstCrumb = () => screen.getByText(LONG_LABELS[0]).closest('li')!
    await waitFor(() => expect(list).toHaveAttribute('data-overflowing'))
    expect(firstCrumb()).toHaveAttribute('inert')

    rerender(<TestBreadcrumbs overflow="menu" labels={LONG_LABELS} width={600} className="updated" />)

    expect(list).toHaveAttribute('data-overflowing')
    expect(list).toHaveAttribute('data-observed')
    expect(firstCrumb()).toHaveAttribute('inert')
  })

  it('does not duplicate collapsed items while the menu is closed', async () => {
    render(<TestBreadcrumbs overflow="menu" labels={LONG_LABELS} width={600} />)

    await waitFor(() => expect(getVisibleCrumbLabels()).not.toContain(LONG_LABELS[0]))
    expect(screen.queryAllByText(LONG_LABELS[0])).toHaveLength(1)
    expect(await getMenuLabels()).toContain(LONG_LABELS[0])
  })

  it('does not collapse to nothing inside content-sized containers', async () => {
    render(
      <FeatureFlags flags={{primer_react_breadcrumbs_css_overflow: true}}>
        <div style={{display: 'inline-block'}}>
          <Breadcrumbs overflow="menu-with-root">
            <Breadcrumbs.Item href="/1">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/2">Docs</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/3">Current</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>
      </FeatureFlags>,
    )

    await waitFor(() => expect(getVisibleCrumbLabels()).toEqual(['Home', 'Docs', 'Current']))
    expect(screen.getByRole('navigation').getBoundingClientRect().width).toBeGreaterThan(0)
  })

  it('commits once when navigating to items that fit', async () => {
    const onRender = vi.fn()
    const ui = (labels: string[]) => (
      <React.Profiler id="breadcrumbs" onRender={onRender}>
        <TestBreadcrumbs overflow="menu" labels={labels} width={1000} />
      </React.Profiler>
    )
    const {rerender} = render(ui(['Home', 'Docs']))
    await nextFrames()
    onRender.mockClear()

    rerender(ui(['Home', 'Guides', 'Page']))
    await nextFrames()

    expect(onRender).toHaveBeenCalledTimes(1)
  })

  it('keeps the row to one line when shown after being hidden', async () => {
    const {container} = render(
      <div style={{display: 'none'}}>
        <TestBreadcrumbs overflow="menu" labels={LONG_LABELS} width={400} />
      </div>,
    )
    await nextFrames()
    const row = container.querySelector<HTMLElement>('ol[role="none"]')!
    expect(row.style.getPropertyValue('--breadcrumbs-row-min-height')).toBe('')

    container.querySelector<HTMLElement>('div')!.style.display = 'block'
    const leafHeight = screen.getByRole('link', {name: 'The current page'}).getBoundingClientRect().height
    expect(row.getBoundingClientRect().height).toBeLessThan(leafHeight * 2)
  })

  it('does not trigger ResizeObserver loop errors for crumbs taller than a line of text', async () => {
    const errors: string[] = []
    const onError = (event: ErrorEvent) => {
      errors.push(event.message)
      event.preventDefault()
    }
    window.addEventListener('error', onError)
    const {container} = render(
      <FeatureFlags flags={{primer_react_breadcrumbs_css_overflow: true}}>
        <div style={{width: 600}}>
          <Breadcrumbs overflow="menu">
            {LONG_LABELS.map(label => (
              <span key={label} style={{display: 'inline-block', padding: 8}}>
                <Breadcrumbs.Item href="#">{label}</Breadcrumbs.Item>
              </span>
            ))}
          </Breadcrumbs>
        </div>
      </FeatureFlags>,
    )
    const host = container.firstElementChild as HTMLElement
    for (let width = 600; width >= 200; width -= 25) {
      host.style.width = `${width}px`
      await nextFrames()
    }
    window.removeEventListener('error', onError)

    expect(errors).toEqual([])
  })
})
