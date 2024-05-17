import {render, screen} from '@testing-library/react'
import React from 'react'
import {Stack, StackItem} from '../Stack'

describe('StackItem', () => {
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
    expect(screen.getByTestId('grow-true')).toHaveAttribute('data-grow', '')
    expect(screen.getByTestId('grow-false')).not.toHaveAttribute('data-grow')
  })

  it('should support responsive `grow` values', () => {
    render(
      <Stack>
        <StackItem data-testid="responsive-grow" grow={{narrow: true, regular: false, wide: true}} />
      </Stack>,
    )
    expect(screen.getByTestId('responsive-grow')).toHaveAttribute('data-grow-narrow', '')
    expect(screen.getByTestId('responsive-grow')).not.toHaveAttribute('data-grow-regular')
    expect(screen.getByTestId('responsive-grow')).toHaveAttribute('data-grow-wide', '')
  })

  it('should render a custom component with the `as` prop', () => {
    const CustomComponent = jest.fn(({children}: React.PropsWithChildren) => {
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
