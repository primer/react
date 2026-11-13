import {cleanup, render, screen} from '@testing-library/react'
import {InfoIcon, ShieldLockIcon} from '@primer/octicons-react'
import React from 'react'
import {createPortal} from 'react-dom'
import {afterEach, describe, expect, it} from 'vitest'
import {InlineMessage} from './InlineMessage'

afterEach(cleanup)

describe('InlineMessage', () => {
  it.each([
    {name: 'forwardRef Octicon', visual: InfoIcon},
    {name: 'memo component', visual: React.memo(ShieldLockIcon)},
    {name: 'function component', visual: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />},
  ])('instantiates a $name leading visual', ({visual}) => {
    render(
      <InlineMessage data-testid="message" leadingVisual={visual}>
        Notice
      </InlineMessage>,
    )
    const icon = screen.getByTestId('message').querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveClass('primer:min-h-[calc(var(--inline-message-line-height)*var(--inline-message-font-size))]')
    expect(screen.getByText('Notice')).toBeInTheDocument()
  })

  it('preserves rendered nodes, their props, and explicit removal of the visual', () => {
    const {rerender} = render(
      <InlineMessage leadingVisual={<ShieldLockIcon data-testid="custom-icon" className="custom-icon" size={24} />}>
        Notice
      </InlineMessage>,
    )
    expect(screen.getByTestId('custom-icon')).toHaveAttribute('width', '24')
    expect(screen.getByTestId('custom-icon')).toHaveClass('custom-icon')
    rerender(<InlineMessage leadingVisual={<span data-testid="text-visual">!</span>}>Notice</InlineMessage>)
    expect(screen.getByTestId('text-visual')).toHaveTextContent('!')
    rerender(<InlineMessage leadingVisual={null}>Notice</InlineMessage>)
    expect(screen.getByText('Notice').querySelector('svg')).not.toBeInTheDocument()
  })

  it('retains a portal as rendered content rather than mistaking it for a component', () => {
    render(
      <InlineMessage leadingVisual={createPortal(<span data-testid="portaled-icon">!</span>, document.body)}>
        Notice
      </InlineMessage>,
    )
    expect(screen.getByTestId('portaled-icon')).toHaveTextContent('!')
    expect(screen.getByText('Notice')).toBeInTheDocument()
  })

  it('renders a lazy component visual within the caller suspense boundary', async () => {
    const Icon = React.lazy(async () => ({default: InfoIcon}))
    render(
      <React.Suspense fallback="Loading icon">
        <InlineMessage data-testid="message" leadingVisual={Icon}>
          Notice
        </InlineMessage>
      </React.Suspense>,
    )
    expect((await screen.findByTestId('message')).querySelector('svg')).toBeInTheDocument()
  })

  it('renders the small Primer body scale with a size-appropriate icon', () => {
    render(
      <InlineMessage data-testid="message" size="small" variant="success">
        Saved
      </InlineMessage>,
    )

    expect(screen.getByTestId('message')).toHaveAttribute('data-variant', 'success')
    expect(screen.getByTestId('message')).toHaveClass(
      'primer:[--inline-message-font-size:var(--text-body-size-small)]',
      'primer:[--inline-message-line-height:var(--text-body-lineHeight-small)]',
    )
    expect(screen.getByTestId('message').querySelector('svg')).toHaveClass(
      'primer:min-h-[calc(var(--inline-message-line-height)*var(--inline-message-font-size))]',
    )
    expect(screen.getByTestId('message').querySelector('svg')).toHaveAttribute('width', '12')
  })

  it('renders the medium Primer body scale by default', () => {
    const {container} = render(<InlineMessage>Notice</InlineMessage>)

    expect(container.querySelector('[data-component="InlineMessage"]')).toHaveClass(
      'primer:[--inline-message-font-size:var(--text-body-size-medium)]',
      'primer:[--inline-message-line-height:var(--text-body-lineHeight-medium)]',
    )
    expect(container.querySelector('svg')).toHaveClass(
      'primer:min-h-[calc(var(--inline-message-line-height)*var(--inline-message-font-size))]',
    )
    expect(container.querySelector('svg')).toHaveAttribute('width', '16')
  })
})
