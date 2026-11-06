import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {describe, expect, it} from 'vitest'
import Flash from '../Flash'
import {implementsClassName} from '../../utils/testing'
import classes from '../Flash.module.css'

describe('Flash', () => {
  implementsClassName(Flash, classes.Flash)
  it('should support the `full` prop', async () => {
    render(
      <>
        <Flash data-testid="full" full />
        <Flash data-testid="no-full" />
      </>,
    )
    await expect.element(page.getByTestId('full')).toHaveAttribute('data-full', '')
    await expect.element(page.getByTestId('no-full')).not.toHaveAttribute('data-full')
  })

  it('should support the `variant` prop', async () => {
    render(
      <>
        <Flash data-testid="danger" variant="danger" />
        <Flash data-testid="success" variant="success" />
        <Flash data-testid="warning" variant="warning" />
        <Flash data-testid="default" variant="default" />
      </>,
    )

    await expect.element(page.getByTestId('danger')).toHaveAttribute('data-variant', 'danger')
    await expect.element(page.getByTestId('success')).toHaveAttribute('data-variant', 'success')
    await expect.element(page.getByTestId('warning')).toHaveAttribute('data-variant', 'warning')
    await expect.element(page.getByTestId('default')).toHaveAttribute('data-variant', 'default')
  })

  it('should spread props to the outermost element', () => {
    const {container} = render(<Flash data-testid="test" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'test')
  })

  it('renders data-component attribute', async () => {
    render(<Flash data-testid="flash" />)
    await expect.element(page.getByTestId('flash')).toHaveAttribute('data-component', 'Flash')
  })
})
