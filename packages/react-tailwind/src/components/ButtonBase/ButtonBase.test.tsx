import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
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

  it('composes button behavior onto another element with render', () => {
    render(
      <ButtonBase
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        render={<a href="#target" />}
      >
        Link
      </ButtonBase>,
    )

    expect(screen.getByRole('link', {name: 'Link'})).toHaveAttribute('href', '#target')
  })
})
