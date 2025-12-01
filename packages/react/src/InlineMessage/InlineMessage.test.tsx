import {render, screen} from '@testing-library/react'
import {describe, expect, it, test} from 'vitest'
import {InfoIcon} from '@primer/octicons-react'
import {InlineMessage} from '../InlineMessage'
import React from 'react'

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

  it('should render leading visual', () => {
    render(
      <>
        <InlineMessage variant="critical" leadingVisual={<InfoIcon data-testid="info-icon" />}>
          test with custom icon
        </InlineMessage>
        <InlineMessage
          variant="critical"
          leadingVisual={React.memo(() => (
            <div data-testid="memo">leadingVisual</div>
          ))}
        >
          test with memo icon
        </InlineMessage>
        <InlineMessage
          variant="critical"
          leadingVisual={React.forwardRef(() => (
            <div data-testid="forward-ref">leadingVisual</div>
          ))}
        >
          test with forward ref icon
        </InlineMessage>
      </>,
    )
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    expect(screen.getByTestId('memo')).toBeInTheDocument()
    expect(screen.getByTestId('forward-ref')).toBeInTheDocument()
  })

  it('should use default icon when `leadingVisual` is not provided', () => {
    const {container} = render(<InlineMessage variant="success">test with default icon</InlineMessage>)
    expect(screen.getByText('test with default icon')).toBeInTheDocument()
    // Default icon should be rendered
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
