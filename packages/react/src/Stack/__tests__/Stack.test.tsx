import {render, screen} from '@testing-library/react'
import React from 'react'
import {Stack, StackItem} from '../Stack'

describe('Stack', () => {
  it('should support rendering content through `children`', () => {
    render(
      <Stack>
        <span data-testid="children" />
      </Stack>,
    )
    expect(screen.getByTestId('children')).toBeInTheDocument()
  })

  it('should render a custom component with the `as` prop', () => {
    const {container, rerender} = render(<Stack as="section" />)

    expect(container.firstChild?.nodeName).toBe('SECTION')

    const CustomComponent = jest.fn(({children}: React.PropsWithChildren) => {
      return <div data-testid="custom-component">{children}</div>
    })
    rerender(<Stack as={CustomComponent}></Stack>)

    expect(CustomComponent).toHaveBeenCalled()
    expect(screen.getByTestId('custom-component')).toBeInTheDocument()
  })

  it('should set the default gap to `normal`', () => {
    render(<Stack data-testid="stack" />)
    expect(screen.getByTestId('stack')).toHaveStyle('--stack-gap: var(--stack-gap-normal,1rem);')
  })

  it('should support specifying the stack gap with the `gap` prop', () => {
    render(
      <>
        <Stack data-testid="condensed" gap="condensed" />
        <Stack data-testid="normal" gap="normal" />
        <Stack data-testid="spacious" gap="spacious" />
      </>,
    )
    expect(screen.getByTestId('condensed')).toHaveStyle('--stack-gap: var(--stack-gap-condensed,0.5rem);')
    expect(screen.getByTestId('normal')).toHaveStyle('--stack-gap: var(--stack-gap-normal,1rem);')
    expect(screen.getByTestId('spacious')).toHaveStyle('--stack-gap: var(--stack-gap-spacious,1.5rem);')
  })

  it('should set the default padding to `normal`', () => {
    render(<Stack data-testid="stack" />)
    expect(screen.getByTestId('stack')).toHaveStyle('--stack-padding: var(--stack-padding-normal,1rem);')
  })

  it('should support specifying the stack padding with the `padding` prop', () => {
    render(
      <>
        <Stack data-testid="condensed" padding="condensed" />
        <Stack data-testid="normal" padding="normal" />
        <Stack data-testid="spacious" padding="spacious" />
      </>,
    )
    expect(screen.getByTestId('condensed')).toHaveStyle('--stack-padding: var(--stack-padding-condensed,0.5rem);')
    expect(screen.getByTestId('normal')).toHaveStyle('--stack-padding: var(--stack-padding-normal,1rem);')
    expect(screen.getByTestId('spacious')).toHaveStyle('--stack-padding: var(--stack-padding-spacious,1.5rem);')
  })

  it('should set the default orientation to `vertical`', () => {
    render(<Stack data-testid="stack" />)
    expect(screen.getByTestId('stack')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('should support changing the stack direction with the `orientation` prop', () => {
    render(
      <>
        <Stack data-testid="vertical" orientation="vertical" />
        <Stack data-testid="horizontal" orientation="horizontal" />
      </>,
    )
    expect(screen.getByTestId('vertical')).toHaveAttribute('data-orientation', 'vertical')
    expect(screen.getByTestId('horizontal')).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('should support responsive `gap` values', () => {
    render(
      <Stack data-testid="responsive-gap" gap={{narrow: 'condensed', regular: 'normal', wide: 'spacious'}} />
    )
    expect(screen.getByTestId('responsive-gap')).toHaveAttribute('data-gap-narrow', 'condensed')
    expect(screen.getByTestId('responsive-gap')).toHaveAttribute('data-gap-regular', 'normal')
    expect(screen.getByTestId('responsive-gap')).toHaveAttribute('data-gap-wide', 'spacious')
  })

  it('should support responsive `orientation` values', () => {
    render(
      <Stack data-testid="responsive-orientation" orientation={{narrow: 'vertical', regular: 'horizontal'}} />
    )
    expect(screen.getByTestId('responsive-orientation')).toHaveAttribute('data-orientation-narrow', 'vertical')
    expect(screen.getByTestId('responsive-orientation')).toHaveAttribute('data-orientation-regular', 'horizontal')
  })

  it('should forward extra props to the underlying element', () => {
    render(<Stack data-testid="extra-props" id="test-id" />)
    expect(screen.getByTestId('extra-props')).toHaveAttribute('id', 'test-id')
  })

  describe('StackItem', () => {
    it('should render its children', () => {
      render(
        <Stack>
          <StackItem data-testid="stack-item">Content</StackItem>
        </Stack>
      )
      expect(screen.getByTestId('stack-item')).toHaveTextContent('Content')
    })

    it('should support the `grow` prop', () => {
      render(
        <Stack>
          <StackItem data-testid="grow-true" grow={true} />
          <StackItem data-testid="grow-false" grow={false} />
        </Stack>
      )
      expect(screen.getByTestId('grow-true')).toHaveAttribute('data-grow', '')
      expect(screen.getByTestId('grow-false')).not.toHaveAttribute('data-grow')
    })

    it('should support responsive `grow` values', () => {
      render(
        <Stack>
          <StackItem data-testid="responsive-grow" grow={{narrow: true, regular: false, wide: true}} />
        </Stack>
      )
      expect(screen.getByTestId('responsive-grow')).toHaveAttribute('data-grow-narrow', '')
      expect(screen.getByTestId('responsive-grow')).toHaveAttribute('data-grow-regular', 'false')
      expect(screen.getByTestId('responsive-grow')).toHaveAttribute('data-grow-wide', '')
    })

    it('should render a custom component with the `as` prop', () => {
      const CustomComponent = jest.fn(({children}: React.PropsWithChildren) => {
        return <div data-testid="custom-stack-item">{children}</div>
      })
      render(
        <Stack>
          <StackItem as={CustomComponent}>Content</StackItem>
        </Stack>
      )
      expect(CustomComponent).toHaveBeenCalled()
      expect(screen.getByTestId('custom-stack-item')).toHaveTextContent('Content')
    })
  })
})
