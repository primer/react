import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import type React from 'react'
import {Stack, StackItem} from '../Stack'
import {implementsClassName} from '../../utils/testing'
import classes from '../Stack.module.css'

describe('StackItem', () => {
  implementsClassName(StackItem, classes.StackItem)

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
    expect(screen.getByTestId('grow-true')).toHaveAttribute('data-grow', 'true')
    expect(screen.getByTestId('grow-false')).not.toHaveAttribute('data-grow', 'false')
  })

  it('should support responsive `grow` values', () => {
    render(
      <Stack>
        <StackItem data-testid="responsive-grow" grow={{narrow: true, regular: false, wide: true}} />
      </Stack>,
    )
    expect(screen.getByTestId('responsive-grow')).toHaveAttribute('data-grow-narrow', 'true')
    expect(screen.getByTestId('responsive-grow')).toHaveAttribute('data-grow-regular', 'false')
    expect(screen.getByTestId('responsive-grow')).toHaveAttribute('data-grow-wide', 'true')
  })

  it('should support the `shrink` prop', () => {
    render(
      <Stack>
        <StackItem data-testid="shrink-true" shrink={true} />
        <StackItem data-testid="shrink-false" />
      </Stack>,
    )
    expect(screen.getByTestId('shrink-true')).toHaveAttribute('data-shrink', 'true')
    expect(screen.getByTestId('shrink-false')).not.toHaveAttribute('data-shrink', 'false')
  })

  it('should support responsive `shrink` values', () => {
    render(
      <Stack>
        <StackItem data-testid="responsive-shrink" shrink={{narrow: true, regular: false, wide: true}} />
      </Stack>,
    )
    expect(screen.getByTestId('responsive-shrink')).toHaveAttribute('data-shrink-narrow', 'true')
    expect(screen.getByTestId('responsive-shrink')).toHaveAttribute('data-shrink-regular', 'false')
    expect(screen.getByTestId('responsive-shrink')).toHaveAttribute('data-shrink-wide', 'true')
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
})
