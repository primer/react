import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import type React from 'react'
import {Stack} from '../Stack'
import {implementsClassName} from '../../utils/testing'
import classes from '../Stack.module.css'

describe('Stack', () => {
  implementsClassName(Stack, classes.Stack)

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

    const CustomComponent = vi.fn(({children}: React.PropsWithChildren) => {
      return <div data-testid="custom-component">{children}</div>
    })
    rerender(<Stack as={CustomComponent}></Stack>)

    expect(CustomComponent).toHaveBeenCalled()
    expect(screen.getByTestId('custom-component')).toBeInTheDocument()
  })

  it('should forward extra props to the underlying element', () => {
    render(<Stack data-testid="extra-props" id="test-id" />)
    expect(screen.getByTestId('extra-props')).toHaveAttribute('id', 'test-id')
  })

  describe('align', () => {
    it('should set the default `align` to `stretch`', () => {
      render(<Stack data-testid="stack" />)
      expect(screen.getByTestId('stack')).toHaveAttribute('data-align', 'stretch')
    })

    it('should support specifying the stack alignment with the `align` prop', () => {
      render(
        <>
          <Stack data-testid="baseline" align="baseline" />
          <Stack data-testid="center" align="center" />
          <Stack data-testid="end" align="end" />
          <Stack data-testid="start" align="start" />
          <Stack data-testid="stretch" align="stretch" />
        </>,
      )
      expect(screen.getByTestId('baseline')).toHaveAttribute('data-align', 'baseline')
      expect(screen.getByTestId('center')).toHaveAttribute('data-align', 'center')
      expect(screen.getByTestId('end')).toHaveAttribute('data-align', 'end')
      expect(screen.getByTestId('start')).toHaveAttribute('data-align', 'start')
      expect(screen.getByTestId('stretch')).toHaveAttribute('data-align', 'stretch')
    })

    it('should support responsive `align` values', () => {
      render(
        <Stack
          data-testid="responsive"
          align={{
            narrow: 'start',
            regular: 'center',
            wide: 'end',
          }}
        />,
      )
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-align-narrow', 'start')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-align-regular', 'center')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-align-wide', 'end')
    })
  })

  describe('direction', () => {
    it('should set the default direction to `vertical`', () => {
      render(<Stack data-testid="stack" />)
      expect(screen.getByTestId('stack')).toHaveAttribute('data-direction', 'vertical')
    })

    it('should support changing the stack direction with the `direction` prop', () => {
      render(
        <>
          <Stack data-testid="vertical" direction="vertical" />
          <Stack data-testid="horizontal" direction="horizontal" />
        </>,
      )
      expect(screen.getByTestId('vertical')).toHaveAttribute('data-direction', 'vertical')
      expect(screen.getByTestId('horizontal')).toHaveAttribute('data-direction', 'horizontal')
    })

    it('should support responsive `direction` values', () => {
      render(<Stack data-testid="responsive-direction" direction={{narrow: 'vertical', regular: 'horizontal'}} />)
      expect(screen.getByTestId('responsive-direction')).toHaveAttribute('data-direction-narrow', 'vertical')
      expect(screen.getByTestId('responsive-direction')).toHaveAttribute('data-direction-regular', 'horizontal')
    })
  })

  describe('gap', () => {
    // Fix when we have a better way to test this
    it.todo('should set the default gap to `normal`', () => {
      render(<Stack data-testid="stack" />)
      expect(screen.getByTestId('stack')).toHaveStyle('gap: var(--stack-gap,var(--stack-gap-normal,1rem));')
    })

    it('should support specifying the stack gap with the `gap` prop', () => {
      render(
        <>
          <Stack data-testid="tight" gap="tight" />
          <Stack data-testid="condensed" gap="condensed" />
          <Stack data-testid="cozy" gap="cozy" />
          <Stack data-testid="normal" gap="normal" />
          <Stack data-testid="spacious" gap="spacious" />
        </>,
      )
      expect(screen.getByTestId('tight')).toHaveAttribute('data-gap', 'tight')
      expect(screen.getByTestId('condensed')).toHaveAttribute('data-gap', 'condensed')
      expect(screen.getByTestId('cozy')).toHaveAttribute('data-gap', 'cozy')
      expect(screen.getByTestId('normal')).toHaveAttribute('data-gap', 'normal')
      expect(screen.getByTestId('spacious')).toHaveAttribute('data-gap', 'spacious')
    })

    it('should support responsive `gap` values', () => {
      render(<Stack data-testid="responsive-gap" gap={{narrow: 'condensed', regular: 'normal', wide: 'spacious'}} />)
      expect(screen.getByTestId('responsive-gap')).toHaveAttribute('data-gap-narrow', 'condensed')
      expect(screen.getByTestId('responsive-gap')).toHaveAttribute('data-gap-regular', 'normal')
      expect(screen.getByTestId('responsive-gap')).toHaveAttribute('data-gap-wide', 'spacious')
    })
  })

  describe('justify', () => {
    it('should set the default justify to `start`', () => {
      render(<Stack data-testid="stack" />)
      expect(screen.getByTestId('stack')).toHaveAttribute('data-justify', 'start')
    })

    it('should support justifying content within the stack with `justify`', () => {
      render(
        <>
          <Stack data-testid="center" justify="center" />
          <Stack data-testid="start" justify="start" />
          <Stack data-testid="end" justify="end" />
          <Stack data-testid="space-evenly" justify="space-evenly" />
          <Stack data-testid="space-between" justify="space-between" />
        </>,
      )
      expect(screen.getByTestId('center')).toHaveAttribute('data-justify', 'center')
      expect(screen.getByTestId('start')).toHaveAttribute('data-justify', 'start')
      expect(screen.getByTestId('end')).toHaveAttribute('data-justify', 'end')
      expect(screen.getByTestId('space-evenly')).toHaveAttribute('data-justify', 'space-evenly')
      expect(screen.getByTestId('space-between')).toHaveAttribute('data-justify', 'space-between')
    })

    it('should support responsive `justify` values', () => {
      render(
        <Stack
          data-testid="responsive"
          justify={{
            narrow: 'start',
            regular: 'center',
            wide: 'end',
          }}
        />,
      )
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-justify-narrow', 'start')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-justify-regular', 'center')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-justify-wide', 'end')
    })
  })

  describe('padding', () => {
    it('should set the default padding to `none`', () => {
      render(<Stack data-testid="stack" />)
      expect(screen.getByTestId('stack')).toHaveAttribute('data-padding', 'none')
    })

    it('should support specifying the stack padding with the `padding` prop', () => {
      render(
        <>
          <Stack data-testid="tight" padding="tight" />
          <Stack data-testid="condensed" padding="condensed" />
          <Stack data-testid="cozy" padding="cozy" />
          <Stack data-testid="normal" padding="normal" />
          <Stack data-testid="spacious" padding="spacious" />
        </>,
      )
      expect(screen.getByTestId('tight')).toHaveAttribute('data-padding', 'tight')
      expect(screen.getByTestId('condensed')).toHaveAttribute('data-padding', 'condensed')
      expect(screen.getByTestId('cozy')).toHaveAttribute('data-padding', 'cozy')
      expect(screen.getByTestId('normal')).toHaveAttribute('data-padding', 'normal')
      expect(screen.getByTestId('spacious')).toHaveAttribute('data-padding', 'spacious')
    })

    it('should support responsive `padding` values', () => {
      render(
        <Stack
          data-testid="responsive"
          padding={{
            narrow: 'none',
            regular: 'condensed',
            wide: 'spacious',
          }}
        />,
      )
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-padding-narrow', 'none')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-padding-regular', 'condensed')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-padding-wide', 'spacious')
    })

    it('should render both padding and paddingBlock/paddingInline attributes when combined', () => {
      render(<Stack data-testid="combined" padding="normal" paddingBlock="condensed" paddingInline="spacious" />)
      expect(screen.getByTestId('combined')).toHaveAttribute('data-padding', 'normal')
      expect(screen.getByTestId('combined')).toHaveAttribute('data-padding-block', 'condensed')
      expect(screen.getByTestId('combined')).toHaveAttribute('data-padding-inline', 'spacious')
    })
  })

  describe('paddingBlock', () => {
    it('should support specifying the block padding with the `paddingBlock` prop', () => {
      render(
        <>
          <Stack data-testid="tight" paddingBlock="tight" />
          <Stack data-testid="condensed" paddingBlock="condensed" />
          <Stack data-testid="cozy" paddingBlock="cozy" />
          <Stack data-testid="normal" paddingBlock="normal" />
          <Stack data-testid="spacious" paddingBlock="spacious" />
        </>,
      )
      expect(screen.getByTestId('tight')).toHaveAttribute('data-padding-block', 'tight')
      expect(screen.getByTestId('condensed')).toHaveAttribute('data-padding-block', 'condensed')
      expect(screen.getByTestId('cozy')).toHaveAttribute('data-padding-block', 'cozy')
      expect(screen.getByTestId('normal')).toHaveAttribute('data-padding-block', 'normal')
      expect(screen.getByTestId('spacious')).toHaveAttribute('data-padding-block', 'spacious')
    })

    it('should support responsive `paddingBlock` values', () => {
      render(
        <Stack
          data-testid="responsive"
          paddingBlock={{
            narrow: 'none',
            regular: 'condensed',
            wide: 'spacious',
          }}
        />,
      )
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-padding-block-narrow', 'none')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-padding-block-regular', 'condensed')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-padding-block-wide', 'spacious')
    })
  })

  describe('paddingInline', () => {
    it('should support specifying the inline padding with the `paddingInline` prop', () => {
      render(
        <>
          <Stack data-testid="tight" paddingInline="tight" />
          <Stack data-testid="condensed" paddingInline="condensed" />
          <Stack data-testid="cozy" paddingInline="cozy" />
          <Stack data-testid="normal" paddingInline="normal" />
          <Stack data-testid="spacious" paddingInline="spacious" />
        </>,
      )
      expect(screen.getByTestId('tight')).toHaveAttribute('data-padding-inline', 'tight')
      expect(screen.getByTestId('condensed')).toHaveAttribute('data-padding-inline', 'condensed')
      expect(screen.getByTestId('cozy')).toHaveAttribute('data-padding-inline', 'cozy')
      expect(screen.getByTestId('normal')).toHaveAttribute('data-padding-inline', 'normal')
      expect(screen.getByTestId('spacious')).toHaveAttribute('data-padding-inline', 'spacious')
    })

    it('should support responsive `paddingInline` values', () => {
      render(
        <Stack
          data-testid="responsive"
          paddingInline={{
            narrow: 'tight',
            regular: 'normal',
            wide: 'spacious',
          }}
        />,
      )
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-padding-inline-narrow', 'tight')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-padding-inline-regular', 'normal')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-padding-inline-wide', 'spacious')
    })
  })

  describe('wrap', () => {
    it('should set the default wrap to `nowrap`', () => {
      render(<Stack data-testid="stack" />)
      expect(screen.getByTestId('stack')).toHaveAttribute('data-wrap', 'nowrap')
    })

    it('should support wrapping the content in the container with `wrap`', () => {
      render(
        <>
          <Stack data-testid="wrap" wrap="wrap" />
          <Stack data-testid="nowrap" wrap="nowrap" />
        </>,
      )
      expect(screen.getByTestId('wrap')).toHaveAttribute('data-wrap', 'wrap')
      expect(screen.getByTestId('nowrap')).toHaveAttribute('data-wrap', 'nowrap')
    })

    it('should support responsive `wrap` values', () => {
      render(
        <Stack
          data-testid="responsive"
          wrap={{
            narrow: 'wrap',
            regular: 'nowrap',
            wide: 'wrap',
          }}
        />,
      )
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-wrap-narrow', 'wrap')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-wrap-regular', 'nowrap')
      expect(screen.getByTestId('responsive')).toHaveAttribute('data-wrap-wide', 'wrap')
    })
  })
})
