import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, {createRef} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {useRender} from '../useRender'

describe('useRender', () => {
  it('renders the default element with the provided props', () => {
    function Example() {
      return useRender({
        defaultTagName: 'button',
        props: {
          children: 'Default element',
          type: 'button',
        },
      })
    }

    render(<Example />)

    expect(screen.getByRole('button', {name: 'Default element'})).toHaveAttribute('type', 'button')
  })

  it('merges props and refs with a rendered element', async () => {
    const internalClick = vi.fn()
    const renderedClick = vi.fn()
    const forwardedRef = createRef<HTMLButtonElement>()
    const renderedRef = createRef<HTMLButtonElement>()

    function Example() {
      return useRender({
        defaultTagName: 'button',
        props: {
          children: 'Default content',
          className: 'internal',
          onClick: internalClick,
          style: {color: 'red', display: 'block'},
          type: 'button',
        },
        ref: forwardedRef,
        render: (
          <button className="rendered" onClick={renderedClick} ref={renderedRef} style={{color: 'blue'}} type="button">
            Rendered element
          </button>
        ),
      })
    }

    render(<Example />)

    const button = screen.getByRole('button', {name: 'Rendered element'})
    expect(button).toHaveClass('internal', 'rendered')
    expect(button).toHaveStyle({display: 'block'})
    expect(button.style.color).toBe('blue')
    expect(forwardedRef.current).toBe(button)
    expect(renderedRef.current).toBe(button)

    await userEvent.click(button)

    expect(internalClick).toHaveBeenCalledOnce()
    expect(renderedClick).toHaveBeenCalledOnce()
  })

  it('passes props and state to a render function', () => {
    function Example() {
      return useRender({
        defaultTagName: 'button',
        props: {
          children: 'Render function',
          type: 'button',
        },
        render: (props, state) => <button type="button" {...props} data-active={state.active} />,
        state: {active: true},
      })
    }

    render(<Example />)

    expect(screen.getByRole('button', {name: 'Render function'})).toHaveAttribute('data-active', 'true')
  })
})
