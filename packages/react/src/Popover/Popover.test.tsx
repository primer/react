import {describe, expect, it, vi} from 'vitest'
import {fireEvent, render} from '@testing-library/react'
import type {PopoverProps} from '../Popover'
import Popover from '../Popover'
import classes from './Popover.module.css'
import {implementsClassName} from '../utils/testing'
import {useOnEscapePress} from '../hooks'

describe('Popover', () => {
  implementsClassName(Popover, classes.Popover)
  implementsClassName(Popover.Content, classes.PopoverContent)

  const CARET_POSITIONS: PopoverProps['caret'][] = [
    'top',
    'bottom',
    'left',
    'right',
    'bottom-left',
    'bottom-right',
    'top-left',
    'top-right',
    'left-bottom',
    'left-top',
    'right-bottom',
    'right-top',
  ]

  for (const pos of CARET_POSITIONS) {
    it(`renders correctly for a caret position of ${pos}`, () => {
      const element = (
        <Popover caret={pos} open>
          <Popover.Content>Hello!</Popover.Content>
        </Popover>
      )

      const {container} = render(element)
      expect(container.firstChild).toHaveAttribute('data-component', 'Popover')
      expect(container.firstChild).toHaveAttribute('data-caret', pos)
    })
  }

  it('renders data-component attributes for Popover and Popover.Content', () => {
    const {container: popoverContainer} = render(<Popover />)
    const {container: contentContainer} = render(<Popover.Content />)

    expect(popoverContainer.firstChild).toHaveAttribute('data-component', 'Popover')
    expect(contentContainer.firstChild).toHaveAttribute('data-component', 'Popover.Content')
  })

  it('renders both elements as a <div>', () => {
    const {container: popoverContainer} = render(<Popover />)
    const {container: contentContainer} = render(<Popover.Content />)
    expect((popoverContainer.firstChild as Element).tagName).toEqual('DIV')
    expect((contentContainer.firstChild as Element).tagName).toEqual('DIV')
  })

  it('calls onEscape when the popover is open', () => {
    const onEscape = vi.fn()
    render(
      <Popover open>
        <Popover.Content onEscape={onEscape} />
      </Popover>,
    )

    fireEvent.keyDown(document, {key: 'Escape'})

    expect(onEscape).toHaveBeenCalledExactlyOnceWith(expect.any(KeyboardEvent))
  })

  it('does not call onEscape when the popover is closed', () => {
    const onEscape = vi.fn()
    render(
      <Popover open={false}>
        <Popover.Content onEscape={onEscape} />
      </Popover>,
    )

    fireEvent.keyDown(document, {key: 'Escape'})

    expect(onEscape).not.toHaveBeenCalled()
  })

  it('prevents lower overlays from handling Escape', () => {
    const onEscape = vi.fn()
    const onParentEscape = vi.fn()

    const ParentOverlay = () => {
      useOnEscapePress(onParentEscape)

      return (
        <Popover open>
          <Popover.Content onEscape={onEscape} />
        </Popover>
      )
    }

    render(<ParentOverlay />)
    fireEvent.keyDown(document, {key: 'Escape'})

    expect(onEscape).toHaveBeenCalledOnce()
    expect(onParentEscape).not.toHaveBeenCalled()
  })
})
