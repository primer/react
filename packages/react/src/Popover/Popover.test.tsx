import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
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
    it(`renders correctly for a caret position of ${pos}`, async () => {
      const element = (
        <Popover caret={pos} open>
          <Popover.Content>Hello!</Popover.Content>
        </Popover>
      )

      render(element)
      const popover = page.getByText('Hello!', {exact: true}).element().parentElement
      if (!popover) {
        throw new Error('Expected Popover parent')
      }
      await expect.element(popover).toHaveAttribute('data-component', 'Popover')
      await expect.element(popover).toHaveAttribute('data-caret', pos)
    })
  }

  it('renders data-component attributes for Popover and Popover.Content', async () => {
    render(<Popover data-testid="popover" />)
    render(<Popover.Content data-testid="content" />)

    await expect.element(page.getByTestId('popover')).toHaveAttribute('data-component', 'Popover')
    await expect.element(page.getByTestId('content')).toHaveAttribute('data-component', 'Popover.Content')
  })

  it('renders both elements as a <div>', () => {
    render(<Popover data-testid="popover" />)
    render(<Popover.Content data-testid="content" />)
    expect(page.getByTestId('popover').element().tagName).toEqual('DIV')
    expect(page.getByTestId('content').element().tagName).toEqual('DIV')
  })

  it('calls onEscape when the popover is open', async () => {
    const onEscape = vi.fn()
    render(
      <Popover open>
        <Popover.Content onEscape={onEscape} />
      </Popover>,
    )

    await userEvent.keyboard('{Escape}')

    expect(onEscape).toHaveBeenCalledExactlyOnceWith(expect.any(KeyboardEvent))
  })

  it('does not call onEscape when the popover is closed', async () => {
    const onEscape = vi.fn()
    render(
      <Popover open={false}>
        <Popover.Content onEscape={onEscape} />
      </Popover>,
    )

    await userEvent.keyboard('{Escape}')

    expect(onEscape).not.toHaveBeenCalled()
  })

  it('prevents lower overlays from handling Escape', async () => {
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
    await userEvent.keyboard('{Escape}')

    expect(onEscape).toHaveBeenCalledOnce()
    expect(onParentEscape).not.toHaveBeenCalled()
  })
})
