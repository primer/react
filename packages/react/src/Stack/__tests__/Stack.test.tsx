import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import type React from 'react'
import {Stack} from '../Stack'
import {implementsClassName} from '../../utils/testing'
import classes from '../Stack.module.css'

describe('Stack', () => {
  implementsClassName(Stack, classes.Stack)

  it('renders data-component attribute', async () => {
    render(<Stack data-testid="stack" />)
    await expect.element(page.getByTestId('stack')).toHaveAttribute('data-component', 'Stack')
  })

  it('should support rendering content through `children`', async () => {
    render(
      <Stack>
        <span data-testid="children" />
      </Stack>,
    )
    await expect.element(page.getByTestId('children')).toBeInTheDocument()
  })

  it('should render a custom component with the `as` prop', async () => {
    const {container, rerender} = render(<Stack as="section" />)

    expect(container.firstChild?.nodeName).toBe('SECTION')

    const CustomComponent = vi.fn(({children}: React.PropsWithChildren) => {
      return <div data-testid="custom-component">{children}</div>
    })
    rerender(<Stack as={CustomComponent}></Stack>)

    expect(CustomComponent).toHaveBeenCalled()
    await expect.element(page.getByTestId('custom-component')).toBeInTheDocument()
  })

  it('should forward extra props to the underlying element', async () => {
    render(<Stack data-testid="extra-props" id="test-id" />)
    await expect.element(page.getByTestId('extra-props')).toHaveAttribute('id', 'test-id')
  })

  describe('align', () => {
    it('should set the default `align` to `stretch`', async () => {
      render(<Stack data-testid="stack" />)
      await expect.element(page.getByTestId('stack')).toHaveAttribute('data-align', 'stretch')
    })

    it('should support specifying the stack alignment with the `align` prop', async () => {
      render(
        <>
          <Stack data-testid="baseline" align="baseline" />
          <Stack data-testid="center" align="center" />
          <Stack data-testid="end" align="end" />
          <Stack data-testid="start" align="start" />
          <Stack data-testid="stretch" align="stretch" />
        </>,
      )
      await expect.element(page.getByTestId('baseline')).toHaveAttribute('data-align', 'baseline')
      await expect.element(page.getByTestId('center')).toHaveAttribute('data-align', 'center')
      await expect.element(page.getByTestId('end')).toHaveAttribute('data-align', 'end')
      await expect.element(page.getByTestId('start')).toHaveAttribute('data-align', 'start')
      await expect.element(page.getByTestId('stretch')).toHaveAttribute('data-align', 'stretch')
    })

    it('should support responsive `align` values', async () => {
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
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-align-narrow', 'start')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-align-regular', 'center')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-align-wide', 'end')
    })
  })

  describe('direction', () => {
    it('should set the default direction to `vertical`', async () => {
      render(<Stack data-testid="stack" />)
      await expect.element(page.getByTestId('stack')).toHaveAttribute('data-direction', 'vertical')
    })

    it('should support changing the stack direction with the `direction` prop', async () => {
      render(
        <>
          <Stack data-testid="vertical" direction="vertical" />
          <Stack data-testid="horizontal" direction="horizontal" />
        </>,
      )
      await expect.element(page.getByTestId('vertical')).toHaveAttribute('data-direction', 'vertical')
      await expect.element(page.getByTestId('horizontal')).toHaveAttribute('data-direction', 'horizontal')
    })

    it('should support responsive `direction` values', async () => {
      render(<Stack data-testid="responsive-direction" direction={{narrow: 'vertical', regular: 'horizontal'}} />)
      await expect
        .element(page.getByTestId('responsive-direction'))
        .toHaveAttribute('data-direction-narrow', 'vertical')
      await expect
        .element(page.getByTestId('responsive-direction'))
        .toHaveAttribute('data-direction-regular', 'horizontal')
    })
  })

  describe('gap', () => {
    // Fix when we have a better way to test this
    it.todo('should set the default gap to `normal`', async () => {
      render(<Stack data-testid="stack" />)
      await expect.element(page.getByTestId('stack')).toHaveStyle('gap: var(--stack-gap,var(--stack-gap-normal,1rem));')
    })

    it('should support specifying the stack gap with the `gap` prop', async () => {
      render(
        <>
          <Stack data-testid="tight" gap="tight" />
          <Stack data-testid="condensed" gap="condensed" />
          <Stack data-testid="cozy" gap="cozy" />
          <Stack data-testid="normal" gap="normal" />
          <Stack data-testid="spacious" gap="spacious" />
        </>,
      )
      await expect.element(page.getByTestId('tight')).toHaveAttribute('data-gap', 'tight')
      await expect.element(page.getByTestId('condensed')).toHaveAttribute('data-gap', 'condensed')
      await expect.element(page.getByTestId('cozy')).toHaveAttribute('data-gap', 'cozy')
      await expect.element(page.getByTestId('normal')).toHaveAttribute('data-gap', 'normal')
      await expect.element(page.getByTestId('spacious')).toHaveAttribute('data-gap', 'spacious')
    })

    it('should support responsive `gap` values', async () => {
      render(<Stack data-testid="responsive-gap" gap={{narrow: 'condensed', regular: 'normal', wide: 'spacious'}} />)
      await expect.element(page.getByTestId('responsive-gap')).toHaveAttribute('data-gap-narrow', 'condensed')
      await expect.element(page.getByTestId('responsive-gap')).toHaveAttribute('data-gap-regular', 'normal')
      await expect.element(page.getByTestId('responsive-gap')).toHaveAttribute('data-gap-wide', 'spacious')
    })
  })

  describe('justify', () => {
    it('should set the default justify to `start`', async () => {
      render(<Stack data-testid="stack" />)
      await expect.element(page.getByTestId('stack')).toHaveAttribute('data-justify', 'start')
    })

    it('should support justifying content within the stack with `justify`', async () => {
      render(
        <>
          <Stack data-testid="center" justify="center" />
          <Stack data-testid="start" justify="start" />
          <Stack data-testid="end" justify="end" />
          <Stack data-testid="space-evenly" justify="space-evenly" />
          <Stack data-testid="space-between" justify="space-between" />
        </>,
      )
      await expect.element(page.getByTestId('center')).toHaveAttribute('data-justify', 'center')
      await expect.element(page.getByTestId('start')).toHaveAttribute('data-justify', 'start')
      await expect.element(page.getByTestId('end')).toHaveAttribute('data-justify', 'end')
      await expect.element(page.getByTestId('space-evenly')).toHaveAttribute('data-justify', 'space-evenly')
      await expect.element(page.getByTestId('space-between')).toHaveAttribute('data-justify', 'space-between')
    })

    it('should support responsive `justify` values', async () => {
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
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-justify-narrow', 'start')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-justify-regular', 'center')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-justify-wide', 'end')
    })
  })

  describe('padding', () => {
    it('should set the default padding to `none`', async () => {
      render(<Stack data-testid="stack" />)
      await expect.element(page.getByTestId('stack')).toHaveAttribute('data-padding', 'none')
    })

    it('should support specifying the stack padding with the `padding` prop', async () => {
      render(
        <>
          <Stack data-testid="tight" padding="tight" />
          <Stack data-testid="condensed" padding="condensed" />
          <Stack data-testid="cozy" padding="cozy" />
          <Stack data-testid="normal" padding="normal" />
          <Stack data-testid="spacious" padding="spacious" />
        </>,
      )
      await expect.element(page.getByTestId('tight')).toHaveAttribute('data-padding', 'tight')
      await expect.element(page.getByTestId('condensed')).toHaveAttribute('data-padding', 'condensed')
      await expect.element(page.getByTestId('cozy')).toHaveAttribute('data-padding', 'cozy')
      await expect.element(page.getByTestId('normal')).toHaveAttribute('data-padding', 'normal')
      await expect.element(page.getByTestId('spacious')).toHaveAttribute('data-padding', 'spacious')
    })

    it('should support responsive `padding` values', async () => {
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
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-padding-narrow', 'none')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-padding-regular', 'condensed')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-padding-wide', 'spacious')
    })

    it('should render both padding and paddingBlock/paddingInline attributes when combined', async () => {
      render(<Stack data-testid="combined" padding="normal" paddingBlock="condensed" paddingInline="spacious" />)
      await expect.element(page.getByTestId('combined')).toHaveAttribute('data-padding', 'normal')
      await expect.element(page.getByTestId('combined')).toHaveAttribute('data-padding-block', 'condensed')
      await expect.element(page.getByTestId('combined')).toHaveAttribute('data-padding-inline', 'spacious')
    })
  })

  describe('paddingBlock', () => {
    it('should support specifying the block padding with the `paddingBlock` prop', async () => {
      render(
        <>
          <Stack data-testid="tight" paddingBlock="tight" />
          <Stack data-testid="condensed" paddingBlock="condensed" />
          <Stack data-testid="cozy" paddingBlock="cozy" />
          <Stack data-testid="normal" paddingBlock="normal" />
          <Stack data-testid="spacious" paddingBlock="spacious" />
        </>,
      )
      await expect.element(page.getByTestId('tight')).toHaveAttribute('data-padding-block', 'tight')
      await expect.element(page.getByTestId('condensed')).toHaveAttribute('data-padding-block', 'condensed')
      await expect.element(page.getByTestId('cozy')).toHaveAttribute('data-padding-block', 'cozy')
      await expect.element(page.getByTestId('normal')).toHaveAttribute('data-padding-block', 'normal')
      await expect.element(page.getByTestId('spacious')).toHaveAttribute('data-padding-block', 'spacious')
    })

    it('should support responsive `paddingBlock` values', async () => {
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
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-padding-block-narrow', 'none')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-padding-block-regular', 'condensed')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-padding-block-wide', 'spacious')
    })
  })

  describe('paddingInline', () => {
    it('should support specifying the inline padding with the `paddingInline` prop', async () => {
      render(
        <>
          <Stack data-testid="tight" paddingInline="tight" />
          <Stack data-testid="condensed" paddingInline="condensed" />
          <Stack data-testid="cozy" paddingInline="cozy" />
          <Stack data-testid="normal" paddingInline="normal" />
          <Stack data-testid="spacious" paddingInline="spacious" />
        </>,
      )
      await expect.element(page.getByTestId('tight')).toHaveAttribute('data-padding-inline', 'tight')
      await expect.element(page.getByTestId('condensed')).toHaveAttribute('data-padding-inline', 'condensed')
      await expect.element(page.getByTestId('cozy')).toHaveAttribute('data-padding-inline', 'cozy')
      await expect.element(page.getByTestId('normal')).toHaveAttribute('data-padding-inline', 'normal')
      await expect.element(page.getByTestId('spacious')).toHaveAttribute('data-padding-inline', 'spacious')
    })

    it('should support responsive `paddingInline` values', async () => {
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
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-padding-inline-narrow', 'tight')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-padding-inline-regular', 'normal')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-padding-inline-wide', 'spacious')
    })
  })

  describe('wrap', () => {
    it('should set the default wrap to `nowrap`', async () => {
      render(<Stack data-testid="stack" />)
      await expect.element(page.getByTestId('stack')).toHaveAttribute('data-wrap', 'nowrap')
    })

    it('should support wrapping the content in the container with `wrap`', async () => {
      render(
        <>
          <Stack data-testid="wrap" wrap="wrap" />
          <Stack data-testid="nowrap" wrap="nowrap" />
          <Stack data-testid="balance" wrap="balance" />
        </>,
      )
      await expect.element(page.getByTestId('wrap')).toHaveAttribute('data-wrap', 'wrap')
      await expect.element(page.getByTestId('nowrap')).toHaveAttribute('data-wrap', 'nowrap')
      await expect.element(page.getByTestId('balance')).toHaveAttribute('data-wrap', 'balance')
    })

    it('should support responsive `wrap` values', async () => {
      render(
        <Stack
          data-testid="responsive"
          wrap={{
            narrow: 'wrap',
            regular: 'balance',
            wide: 'balance',
          }}
        />,
      )
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-wrap-narrow', 'wrap')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-wrap-regular', 'balance')
      await expect.element(page.getByTestId('responsive')).toHaveAttribute('data-wrap-wide', 'balance')
    })
  })
})
