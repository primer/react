import React from 'react'
import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {EyeIcon, PlusIcon} from '@primer/octicons-react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {SegmentedControl} from './SegmentedControl'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const openTooltip = () => document.querySelector('[data-component="Tooltip.Content"][data-open]')

describe('SegmentedControl', () => {
  it('selects on click and forwards props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    const onValueChange = vi.fn()
    render(
      <SegmentedControl ref={ref} defaultValue={['list']} onValueChange={onValueChange} data-testid="control">
        <SegmentedControl.Button value="list">List</SegmentedControl.Button>
        <SegmentedControl.Button value="grid">Grid</SegmentedControl.Button>
      </SegmentedControl>,
    )
    await user.click(screen.getByRole('button', {name: 'Grid'}))
    expect(onValueChange).toHaveBeenLastCalledWith(['grid'], expect.anything())
    expect(ref.current).toBe(screen.getByTestId('control'))
    expect(screen.getByRole('button', {name: 'Grid'})).toHaveAttribute('data-pressed')
  })

  it('puts every enabled segment in the Tab order and ignores arrow keys, like Primer React', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    const onValueChange = vi.fn()
    render(
      <>
        <button type="button">Before</button>
        <SegmentedControl
          aria-label="File view"
          defaultValue={['preview']}
          onKeyDown={onKeyDown}
          onValueChange={onValueChange}
        >
          <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
          <SegmentedControl.Button value="raw" disabled>
            Raw
          </SegmentedControl.Button>
          <SegmentedControl.IconButton value="blame" aria-label="Blame" icon={EyeIcon} />
        </SegmentedControl>
        <button type="button">After</button>
      </>,
    )
    const preview = screen.getByRole('button', {name: 'Preview'})
    const blame = screen.getByRole('button', {name: 'Blame'})

    expect(preview).toHaveAttribute('tabindex', '0')
    expect(blame).toHaveAttribute('tabindex', '0')

    await user.click(screen.getByRole('button', {name: 'Before'}))
    await user.tab()
    expect(preview).toHaveFocus()
    await user.tab()
    expect(blame).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', {name: 'After'})).toHaveFocus()
    await user.tab({shift: true})
    expect(blame).toHaveFocus()

    for (const key of ['{ArrowLeft}', '{ArrowRight}', '{Home}', '{End}']) {
      await user.keyboard(key)
      expect(blame).toHaveFocus()
    }
    expect(onKeyDown).toHaveBeenCalled()
    expect(onValueChange).not.toHaveBeenCalled()

    await user.keyboard('{Enter}')
    expect(onValueChange).toHaveBeenLastCalledWith(['blame'], expect.anything())
  })

  it('supports Primer sizing, responsive full width, and icon-only geometry', () => {
    const {container} = render(
      <SegmentedControl
        aria-label="View"
        data-testid="control"
        fullWidth={{narrow: true, regular: false, wide: true}}
        size="small"
      >
        <SegmentedControl.IconButton value="list" aria-label="List" icon={() => <svg aria-hidden="true" />} />
        <SegmentedControl.Button value="grid">Grid</SegmentedControl.Button>
      </SegmentedControl>,
    )

    const canvas = within(container)
    expect(canvas.getByTestId('control')).toHaveAttribute('data-size', 'small')
    expect(canvas.getByTestId('control')).toHaveClass(
      'primer:h-7',
      'primer:w-full',
      'primer:md:w-auto',
      'primer:2xl:w-full',
    )
    expect(canvas.getByRole('button', {name: 'List'})).toHaveClass(
      'primer:w-[var(--segmented-control-icon-width,var(--control-medium-size))]',
    )
  })

  it('supports responsive label hiding', () => {
    render(
      <SegmentedControl
        aria-label="View"
        defaultValue={['preview']}
        variant={{narrow: 'hideLabels', regular: 'default', wide: 'hideLabels'}}
      >
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
      </SegmentedControl>,
    )

    expect(screen.getByRole('group')).toHaveClass(
      'primer:[&_.segmentedControl-text]:hidden',
      'primer:md:[&_.segmentedControl-text]:block',
      'primer:2xl:[&_.segmentedControl-text]:hidden',
    )
  })

  it('selects a value through the responsive dropdown', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <SegmentedControl
        aria-label="View"
        defaultValue={['preview']}
        onValueChange={onValueChange}
        variant={{narrow: 'dropdown', regular: 'default', wide: 'default'}}
      >
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
        <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
      </SegmentedControl>,
    )

    await user.click(screen.getByRole('button', {name: 'Preview, View'}))
    expect(await screen.findByRole('menuitemradio', {name: 'Preview'})).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', {name: 'Raw'})).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('menuitemradio', {name: 'Preview'})).toHaveAttribute('data-selected')
    await user.click(screen.getByRole('menuitemradio', {name: 'Raw'}))

    expect(screen.getByRole('button', {name: 'Raw'})).toHaveAttribute('aria-pressed', 'true')
    expect(onValueChange).toHaveBeenCalledWith(['raw'], expect.any(Object))
  })

  it('renders buttons that are grouped in a fragment', () => {
    render(
      <SegmentedControl aria-label="View">
        <>
          <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
          <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
        </>
      </SegmentedControl>,
    )

    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('marks disabled segments with only the native disabled attribute', () => {
    render(
      <SegmentedControl aria-label="View">
        <SegmentedControl.Button value="preview" disabled>
          Preview
        </SegmentedControl.Button>
        <SegmentedControl.IconButton value="raw" aria-label="Raw" icon={() => null} disabled />
      </SegmentedControl>,
    )

    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled()
      expect(button).not.toHaveAttribute('aria-disabled')
    }
  })

  it('renders the subtle variant', () => {
    render(
      <SegmentedControl aria-label="File view" variant="subtle">
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
      </SegmentedControl>,
    )

    expect(screen.getByRole('group')).toHaveClass(
      'primer:border-0',
      'primer:bg-transparent',
      'primer:[--segmented-control-knob-display:none]',
      'primer:[--segmented-control-button-bgColor-hover:var(--button-invisible-bgColor-hover)]',
    )
  })

  it('renders the subtle variant responsively', () => {
    render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'default', regular: 'subtle'}}>
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
      </SegmentedControl>,
    )

    const group = screen.getByRole('group')
    expect(group).toHaveClass(
      'primer:border-thin',
      'primer:md:border-0',
      'primer:md:bg-transparent',
      'primer:2xl:border-thin',
    )
    expect(group).not.toHaveClass('primer:border-0')
  })

  it('renders dividers without including them in selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const {container} = render(
      <SegmentedControl
        aria-label="File view"
        defaultValue={['preview']}
        onValueChange={onValueChange}
        variant="subtle"
      >
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
        <SegmentedControl.Divider />
        <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
      </SegmentedControl>,
    )

    const divider = container.querySelector('[data-component="SegmentedControl.Divider"]')
    expect(divider).toHaveAttribute('aria-hidden', 'true')
    expect(divider?.parentElement).toBe(screen.getByRole('group'))
    expect(screen.getAllByRole('button')).toHaveLength(2)
    await user.click(screen.getByRole('button', {name: 'Raw'}))
    expect(onValueChange).toHaveBeenCalledWith(['raw'], expect.anything())
  })

  it('renders dividers in the dropdown menu', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <SegmentedControl
        aria-label="File view"
        defaultValue={['preview']}
        onValueChange={onValueChange}
        variant={{narrow: 'dropdown', regular: 'subtle', wide: 'subtle'}}
      >
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
        <SegmentedControl.Divider />
        <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
      </SegmentedControl>,
    )

    await user.click(screen.getByRole('button', {name: 'Preview, File view'}))
    const items = await screen.findAllByRole('menuitemradio')
    expect(document.querySelector('[data-component="ActionMenu.Divider"]')).toBeInTheDocument()
    await user.click(items[1])
    expect(onValueChange).toHaveBeenCalledWith(['raw'], expect.anything())
  })

  it('keeps segments as direct siblings so separators and the knob can target them', () => {
    render(
      <SegmentedControl aria-label="File view" defaultValue={['preview']}>
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
        <SegmentedControl.IconButton aria-label="Raw" description="Show raw file" icon={PlusIcon} value="raw" />
      </SegmentedControl>,
    )

    const group = screen.getByRole('group')
    expect(Array.from(group.children).map(child => child.getAttribute('data-component'))).toEqual([
      'SegmentedControl.Button',
      'SegmentedControl.IconButton',
    ])
  })

  it('applies a className function through the tooltip trigger', () => {
    render(
      <SegmentedControl aria-label="File view" defaultValue={['preview']}>
        <SegmentedControl.Button className={state => (state.pressed ? 'is-pressed' : 'is-idle')} value="preview">
          Preview
        </SegmentedControl.Button>
        <SegmentedControl.Button className={state => (state.pressed ? 'is-pressed' : 'is-idle')} value="raw">
          Raw
        </SegmentedControl.Button>
      </SegmentedControl>,
    )

    expect(screen.getByRole('button', {name: 'Preview'})).toHaveClass('is-pressed', 'primer:grow')
    expect(screen.getByRole('button', {name: 'Raw'})).toHaveClass('is-idle')
  })

  it('merges a consumer description with the icon button tooltip', () => {
    render(
      <>
        <span id="raw-note">Opens the source</span>
        <SegmentedControl aria-label="File view">
          <SegmentedControl.IconButton
            aria-describedby="raw-note"
            aria-label="Raw"
            description="Show the raw file"
            icon={PlusIcon}
            value="raw"
          />
        </SegmentedControl>
      </>,
    )

    expect(screen.getByRole('button', {name: 'Raw'})).toHaveAccessibleDescription('Opens the source Show the raw file')
  })

  it('names icon buttons with their label and exposes the description', async () => {
    const user = userEvent.setup()
    render(
      <SegmentedControl aria-label="File view">
        <SegmentedControl.IconButton aria-label="Preview" icon={PlusIcon} value="preview" />
        <SegmentedControl.IconButton aria-label="Raw" description="Show the raw file" icon={PlusIcon} value="raw" />
      </SegmentedControl>,
    )

    const raw = screen.getByRole('button', {name: 'Raw'})
    const preview = screen.getByRole('button', {name: 'Preview'})
    expect(raw).toHaveAttribute('data-component', 'SegmentedControl.IconButton')
    expect(raw).toHaveAccessibleDescription('Show the raw file')
    for (const button of [preview, raw]) {
      const owner = button.getAttribute('data-tooltip-trigger')
      expect(owner).toBeTruthy()
      expect(
        Array.from(document.querySelectorAll('[data-tooltip-popup]')).map(popup =>
          popup.getAttribute('data-tooltip-popup'),
        ),
      ).toContain(owner)
    }
    expect(preview.getAttribute('data-tooltip-trigger')).not.toBe(raw.getAttribute('data-tooltip-trigger'))
    await user.hover(preview)
    await waitFor(() => expect(openTooltip()).toHaveTextContent('Preview'))
  })

  it('includes the count in the accessible name', () => {
    render(
      <SegmentedControl aria-label="Issues">
        <SegmentedControl.Button count={5} value="all">
          All
        </SegmentedControl.Button>
      </SegmentedControl>,
    )

    // jsdom trims the visually hidden counter's leading space that browsers keep.
    expect(screen.getByRole('button', {name: /^All\s?\(5\)$/})).toBeInTheDocument()
  })

  it('shows a counter beside an icon button icon', () => {
    render(
      <SegmentedControl aria-label="Issues">
        <SegmentedControl.IconButton aria-label="Open" count={3} icon={EyeIcon} value="open" />
      </SegmentedControl>,
    )

    const button = screen.getByRole('button', {name: 'Open'})
    expect(button).toHaveTextContent('3')
    expect(button).toHaveClass('primer:min-w-[var(--segmented-control-icon-width,var(--control-medium-size))]')
  })

  it('shows the full label in a tooltip only when it is truncated', async () => {
    const user = userEvent.setup()
    let notifyResize: (() => void) | undefined
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          notifyResize = () => callback([], this as unknown as ResizeObserver)
        }
        disconnect() {}
        observe() {}
        unobserve() {}
      },
    )
    render(
      <SegmentedControl aria-label="File view">
        <SegmentedControl.Button value="preview">Preview changes before publishing</SegmentedControl.Button>
      </SegmentedControl>,
    )

    const button = screen.getByRole('button', {name: 'Preview changes before publishing'})
    expect(button).not.toHaveAttribute('data-tooltip-trigger')
    await user.hover(button)
    await new Promise(resolve => setTimeout(resolve, 700))
    expect(openTooltip()).toBeNull()
    await user.unhover(button)

    const label = button.querySelector('.segmentedControl-text') as HTMLElement
    vi.spyOn(label, 'scrollWidth', 'get').mockReturnValue(200)
    vi.spyOn(label, 'clientWidth', 'get').mockReturnValue(80)
    act(() => notifyResize?.())
    await user.hover(button)
    await waitFor(() => expect(openTooltip()).toHaveTextContent('Preview changes before publishing'))
    expect(button.getAttribute('data-tooltip-trigger')).toBeTruthy()
    expect(openTooltip()?.getAttribute('data-tooltip-popup')).toBe(button.getAttribute('data-tooltip-trigger'))
  })

  it('renders the action as an invisible icon button beside the segments', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <SegmentedControl aria-label="Issues" defaultValue={['all']} fullWidth size="small">
        <SegmentedControl.Button value="all">All</SegmentedControl.Button>
        <SegmentedControl.Button value="active">Active</SegmentedControl.Button>
        <SegmentedControl.Action icon={PlusIcon} label="Add view" onClick={onClick} />
      </SegmentedControl>,
    )

    const action = screen.getByRole('button', {name: 'Add view'})
    expect(action.closest('[data-component="SegmentedControl.Action"]')).toBeInTheDocument()
    expect(action).toHaveClass('primer:size-[max(28px,calc(var(--base-size-4)*7))]')
    const wrapper = screen.getByRole('group').parentElement
    expect(wrapper).toHaveClass('primer:w-full')
    expect(screen.getByRole('group')).toHaveClass('primer:flex-auto', 'primer:min-w-0')
    await user.click(action)
    expect(onClick).toHaveBeenCalledExactlyOnceWith()
  })

  it('accepts the action as an element prop', () => {
    render(
      <SegmentedControl action={<SegmentedControl.Action icon={PlusIcon} label="Add view" />} aria-label="Issues">
        <SegmentedControl.Button value="all">All</SegmentedControl.Button>
      </SegmentedControl>,
    )

    expect(screen.getByRole('button', {name: 'Add view'})).toBeInTheDocument()
    expect(screen.getByRole('group').contains(screen.getByRole('button', {name: 'Add view'}))).toBe(false)
  })

  it('renders the action as the last menu item after a divider and keeps the menu open', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <SegmentedControl aria-label="File view" defaultValue={['preview']} variant={{narrow: 'dropdown'}}>
        <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
        <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
        <SegmentedControl.Action icon={PlusIcon} label="Add view" onClick={onClick} />
      </SegmentedControl>,
    )

    await user.click(screen.getByRole('button', {name: 'Preview, File view'}))
    const menuAction = await screen.findByRole('menuitem', {name: 'Add view'})
    expect(menuAction.previousElementSibling).toHaveAttribute('data-component', 'ActionMenu.Divider')
    await user.click(menuAction)
    expect(onClick).toHaveBeenCalledExactlyOnceWith()
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('disables the knob transition while the number of segments changes', () => {
    let frame: FrameRequestCallback | undefined
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
      frame = callback
      return 1
    })
    const {rerender} = render(
      <SegmentedControl aria-label="File view" defaultValue={['all']}>
        <SegmentedControl.Button value="all">All</SegmentedControl.Button>
        <SegmentedControl.Button value="active">Active</SegmentedControl.Button>
        {false}
      </SegmentedControl>,
    )
    const group = screen.getByRole('group')
    expect(group).not.toHaveAttribute('data-disable-knob-transition')

    rerender(
      <SegmentedControl aria-label="File view" defaultValue={['all']}>
        <SegmentedControl.Button value="all">All</SegmentedControl.Button>
        <SegmentedControl.Button value="active">Active</SegmentedControl.Button>
        <SegmentedControl.Button value="new">New view</SegmentedControl.Button>
      </SegmentedControl>,
    )

    expect(group).toHaveAttribute('data-disable-knob-transition', '')
    act(() => frame?.(0))
    expect(group).not.toHaveAttribute('data-disable-knob-transition')
  })

  it('routes ids and ARIA references through segment tooltips', async () => {
    render(
      <>
        <p id="view-note">Changes how the file is shown</p>
        <SegmentedControl aria-label="File view" defaultValue={['preview']}>
          <SegmentedControl.Button id="preview-segment" aria-describedby="view-note" value="preview">
            Preview
          </SegmentedControl.Button>
          <SegmentedControl.IconButton id="raw-segment" aria-label="Raw" icon={EyeIcon} value="raw" />
        </SegmentedControl>
      </>,
    )

    const preview = screen.getByRole('button', {name: 'Preview'})
    expect(preview).toHaveAttribute('id', 'preview-segment')
    expect(preview).toHaveAccessibleDescription('Changes how the file is shown')
    const raw = screen.getByRole('button', {name: 'Raw'})
    expect(raw).toHaveAttribute('id', 'raw-segment')
    fireEvent.keyDown(document.body, {key: 'Tab'})
    act(() => raw.focus())
    await waitFor(() => expect(raw).toHaveAttribute('data-popup-open'))
  })
})
