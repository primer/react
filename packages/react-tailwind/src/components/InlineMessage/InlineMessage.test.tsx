import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {InlineMessage} from './InlineMessage'

describe('InlineMessage', () => {
  it('renders the small Primer body scale with a size-appropriate icon', () => {
    render(
      <InlineMessage data-testid="message" size="small" variant="success">
        Saved
      </InlineMessage>,
    )

    expect(screen.getByTestId('message')).toHaveAttribute('data-variant', 'success')
    expect(screen.getByTestId('message')).toHaveClass(
      '[--inline-message-font-size:var(--text-body-size-small)]',
      '[--inline-message-line-height:var(--text-body-lineHeight-small)]',
    )
    expect(screen.getByTestId('message').querySelector('svg')).toHaveClass(
      'min-h-[calc(var(--inline-message-line-height)*var(--inline-message-font-size))]',
    )
    expect(screen.getByTestId('message').querySelector('svg')).toHaveAttribute('width', '12')
  })

  it('renders the medium Primer body scale by default', () => {
    const {container} = render(<InlineMessage>Notice</InlineMessage>)

    expect(container.querySelector('[data-component="InlineMessage"]')).toHaveClass(
      '[--inline-message-font-size:var(--text-body-size-medium)]',
      '[--inline-message-line-height:var(--text-body-lineHeight-medium)]',
    )
    expect(container.querySelector('svg')).toHaveClass(
      'min-h-[calc(var(--inline-message-line-height)*var(--inline-message-font-size))]',
    )
    expect(container.querySelector('svg')).toHaveAttribute('width', '16')
  })
})
