import {render, screen} from '@testing-library/react'
import React from 'react'
import {Stack, StackItem} from '../Stack'
import {FeatureFlags} from '../../FeatureFlags'

describe('StackItem', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => (
      <Stack>
        <StackItem data-testid="stack-item" className={'test-class-name'}>
          Content
        </StackItem>
      </Stack>
    )
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_ga: true,
          }}
        >
          <Element />
        </FeatureFlags>
      )
    }
    expect(render(<Element />).getAllByTestId('stack-item')[0]).toHaveClass('test-class-name')
    expect(render(<FeatureFlagElement />).getAllByTestId('stack-item')[1]).toHaveClass('test-class-name')
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
