import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import type React from 'react'
import {Stack, StackItem} from '../Stack'

describe('StackItem', () => {
  it('should render as a custom element by default', () => {
    const {container} = render(<StackItem />)
    expect(container.firstChild?.nodeName).toBe('DS-STACK-ITEM')
  })

  it('renders with the custom className', () => {
    render(<StackItem data-testid="stack-item" className="custom-class" />)
    expect(screen.getByTestId('stack-item')).toHaveClass('custom-class')
  })

  it('should render its children', () => {
    render(
      <Stack>
        <StackItem data-testid="stack-item">Content</StackItem>
      </Stack>,
    )
    expect(screen.getByTestId('stack-item')).toHaveTextContent('Content')
  })

  it('should support the `grow` prop', () => {
    render(
      <Stack>
        <StackItem data-testid="grow-true" grow={true} />
        <StackItem data-testid="grow-false" />
      </Stack>,
    )
    expect(screen.getByTestId('grow-true')).toHaveAttribute('grow', 'true')
    expect(screen.getByTestId('grow-false')).not.toHaveAttribute('grow', 'false')
  })

  it('should support responsive `grow` values', () => {
    render(
      <Stack>
        <StackItem data-testid="responsive-grow" grow={{narrow: true, regular: false, wide: true}} />
      </Stack>,
    )
    expect(screen.getByTestId('responsive-grow')).toHaveAttribute('grow-narrow', 'true')
    expect(screen.getByTestId('responsive-grow')).toHaveAttribute('grow-regular', 'false')
    expect(screen.getByTestId('responsive-grow')).toHaveAttribute('grow-wide', 'true')
  })

  it('should support the `shrink` prop', () => {
    render(
      <Stack>
        <StackItem data-testid="shrink-true" shrink={true} />
        <StackItem data-testid="shrink-false" />
      </Stack>,
    )
    expect(screen.getByTestId('shrink-true')).toHaveAttribute('shrink', 'true')
    expect(screen.getByTestId('shrink-false')).not.toHaveAttribute('shrink', 'false')
  })

  it('should support responsive `shrink` values', () => {
    render(
      <Stack>
        <StackItem data-testid="responsive-shrink" shrink={{narrow: true, regular: false, wide: true}} />
      </Stack>,
    )
    expect(screen.getByTestId('responsive-shrink')).toHaveAttribute('shrink-narrow', 'true')
    expect(screen.getByTestId('responsive-shrink')).toHaveAttribute('shrink-regular', 'false')
    expect(screen.getByTestId('responsive-shrink')).toHaveAttribute('shrink-wide', 'true')
  })

  it('should render a custom component with the `as` prop', () => {
    const CustomComponent = vi.fn(({children}: React.PropsWithChildren) => {
      return <div data-testid="custom-stack-item">{children}</div>
    })
    render(
      <Stack>
        <StackItem as={CustomComponent}>Content</StackItem>
      </Stack>,
    )
    expect(CustomComponent).toHaveBeenCalled()
    expect(screen.getByTestId('custom-stack-item')).toHaveTextContent('Content')
  })

  it('should preserve native semantics with the `as` prop', () => {
    const {container} = render(<StackItem as="li">Content</StackItem>)

    expect(container.firstChild?.nodeName).toBe('LI')
    expect(container.firstChild).toHaveAttribute('stack-item')
  })
})
