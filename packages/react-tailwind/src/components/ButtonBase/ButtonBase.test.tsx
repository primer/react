import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {ButtonBase} from './index'

describe('ButtonBase', () => {
  it('renders Base UI button semantics and forwards its ref and DOM props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <ButtonBase data-testid="base" ref={ref}>
        Save
      </ButtonBase>,
    )

    const button = screen.getByRole('button', {name: 'Save'})
    expect(button).toHaveAttribute('data-component', 'ButtonBase')
    expect(screen.getByTestId('base')).toBe(ref.current)
  })

  it('composes consumer class names, including Base UI state callbacks', () => {
    render(
      <>
        <ButtonBase className="custom">Static</ButtonBase>
        <ButtonBase className={state => (state.disabled ? 'is-disabled' : 'is-enabled')} disabled>
          Callback
        </ButtonBase>
      </>,
    )

    expect(screen.getByRole('button', {name: 'Static'})).toHaveClass('custom')
    expect(screen.getByRole('button', {name: 'Callback'})).toHaveClass('is-disabled')
  })

  it('composes button behavior onto a non-button element with render', () => {
    const onClick = vi.fn()
    render(
      <ButtonBase nativeButton={false} onClick={onClick} render={<span />}>
        Composed
      </ButtonBase>,
    )

    const button = screen.getByRole('button', {name: 'Composed'})
    expect(button.tagName).toBe('SPAN')
    expect(button).toHaveAttribute('tabindex', '0')
    fireEvent.keyDown(button, {key: 'Enter'})
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
