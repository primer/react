import {render, screen} from '@testing-library/react'
import {describe, expect, it, test} from 'vitest'
import {InlineMessage} from '../InlineMessage'

describe('InlineMessage', () => {
  it('should render content passed as `children`', () => {
    render(<InlineMessage variant="success">test contents</InlineMessage>)
    expect(screen.getByText('test contents')).toBeInTheDocument()
  })

  test('forward props to the outermost element', () => {
    const {container} = render(
      <InlineMessage data-testid="test" variant="success">
        test
      </InlineMessage>,
    )
    expect(container.firstChild).toHaveAttribute('data-testid', 'test')
  })

  it('should support `size="small"`', () => {
    render(
      <InlineMessage data-testid="container" size="small" variant="success">
        test
      </InlineMessage>,
    )
    expect(screen.getByTestId('container')).toHaveAttribute('data-size', 'small')
  })

  it('should support `size="medium"`', () => {
    render(
      <InlineMessage data-testid="container" size="medium" variant="success">
        test
      </InlineMessage>,
    )
    expect(screen.getByTestId('container')).toHaveAttribute('data-size', 'medium')
  })

  it('should use `size="medium"` as the default size', () => {
    render(
      <InlineMessage data-testid="container" variant="success">
        test
      </InlineMessage>,
    )
    expect(screen.getByTestId('container')).toHaveAttribute('data-size', 'medium')
  })

  it('should support `variant="critical"`', () => {
    render(
      <InlineMessage data-testid="container" variant="critical">
        test
      </InlineMessage>,
    )
    expect(screen.getByTestId('container')).toHaveAttribute('data-variant', 'critical')
  })

  it('should support `variant="success"`', () => {
    render(
      <InlineMessage data-testid="container" variant="success">
        test
      </InlineMessage>,
    )
    expect(screen.getByTestId('container')).toHaveAttribute('data-variant', 'success')
  })

  it('should support `variant="unavailable"`', () => {
    render(
      <InlineMessage data-testid="container" variant="unavailable">
        test
      </InlineMessage>,
    )
    expect(screen.getByTestId('container')).toHaveAttribute('data-variant', 'unavailable')
  })

  it('should support `variant="warning"`', () => {
    render(
      <InlineMessage data-testid="container" variant="warning">
        test
      </InlineMessage>,
    )
    expect(screen.getByTestId('container')).toHaveAttribute('data-variant', 'warning')
  })
})
