import {render, screen} from '@testing-library/react'
import ButtonGroup from './ButtonGroup'
import {createRef} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {implementsClassName} from '../utils/testing'
import classes from './ButtonGroup.module.css'

describe('ButtonGroup', () => {
  implementsClassName(ButtonGroup, classes.ButtonGroup)

  it('renders a <div>', () => {
    const container = render(<ButtonGroup data-testid="button-group" />)
    expect(container.getByTestId('button-group').tagName).toBe('DIV')
  })

  it('renders data-component attribute', () => {
    const {container} = render(<ButtonGroup />)
    expect(container.querySelector('[data-component="ButtonGroup"]')).toBeInTheDocument()
  })

  it('should respect role prop', () => {
    render(<ButtonGroup role="toolbar" />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })
})

describe('ButtonGroup forwarded ref', () => {
  it('forwards a ref object to the element', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <ButtonGroup ref={ref}>
        <button type="button">A</button>
      </ButtonGroup>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('calls a callback ref with the element', () => {
    const refCallback = vi.fn()
    render(
      <ButtonGroup ref={refCallback}>
        <button type="button">A</button>
      </ButtonGroup>,
    )
    expect(refCallback.mock.calls.some(([el]) => el instanceof HTMLDivElement)).toBe(true)
  })
})
