import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import ButtonGroup from './ButtonGroup'
import {createRef} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {implementsClassName} from '../utils/testing'
import classes from './ButtonGroup.module.css'

describe('ButtonGroup', () => {
  implementsClassName(ButtonGroup, classes.ButtonGroup)

  it('renders a <div>', () => {
    render(<ButtonGroup data-testid="button-group" />)
    expect(page.getByTestId('button-group').element().tagName).toBe('DIV')
  })

  it('renders data-component attribute', async () => {
    const {container} = render(<ButtonGroup />)
    await expect.element(container.querySelector<HTMLElement>('[data-component="ButtonGroup"]')).toBeInTheDocument()
  })

  it('should respect role prop', async () => {
    render(<ButtonGroup role="toolbar" />)
    await expect.element(page.getByRole('toolbar')).toBeInTheDocument()
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
