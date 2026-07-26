import React from 'react'
import {cleanup, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {SegmentedControl} from './SegmentedControl'

afterEach(cleanup)

describe('SegmentedControl', () => {
  it('uses toggle group keyboard behavior and forwards props and refs', async () => {
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
    expect(canvas.getByTestId('control')).toHaveClass('h-7', 'w-full', 'md:w-auto', '2xl:w-full')
    expect(canvas.getByRole('button', {name: 'List'})).toHaveClass('[&:has(.segmentedControl-text:empty)]:w-8')
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
      '[&_.segmentedControl-text]:hidden',
      'md:[&_.segmentedControl-text]:inline',
      '2xl:[&_.segmentedControl-text]:hidden',
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

    await user.click(screen.getAllByRole('button', {name: 'View'})[0])
    await user.click(await screen.findByRole('menuitemradio', {name: 'Raw'}))

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
})
