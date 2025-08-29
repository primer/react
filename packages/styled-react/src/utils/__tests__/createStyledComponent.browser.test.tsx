import {render, screen} from '@testing-library/react'
import {describe, test, expect} from 'vitest'
import {createStyledComponent} from '../createStyledComponent'

describe('createStyledComponent', () => {
  test('supports the sx prop', () => {
    const Wrapper = createStyledComponent(function Test(props: React.ComponentPropsWithoutRef<'div'>) {
      return <div {...props} data-testid="wrapper" />
    })

    render(<Wrapper sx={{display: 'flex'}} />)

    const wrapper = screen.getByTestId('wrapper')
    const style = window.getComputedStyle(wrapper)
    expect(style.display).toBe('flex')
  })

  test('supports the as prop', () => {
    const Wrapper = createStyledComponent(function Test({
      as: BaseComponent,
      ...rest
    }: {
      as: React.ElementType
      className?: string
    }) {
      return <BaseComponent {...rest} />
    })

    render(<Wrapper as="section" data-testid="wrapper" sx={{display: 'flex'}} />)
    const wrapper = screen.getByTestId('wrapper')
    expect(wrapper.tagName).toBe('SECTION')

    const style = window.getComputedStyle(wrapper)
    expect(style.display).toBe('flex')
  })

  test('supports original component props on wrapper', () => {
    const Wrapper = createStyledComponent(function Test(props: {variant: 'a' | 'b'}) {
      return <div data-testid="wrapper" data-variant={props.variant} />
    })

    render(<Wrapper variant="a" />)
    expect(screen.getByTestId('wrapper')).toHaveAttribute('data-variant', 'a')
  })
})
