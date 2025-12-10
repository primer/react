import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Flash from '../Flash'
import {implementsClassName} from '../../utils/testing'
import classes from '../Flash.module.css'

describe('Flash', () => {
  implementsClassName(Flash, classes.Flash)
  it('should support the `full` prop', () => {
    render(
      <>
        <Flash data-testid="full" full />
        <Flash data-testid="no-full" />
      </>,
    )
    expect(screen.getByTestId('full')).toHaveAttribute('data-full', '')
    expect(screen.getByTestId('no-full')).not.toHaveAttribute('data-full')
  })

  it('should support the `variant` prop', () => {
    render(
      <>
        <Flash data-testid="danger" variant="danger" />
        <Flash data-testid="success" variant="success" />
        <Flash data-testid="warning" variant="warning" />
        <Flash data-testid="default" variant="default" />
      </>,
    )

    expect(screen.getByTestId('danger')).toHaveAttribute('data-variant', 'danger')
    expect(screen.getByTestId('success')).toHaveAttribute('data-variant', 'success')
    expect(screen.getByTestId('warning')).toHaveAttribute('data-variant', 'warning')
    expect(screen.getByTestId('default')).toHaveAttribute('data-variant', 'default')
  })

  it('should support `className` on the outermost element', () => {
    const {container} = render(<Flash className="test-class" />)
    expect(container.firstChild).toHaveClass('test-class')
  })

  it('should spread props to the outermost element', () => {
    const {container} = render(<Flash data-testid="test" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'test')
  })
})
