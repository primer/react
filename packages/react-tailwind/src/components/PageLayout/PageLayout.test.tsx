import React from 'react'
import {act, fireEvent, render, screen, within} from '@testing-library/react'
import {flushSync} from 'react-dom'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {describe, expect, it, vi} from 'vitest'
import {PageLayout} from './PageLayout'

function mockOverflow() {
  const scrollHeight = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(200)
  const clientHeight = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
  return () => {
    scrollHeight.mockRestore()
    clientHeight.mockRestore()
  }
}

describe('PageLayout', () => {
  it('preserves authored layout parts and forwards root props', () => {
    render(
      <PageLayout data-testid="layout">
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Content>Main</PageLayout.Content>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )
    expect(screen.getByTestId('layout')).toHaveAttribute('data-component', 'PageLayout')
    expect(screen.getByRole('main')).toHaveTextContent('Main')
  })

  it('applies public styling classes to the centered wrapper and content row', () => {
    const {container} = render(
      <PageLayout wrapperClassName="layout-wrapper" contentRowClassName="layout-content-row">
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Pane>Pane</PageLayout.Pane>
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )

    const wrapper = container.querySelector<HTMLDivElement>('.layout-wrapper')
    const row = container.querySelector<HTMLDivElement>('.layout-content-row')
    expect(wrapper).toContainElement(screen.getByRole('banner'))
    expect(wrapper).toContainElement(screen.getByRole('contentinfo'))
    expect(wrapper).toContainElement(row)
    expect(row).toContainElement(screen.getByRole('main'))
    expect(row).toHaveTextContent('Pane')
    expect(row).not.toContainElement(screen.getByRole('banner'))
    expect(screen.getByRole('main')).not.toHaveClass('layout-content-row')
  })

  it('keeps Content a flex column whose inner region fills it, including when responsively hidden', () => {
    const {rerender} = render(
      <PageLayout>
        <PageLayout.Content>Main</PageLayout.Content>
      </PageLayout>,
    )
    expect(screen.getByRole('main')).toHaveClass('primer:flex', 'primer:flex-col')
    expect(screen.getByRole('main')).not.toHaveClass('primer:block')
    expect(screen.getByText('Main')).toHaveClass('primer:grow')

    rerender(
      <PageLayout>
        <PageLayout.Content hidden={{narrow: true}}>Main</PageLayout.Content>
      </PageLayout>,
    )
    expect(screen.getByRole('main', {hidden: true})).toHaveClass('primer:hidden', 'primer:md:flex', 'primer:flex-col')
  })

  it('lays Content beside Pane from the regular range onward', () => {
    const {container} = render(
      <PageLayout rowGap="condensed" columnGap="normal">
        <PageLayout.Pane>Pane</PageLayout.Pane>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    const layout = container.querySelector('[data-component="PageLayout"]') as HTMLElement
    const layoutRow = layout.querySelector('[data-component="PageLayout.Content"]')?.parentElement as HTMLElement
    expect(layout).toHaveClass('primer:[--page-layout-column-gap:1rem]', 'primer:lg:[--page-layout-column-gap:1.5rem]')
    expect(layoutRow).toHaveClass('primer:md:flex-row', 'primer:gap-y-4', 'primer:gap-x-4', 'primer:lg:gap-x-6')
    expect(layout.querySelector('[data-component="PageLayout.Pane"]')).toHaveClass('primer:md:w-[var(--pane-width)]')
    expect(layout.querySelector('[data-component="PageLayout.Content"]')).toHaveClass('primer:md:basis-0')
  })

  it('uses Primer container widths instead of the nearest Tailwind default', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Content width="large">Content</PageLayout.Content>
      </PageLayout>,
    )

    expect(container.querySelector('[data-component="PageLayout.Content"] > div')).toHaveClass('primer:max-w-[1012px]')
  })

  it('uses the regular-range pane width below 1012px', () => {
    const originalInnerWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', {configurable: true, value: 992})
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane width="medium">Pane</PageLayout.Pane>
      </PageLayout>,
    )
    Object.defineProperty(window, 'innerWidth', {configurable: true, value: originalInnerWidth})

    expect(container.querySelector('[data-component="PageLayout.Pane"]')).toHaveStyle('--pane-width: 256px')
  })

  it('orders panes for every responsive viewport range', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane position={{narrow: 'end', regular: 'start', wide: 'end'}}>Pane</PageLayout.Pane>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    expect(container.querySelector('[data-component="PageLayout.Pane"]')?.parentElement).toHaveClass(
      'primer:order-3',
      'primer:md:order-1',
      'primer:2xl:order-3',
    )
  })

  it('extracts a sticky sidebar into a root-level layout region', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Sidebar sticky>Sidebar</PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    expect(container.querySelector('[data-component="PageLayout"]')).toHaveClass('primer:flex', 'primer:flex-row')
    expect(container.querySelector('[data-component="PageLayout.Sidebar"]')?.parentElement?.parentElement).toHaveClass(
      'primer:sticky',
      'primer:top-0',
      'primer:h-screen',
    )
  })

  it('places a sidebar at the start by default and fills omitted ranges with the default', () => {
    const {container, rerender} = render(
      <PageLayout>
        <PageLayout.Sidebar>Sidebar</PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    const sidebar = () => container.querySelector('[data-component="PageLayout.Sidebar"]')?.parentElement?.parentElement
    expect(sidebar()).toHaveAttribute('data-position', 'start')
    expect(sidebar()).toHaveClass('primer:order-first', 'primer:md:order-first', 'primer:2xl:order-first')

    rerender(
      <PageLayout>
        <PageLayout.Sidebar position={{regular: 'end'}}>Sidebar</PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    expect(sidebar()).toHaveClass('primer:order-first', 'primer:md:order-last', 'primer:2xl:order-last')
    rerender(<></>)
  })

  it('lets a non-resizable sidebar fill its styled rail without remounting its content', () => {
    const ref = React.createRef<HTMLDivElement>()
    const width = {min: '1304px', default: '1304px', max: '1304px'} as const
    const layout = (widthMode: 'default' | 'fill') => (
      <PageLayout>
        <PageLayout.Sidebar ref={ref} width={width} widthMode={widthMode} style={{width: '60%'}}>
          <input aria-label="Draft" defaultValue="Original draft" />
        </PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>
    )
    const {container, rerender} = render(layout('fill'))
    const pane = container.querySelector('[data-component="PageLayout.Sidebar"]')
    const draft = screen.getByRole('textbox', {name: 'Draft'})

    expect(ref.current).toHaveStyle({width: '60%'})
    expect(ref.current).toHaveClass('primer:w-full', 'primer:min-w-0')
    expect(pane?.parentElement).toHaveClass('primer:min-w-0', 'primer:flex-1')
    expect(pane).toHaveClass('primer:w-full', 'primer:flex-1')
    expect(pane).not.toHaveClass('primer:md:w-[var(--pane-width)]', 'primer:md:flex-none')
    expect(pane).not.toHaveClass('primer:md:w-[clamp(var(--pane-min-width),var(--pane-width),var(--pane-max-width))]')
    expect(pane?.parentElement).not.toHaveAttribute('widthMode')

    fireEvent.change(draft, {target: {value: 'Edited draft'}})
    rerender(layout('default'))
    expect(screen.getByRole('textbox', {name: 'Draft'})).toBe(draft)
    expect(draft).toHaveValue('Edited draft')
    expect(pane).toHaveClass('primer:md:w-[clamp(var(--pane-min-width),var(--pane-width),var(--pane-max-width))]')
    expect(pane).toHaveStyle('--pane-width: 1304px')
  })

  it('rejects combining fill width mode with a resizable sidebar', () => {
    expect(() =>
      render(
        <PageLayout>
          <PageLayout.Sidebar widthMode="fill" resizable>
            Sidebar
          </PageLayout.Sidebar>
        </PageLayout>,
      ),
    ).toThrow('PageLayout.Sidebar widthMode="fill" does not support resizing')
  })

  it('hydrates a fill-mode sidebar without replacing its content', async () => {
    const layout = (
      <PageLayout>
        <PageLayout.Sidebar
          widthMode="fill"
          width={{min: '1304px', default: '1304px', max: '1304px'}}
          style={{width: '60%'}}
        >
          <input aria-label="Draft" defaultValue="Saved draft" />
        </PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(layout)
    document.body.append(container)
    const pane = container.querySelector('[data-component="PageLayout.Sidebar"]')
    const draft = within(container).getByRole('textbox', {name: 'Draft'})
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot>

    await act(async () => {
      root = hydrateRoot(container, layout, {onRecoverableError})
    })

    expect(container.querySelector('[data-component="PageLayout.Sidebar"]')).toBe(pane)
    expect(within(container).getByRole('textbox', {name: 'Draft'})).toBe(draft)
    expect(draft).toHaveValue('Saved draft')
    expect(onRecoverableError).not.toHaveBeenCalled()
    act(() => root.unmount())
    container.remove()
  })

  it('names each resize handle from its pane, preferring aria-labelledby', () => {
    render(
      <PageLayout>
        <PageLayout.Sidebar resizable aria-label="Navigation sidebar">
          Navigation
        </PageLayout.Sidebar>
        <PageLayout.Pane resizable aria-label="Fallback" aria-labelledby="inspector-heading">
          <h2 id="inspector-heading">Inspector</h2>
        </PageLayout.Pane>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )

    const sidebarHandle = screen.getByRole('slider', {name: 'Navigation sidebar'})
    const paneHandle = screen.getByRole('slider', {name: 'Inspector'})
    expect(sidebarHandle).toHaveAttribute('aria-label', 'Navigation sidebar')
    expect(paneHandle).toHaveAttribute('aria-labelledby', 'inspector-heading')
    expect(paneHandle).not.toHaveAttribute('aria-label')
  })

  it('retains the default resize handle name when pane labels are blank', () => {
    render(
      <PageLayout>
        <PageLayout.Pane resizable aria-label=" " aria-labelledby="">
          Pane
        </PageLayout.Pane>
      </PageLayout>,
    )

    expect(screen.getByRole('slider', {name: 'Draggable pane splitter'})).toHaveAttribute(
      'aria-label',
      'Draggable pane splitter',
    )
  })

  it('updates the resize handle name when the pane label changes', () => {
    const pane = (label: string) => (
      <PageLayout>
        <PageLayout.Pane resizable aria-label={label} aria-labelledby=" ">
          Pane
        </PageLayout.Pane>
      </PageLayout>
    )
    const {rerender} = render(pane('Repository navigation'))
    expect(screen.getByRole('slider', {name: 'Repository navigation'})).toBeInTheDocument()

    rerender(pane('Issue navigation'))
    expect(screen.getByRole('slider', {name: 'Issue navigation'})).toBeInTheDocument()
  })

  it('renders the pane resize handle name on the server', () => {
    const markup = renderToString(
      <PageLayout>
        <PageLayout.Pane resizable aria-label="Repository navigation">
          Navigation
        </PageLayout.Pane>
      </PageLayout>,
    )
    const container = document.createElement('div')
    container.innerHTML = markup
    expect(within(container).getByRole('slider', {name: 'Repository navigation'})).toHaveAttribute(
      'aria-label',
      'Repository navigation',
    )
  })

  it('persists a resizable sidebar width only under its own storage key', () => {
    window.localStorage.clear()
    const {unmount} = render(
      <PageLayout>
        <PageLayout.Sidebar resizable>Sidebar</PageLayout.Sidebar>
      </PageLayout>,
    )
    let handle = screen.getByRole('slider')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(window.localStorage.getItem('paneWidth')).toBeNull()
    unmount()

    const keyed = render(
      <PageLayout>
        <PageLayout.Sidebar resizable widthStorageKey="sidebarWidth">
          Sidebar
        </PageLayout.Sidebar>
      </PageLayout>,
    )
    handle = screen.getByRole('slider')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(window.localStorage.getItem('sidebarWidth')).not.toBeNull()
    expect(window.localStorage.getItem('paneWidth')).toBeNull()
    keyed.unmount()
    window.localStorage.clear()
  })

  it('caps a resizable sidebar custom width to the viewport and updates its slider', () => {
    vi.stubGlobal('innerWidth', 800)
    const {container, unmount} = render(
      <PageLayout>
        <PageLayout.Sidebar resizable width={{min: '240px', default: '300px', max: '480px'}}>
          Sidebar
        </PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '289')
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '289')
    expect(container.querySelector('[data-component="PageLayout.Sidebar"]')).toHaveStyle('--pane-max-width: 289px')
    unmount()
    vi.unstubAllGlobals()
  })

  it('keeps a controlled sidebar slider within viewport limits as the viewport changes', () => {
    vi.stubGlobal('innerWidth', 1280)
    const onResizeEnd = vi.fn()
    const {container, unmount} = render(
      <PageLayout>
        <PageLayout.Sidebar
          resizable
          currentWidth={400}
          onResizeEnd={onResizeEnd}
          width={{min: '240px', default: '300px', max: '480px'}}
        >
          Sidebar
        </PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    const pane = container.querySelector('[data-component="PageLayout.Sidebar"]')
    const handle = screen.getByRole('slider')
    expect(handle).toHaveAttribute('aria-valuemax', '321')
    expect(handle).toHaveAttribute('aria-valuenow', '321')
    expect(pane).toHaveStyle('--pane-width: 321px')

    act(() => {
      vi.stubGlobal('innerWidth', 800)
      window.dispatchEvent(new Event('resize'))
    })
    expect(handle).toHaveAttribute('aria-valuemax', '289')
    expect(handle).toHaveAttribute('aria-valuenow', '289')
    expect(pane).toHaveStyle('--pane-width: 289px')

    act(() => {
      vi.stubGlobal('innerWidth', 1024)
      window.dispatchEvent(new Event('resize'))
    })
    expect(handle).toHaveAttribute('aria-valuemax', '480')
    expect(handle).toHaveAttribute('aria-valuenow', '400')
    expect(pane).toHaveStyle('--pane-width: 400px')
    expect(onResizeEnd).not.toHaveBeenCalled()
    unmount()
    vi.unstubAllGlobals()
  })

  it('preserves an in-progress controlled keyboard resize when the viewport changes', () => {
    vi.stubGlobal('innerWidth', 1024)
    const onResizeEnd = vi.fn()
    const {unmount} = render(
      <PageLayout>
        <PageLayout.Sidebar
          resizable
          currentWidth={300}
          onResizeEnd={onResizeEnd}
          width={{min: '240px', default: '300px', max: '480px'}}
        >
          Sidebar
        </PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    const handle = screen.getByRole('slider')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    expect(handle).toHaveAttribute('aria-valuenow', '303')
    act(() => {
      vi.stubGlobal('innerWidth', 1100)
      window.dispatchEvent(new Event('resize'))
    })
    expect(handle).toHaveAttribute('aria-valuenow', '303')
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(onResizeEnd).toHaveBeenLastCalledWith(303)
    unmount()
    vi.unstubAllGlobals()
  })

  it.each(['Pane', 'Sidebar'] as const)('restores a rejected controlled %s resize', part => {
    vi.stubGlobal('innerWidth', 1024)
    const onResizeEnd = vi.fn()
    const Component = PageLayout[part]
    const layout = (currentWidth: number) => (
      <PageLayout>
        <Component
          position="start"
          resizable
          currentWidth={currentWidth}
          onResizeEnd={onResizeEnd}
          width={{min: '240px', default: '300px', max: '480px'}}
        >
          Pane
        </Component>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>
    )
    const {container, rerender, unmount} = render(layout(300))
    const pane = container.querySelector(`[data-component="PageLayout.${part}"]`)
    const handle = screen.getByRole('slider')

    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    expect(handle).toHaveAttribute('aria-valuenow', '303')
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(onResizeEnd).toHaveBeenLastCalledWith(303)
    expect(handle).toHaveAttribute('aria-valuenow', '300')
    expect(pane).toHaveStyle('--pane-width: 300px')

    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(onResizeEnd).toHaveBeenLastCalledWith(303)
    expect(handle).toHaveAttribute('aria-valuenow', '300')

    rerender(layout(303))
    expect(handle).toHaveAttribute('aria-valuenow', '303')
    expect(pane).toHaveStyle('--pane-width: 303px')
    unmount()
    vi.unstubAllGlobals()
  })

  it('uses a synchronously transformed controlled width after a resize', () => {
    vi.stubGlobal('innerWidth', 1024)
    function ControlledPane() {
      const [width, setWidth] = React.useState(300)
      return (
        <PageLayout>
          <PageLayout.Pane
            position="start"
            resizable
            currentWidth={width}
            onResizeEnd={next => flushSync(() => setWidth(next + 1))}
            width={{min: '240px', default: '300px', max: '480px'}}
          >
            Pane
          </PageLayout.Pane>
          <PageLayout.Content>Content</PageLayout.Content>
        </PageLayout>
      )
    }
    const {container, unmount} = render(<ControlledPane />)
    const handle = screen.getByRole('slider')
    const pane = container.querySelector('[data-component="PageLayout.Pane"]')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(handle).toHaveAttribute('aria-valuenow', '304')
    expect(pane).toHaveStyle('--pane-width: 304px')
    unmount()
    vi.unstubAllGlobals()
  })

  it('uses synchronously updated controlled bounds after a resize', () => {
    vi.stubGlobal('innerWidth', 1024)
    function ControlledPane() {
      const [width, setWidth] = React.useState(300)
      const [maxWidth, setMaxWidth] = React.useState<'480px' | '600px'>('480px')
      return (
        <PageLayout>
          <PageLayout.Pane
            position="start"
            resizable
            currentWidth={width}
            onResizeEnd={next =>
              flushSync(() => {
                setMaxWidth('600px')
                setWidth(next + 200)
              })
            }
            width={{min: '240px', default: '300px', max: maxWidth}}
          >
            Pane
          </PageLayout.Pane>
        </PageLayout>
      )
    }
    const {container, unmount} = render(<ControlledPane />)
    const handle = screen.getByRole('slider')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(handle).toHaveAttribute('aria-valuenow', '503')
    expect(handle).toHaveAttribute('aria-valuemax', '600')
    expect(container.querySelector('[data-component="PageLayout.Pane"]')).toHaveStyle('--pane-width: 503px')
    unmount()
    vi.unstubAllGlobals()
  })

  it('does not reapply resize constraints when resizing is synchronously disabled', () => {
    vi.stubGlobal('innerWidth', 1280)
    function ControlledSidebar() {
      const [width, setWidth] = React.useState(300)
      const [resizable, setResizable] = React.useState(true)
      return (
        <PageLayout>
          <PageLayout.Sidebar
            resizable={resizable}
            currentWidth={width}
            onResizeEnd={() =>
              flushSync(() => {
                setResizable(false)
                setWidth(400)
              })
            }
            width={{min: '240px', default: '300px', max: '480px'}}
          >
            Sidebar
          </PageLayout.Sidebar>
        </PageLayout>
      )
    }
    const {container, unmount} = render(<ControlledSidebar />)
    const handle = screen.getByRole('slider')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    expect(container.querySelector('[data-component="PageLayout.Sidebar"]')).toHaveStyle('--pane-width: 400px')
    unmount()
    vi.unstubAllGlobals()
  })

  it('restores a rejected controlled double-click reset', () => {
    vi.stubGlobal('innerWidth', 1024)
    const onResizeEnd = vi.fn()
    const {container, unmount} = render(
      <PageLayout>
        <PageLayout.Pane
          resizable
          currentWidth={350}
          onResizeEnd={onResizeEnd}
          width={{min: '240px', default: '300px', max: '480px'}}
        >
          Pane
        </PageLayout.Pane>
      </PageLayout>,
    )
    const handle = screen.getByRole('slider')
    fireEvent.doubleClick(handle)
    expect(onResizeEnd).toHaveBeenLastCalledWith(300)
    expect(handle).toHaveAttribute('aria-valuenow', '350')
    expect(container.querySelector('[data-component="PageLayout.Pane"]')).toHaveStyle('--pane-width: 350px')
    unmount()
    vi.unstubAllGlobals()
  })

  it('keeps header and footer outside the pane and content row', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Pane>Pane</PageLayout.Pane>
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )

    const content = container.querySelector('[data-component="PageLayout.Content"]')
    const contentRow = content?.parentElement
    expect(contentRow).toContainElement(container.querySelector('[data-component="PageLayout.Pane"]'))
    expect(contentRow).not.toContainElement(container.querySelector('[data-component="PageLayout.Header"]'))
    expect(contentRow).not.toContainElement(container.querySelector('[data-component="PageLayout.Footer"]'))
  })

  it('restores a layout box for fullscreen sidebars in the narrow range', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Sidebar responsiveVariant="fullscreen">Sidebar</PageLayout.Sidebar>
      </PageLayout>,
    )
    expect(container.querySelector('[data-component="PageLayout.Sidebar"]')?.parentElement?.parentElement).toHaveClass(
      'primer:max-md:block',
      'primer:max-md:fixed',
      'primer:max-md:h-screen',
      'primer:max-md:w-screen',
    )
  })

  it('accepts a responsive footer divider and spaces it from the footer content', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Footer divider={{narrow: 'none', regular: 'line'}}>Footer</PageLayout.Footer>
      </PageLayout>,
    )
    expect(container.querySelector('footer [aria-hidden="true"]')).toHaveClass(
      'primer:mb-[var(--page-layout-row-gap)]',
      'primer:hidden',
      'primer:md:block',
      'primer:md:h-px',
      'primer:md:bg-[var(--borderColor-default)]',
    )
  })

  it('places the narrow sidebar divider between the sidebar and the content', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Sidebar aria-label="Sidebar" divider="line" position="start">
          Sidebar
        </PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    const pane = container.querySelector('[data-component="PageLayout.Sidebar"]')?.closest('[data-position]')
    expect(pane?.tagName).toBe('DIV')
    const narrowDivider = pane?.nextElementSibling
    expect(narrowDivider).toHaveClass(
      'primer:order-last',
      'primer:ms-[var(--page-layout-column-gap)]',
      'primer:md:hidden',
    )
  })

  it('renders responsive divider utilities from static class maps', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Header divider={{narrow: 'filled', regular: 'line'}}>Header</PageLayout.Header>
      </PageLayout>,
    )
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass(
      'primer:mt-[var(--page-layout-row-gap)]',
      'primer:box-border',
      'primer:h-2',
      'primer:border-y',
      'primer:border-default',
      'primer:bg-inset',
      'primer:md:h-px',
      'primer:md:border-0',
      'primer:md:bg-[var(--borderColor-default)]',
      'primer:2xl:h-px',
    )
  })

  it('uses a horizontal narrow divider and a vertical regular divider for panes', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane divider={{narrow: 'filled', regular: 'line', wide: 'none'}}>Pane</PageLayout.Pane>
      </PageLayout>,
    )
    const pane = container.querySelector('[data-component="PageLayout.Pane"]')
    const dividers = pane?.parentElement?.querySelectorAll(':scope > div[aria-hidden="true"]') ?? []
    expect(dividers[0]).toHaveClass(
      'primer:box-border',
      'primer:h-2',
      'primer:border-y',
      'primer:border-default',
      'primer:bg-inset',
      'primer:order-first',
      'primer:md:hidden',
      'primer:2xl:hidden',
    )
    expect(dividers[1]).toHaveClass(
      'primer:hidden',
      'primer:md:block',
      'primer:md:w-px',
      'primer:md:bg-[var(--borderColor-default)]',
      'primer:2xl:hidden',
    )
    expect(dividers[1]).toHaveClass(
      'primer:md:mr-[var(--page-layout-column-gap)]',
      'primer:md:ml-0',
      'primer:2xl:mr-[var(--page-layout-column-gap)]',
      'primer:2xl:ml-0',
    )
  })

  it('resizes a pane with its keyboard-operable slider', () => {
    const onResizeEnd = vi.fn()
    render(
      <PageLayout>
        <PageLayout.Pane resizable onResizeEnd={onResizeEnd}>
          Pane
        </PageLayout.Pane>
      </PageLayout>,
    )
    const handle = screen.getByRole('slider')
    expect(handle).not.toHaveAttribute('data-dragging')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    expect(handle).toHaveAttribute('data-dragging')
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(handle).not.toHaveAttribute('data-dragging')
    expect(onResizeEnd).toHaveBeenCalled()
  })

  it.each([
    {direction: 'ltr', position: 'start', expectedRight: 299},
    {direction: 'ltr', position: 'end', expectedRight: 293},
    {direction: 'rtl', position: 'start', expectedRight: 293},
    {direction: 'rtl', position: 'end', expectedRight: 299},
  ] as const)(
    'resizes a $position pane in the physical arrow direction in $direction',
    ({direction, position, expectedRight}) => {
      const onResizeEnd = vi.fn()
      render(
        <PageLayout>
          <PageLayout.Pane position={position} resizable onResizeEnd={onResizeEnd}>
            Pane
          </PageLayout.Pane>
        </PageLayout>,
      )
      const handle = screen.getByRole('slider')
      handle.style.direction = direction
      fireEvent.keyDown(handle, {key: 'ArrowRight'})
      expect(handle).toHaveAttribute('aria-valuenow', String(expectedRight))
      fireEvent.keyUp(handle, {key: 'ArrowRight'})
      expect(onResizeEnd).toHaveBeenLastCalledWith(expectedRight)

      fireEvent.keyDown(handle, {key: 'ArrowLeft'})
      expect(handle).toHaveAttribute('aria-valuenow', '296')
      fireEvent.keyUp(handle, {key: 'ArrowLeft'})
      expect(onResizeEnd).toHaveBeenLastCalledWith(296)
    },
  )

  it.each([
    {direction: 'ltr', expectedRight: 299},
    {direction: 'rtl', expectedRight: 293},
  ] as const)(
    'uses the frame viewport and $direction direction for responsive resizing',
    ({direction, expectedRight}) => {
      vi.stubGlobal('innerWidth', 1440)
      const frame = document.createElement('iframe')
      document.body.append(frame)
      const frameDocument = frame.contentDocument
      const frameWindow = frame.contentWindow
      if (!frameDocument || !frameWindow) throw new Error('Expected an accessible frame')
      Object.defineProperty(frameWindow, 'innerWidth', {configurable: true, value: 1024})
      const container = frameDocument.createElement('div')
      frameDocument.body.append(container)
      const onResizeEnd = vi.fn()
      const {unmount} = render(
        <PageLayout>
          <PageLayout.Pane position={{regular: 'start', wide: 'end'}} resizable onResizeEnd={onResizeEnd}>
            Pane
          </PageLayout.Pane>
        </PageLayout>,
        {container},
      )
      try {
        const handle = within(container).getByRole('slider')
        handle.style.direction = direction
        fireEvent.keyDown(handle, {key: 'ArrowRight'})
        expect(handle).toHaveAttribute('aria-valuenow', String(expectedRight))
        expect(handle).toHaveAttribute('aria-valuemax', '513')
        fireEvent.keyUp(handle, {key: 'ArrowRight'})
        expect(onResizeEnd).toHaveBeenLastCalledWith(expectedRight)
      } finally {
        unmount()
        frame.remove()
        vi.unstubAllGlobals()
      }
    },
  )

  it.each(['start', 'end'] as const)('preserves vertical key behavior for a %s pane in RTL', position => {
    const onResizeEnd = vi.fn()
    render(
      <PageLayout>
        <PageLayout.Pane position={position} resizable onResizeEnd={onResizeEnd}>
          Pane
        </PageLayout.Pane>
      </PageLayout>,
    )
    const handle = screen.getByRole('slider')
    handle.style.direction = 'rtl'
    fireEvent.keyDown(handle, {key: 'ArrowUp'})
    const expected = position === 'start' ? 299 : 293
    expect(handle).toHaveAttribute('aria-valuenow', String(expected))
    fireEvent.keyUp(handle, {key: 'ArrowUp'})
    expect(onResizeEnd).toHaveBeenLastCalledWith(expected)
    fireEvent.keyDown(handle, {key: 'ArrowDown'})
    expect(handle).toHaveAttribute('aria-valuenow', '296')
    fireEvent.keyUp(handle, {key: 'ArrowDown'})
    expect(onResizeEnd).toHaveBeenLastCalledWith(296)
  })

  it('marks the pane and main content during keyboard resizing', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane resizable>Pane</PageLayout.Pane>
        <PageLayout.Content>Main</PageLayout.Content>
      </PageLayout>,
    )
    const pane = container.querySelector('[data-component="PageLayout.Pane"]')
    const content = screen.getByRole('main')
    const handle = screen.getByRole('slider')
    expect(pane).not.toHaveAttribute('data-dragging')
    expect(content).not.toHaveAttribute('data-dragging')

    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    expect(pane).toHaveAttribute('data-dragging', 'true')
    expect(content).toHaveAttribute('data-dragging', 'true')
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(pane).not.toHaveAttribute('data-dragging')
    expect(content).not.toHaveAttribute('data-dragging')
  })

  it('marks the sidebar and page wrapper during keyboard resizing', () => {
    const {container} = render(
      <PageLayout wrapperClassName="page-wrapper">
        <PageLayout.Sidebar resizable>Sidebar</PageLayout.Sidebar>
        <PageLayout.Content>Main</PageLayout.Content>
      </PageLayout>,
    )
    const sidebar = container.querySelector('[data-component="PageLayout.Sidebar"]')
    const wrapper = container.querySelector('.page-wrapper')
    const handle = screen.getByRole('slider')
    expect(sidebar).not.toHaveAttribute('data-dragging')
    expect(wrapper).not.toHaveAttribute('data-dragging')

    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    expect(sidebar).toHaveAttribute('data-dragging', 'true')
    expect(wrapper).toHaveAttribute('data-dragging', 'true')
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(sidebar).not.toHaveAttribute('data-dragging')
    expect(wrapper).not.toHaveAttribute('data-dragging')
  })

  it('keeps resize targets isolated between nested page layouts', () => {
    const {container} = render(
      <PageLayout data-testid="outer-layout">
        <PageLayout.Pane resizable>Outer pane</PageLayout.Pane>
        <PageLayout.Content as="section" aria-label="Outer content">
          <PageLayout data-testid="inner-layout">
            <PageLayout.Pane resizable>Inner pane</PageLayout.Pane>
            <PageLayout.Content as="section" aria-label="Inner content">
              Inner content
            </PageLayout.Content>
          </PageLayout>
        </PageLayout.Content>
      </PageLayout>,
    )
    const [outerPane, innerPane] = container.querySelectorAll('[data-component="PageLayout.Pane"]')
    const outerContent = screen.getByRole('region', {name: 'Outer content'})
    const innerContent = screen.getByRole('region', {name: 'Inner content'})
    const innerHandle = within(screen.getByTestId('inner-layout')).getByRole('slider')

    fireEvent.keyDown(innerHandle, {key: 'ArrowRight'})
    expect(innerPane).toHaveAttribute('data-dragging', 'true')
    expect(innerContent).toHaveAttribute('data-dragging', 'true')
    expect(outerPane).not.toHaveAttribute('data-dragging')
    expect(outerContent).not.toHaveAttribute('data-dragging')
    fireEvent.keyUp(innerHandle, {key: 'ArrowRight'})
    expect(innerPane).not.toHaveAttribute('data-dragging')
    expect(innerContent).not.toHaveAttribute('data-dragging')
  })

  it('keeps the content ref attached across rerenders while supplying resize targets', () => {
    const contentRef = vi.fn()
    const layout = (text: string) => (
      <PageLayout>
        <PageLayout.Pane resizable>Pane</PageLayout.Pane>
        <PageLayout.Content ref={contentRef}>{text}</PageLayout.Content>
      </PageLayout>
    )
    const {rerender, unmount} = render(layout('First'))
    const content = screen.getByRole('main')
    expect(contentRef).toHaveBeenLastCalledWith(content)
    contentRef.mockClear()

    rerender(layout('Second'))
    expect(contentRef).not.toHaveBeenCalled()
    expect(screen.getByRole('main')).toBe(content)
    unmount()
    expect(contentRef).toHaveBeenCalledExactlyOnceWith(null)
  })

  it('hydrates a resizable layout and marks its content on interaction', async () => {
    const layout = (
      <PageLayout>
        <PageLayout.Pane resizable currentWidth={296} onResizeEnd={() => {}}>
          Pane
        </PageLayout.Pane>
        <PageLayout.Content>Main</PageLayout.Content>
      </PageLayout>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(layout)
    document.body.append(container)
    const content = within(container).getByRole('main')
    expect(content).not.toHaveAttribute('data-dragging')
    let root: ReturnType<typeof hydrateRoot>
    await act(async () => {
      root = hydrateRoot(container, layout)
    })
    const handle = within(container).getByRole('slider')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    expect(content).toHaveAttribute('data-dragging', 'true')
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(content).not.toHaveAttribute('data-dragging')
    act(() => root.unmount())
    container.remove()
  })

  it('hydrates a responsive pane at the current viewport width', async () => {
    vi.stubGlobal('innerWidth', 800)
    const layout = (
      <PageLayout>
        <PageLayout.Pane width="medium">Pane</PageLayout.Pane>
        <PageLayout.Content>Main</PageLayout.Content>
      </PageLayout>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(layout)
    document.body.append(container)
    const pane = container.querySelector('[data-component="PageLayout.Pane"]')
    expect(pane).toHaveStyle('--pane-width: 296px')
    let root: ReturnType<typeof hydrateRoot>
    await act(async () => {
      root = hydrateRoot(container, layout)
    })
    expect(pane).toHaveStyle('--pane-width: 256px')
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  })

  it('keeps the resizable divider visible and uses the regular position below the named wide range', () => {
    const originalInnerWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', {configurable: true, value: 1200})
    const onResizeEnd = vi.fn()
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane position={{narrow: 'end', regular: 'start', wide: 'end'}} resizable onResizeEnd={onResizeEnd}>
          Pane
        </PageLayout.Pane>
      </PageLayout>,
    )
    const handle = container.querySelector('[role="slider"]') as HTMLElement
    const divider = handle.parentElement
    expect(divider).toHaveClass('primer:md:block', 'primer:md:w-px', 'primer:md:order-last')
    expect(divider).not.toHaveClass('primer:md:hidden')

    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(onResizeEnd).toHaveBeenLastCalledWith(299)
    Object.defineProperty(window, 'innerWidth', {configurable: true, value: originalInnerWidth})
  })

  it('uses full-height filled vertical dividers', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane divider={{regular: 'filled'}}>Pane</PageLayout.Pane>
      </PageLayout>,
    )
    const pane = container.querySelector('[data-component="PageLayout.Pane"]')
    const dividers = pane?.parentElement?.querySelectorAll(':scope > div[aria-hidden="true"]') ?? []
    expect(dividers[0]).toHaveClass(
      'primer:self-stretch',
      'primer:md:block',
      'primer:md:w-2',
      'primer:md:border-x',
      'primer:2xl:w-2',
    )
    expect(dividers[0]).not.toHaveClass('primer:md:h-px')
  })

  it('accepts a region prop so a custom component can fill a region without a marker', () => {
    const CustomSidebar = ({children}: {children?: React.ReactNode}) => <div data-testid="custom">{children}</div>

    render(
      <PageLayout sidebar={<CustomSidebar>side</CustomSidebar>}>
        <PageLayout.Content>content</PageLayout.Content>
      </PageLayout>,
    )

    expect(screen.getByTestId('custom')).toHaveTextContent('side')
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('prefers a region prop over a matching child', () => {
    render(
      <PageLayout header={<div data-testid="from-prop">prop</div>}>
        <PageLayout.Header>from child</PageLayout.Header>
        <PageLayout.Content>content</PageLayout.Content>
      </PageLayout>,
    )

    expect(screen.getByTestId('from-prop')).toBeInTheDocument()
    expect(screen.queryByText('from child')).not.toBeInTheDocument()
  })

  it('makes an overflowing pane a focusable, labelled region', () => {
    const restore = mockOverflow()
    try {
      render(
        <PageLayout>
          <PageLayout.Content>Main</PageLayout.Content>
          <PageLayout.Pane aria-label="Filters">Pane</PageLayout.Pane>
        </PageLayout>,
      )
      const region = screen.getByRole('region', {name: 'Filters'})
      expect(region).toHaveAttribute('tabindex', '0')
      expect(region).toHaveTextContent('Pane')
    } finally {
      restore()
    }
  })

  it.each(['Pane', 'Sidebar'] as const)('retains a focused %s region when overflow ends', async part => {
    const Component = PageLayout[part]
    const {container} = render(
      <PageLayout>
        <Component aria-label="Filters">
          <input aria-label="Filter" />
        </Component>
        <PageLayout.Content>Main</PageLayout.Content>
      </PageLayout>,
    )
    const region = container.querySelector<HTMLElement>(`[data-component="PageLayout.${part}"]`)
    if (!region) throw new Error('Expected the layout region')
    Object.defineProperties(region, {
      clientHeight: {configurable: true, value: 100},
      scrollHeight: {configurable: true, value: 200},
    })
    await act(async () => region.setAttribute('data-overflow-test', 'present'))
    expect(screen.getByRole('region', {name: 'Filters'})).toBe(region)
    act(() => region.focus())
    expect(region).toHaveFocus()

    Object.defineProperty(region, 'scrollHeight', {configurable: true, value: 100})
    await act(async () => region.setAttribute('data-overflow-test', 'absent'))
    expect(region).toHaveFocus()
    expect(region).toHaveAttribute('role', 'region')
    expect(region).toHaveAttribute('tabindex', '0')
    expect(region).toHaveAttribute('aria-label', 'Filters')

    act(() => screen.getByRole('textbox', {name: 'Filter'}).focus())
    expect(region).not.toHaveAttribute('role')
    expect(region).not.toHaveAttribute('tabindex')
    expect(region).not.toHaveAttribute('aria-label')
  })
})
