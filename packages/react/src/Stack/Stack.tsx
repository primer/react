import type React from 'react'
import {forwardRef, type ElementType} from 'react'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import './Stack.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type StackCustomElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  align?: string
  class?: string
  direction?: string
  gap?: string
  grow?: string
  justify?: string
  padding?: string
  shrink?: string
  stack?: string
  'stack-item'?: string
  wrap?: string
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ds-stack': StackCustomElementProps
      'ds-stack-item': StackCustomElementProps
    }
  }
}

type GapScale = 'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'
type Gap = GapScale | ResponsiveValue<GapScale>

type DirectionScale = 'horizontal' | 'vertical'
type Direction = DirectionScale | ResponsiveValue<DirectionScale>

type AlignScale = 'stretch' | 'start' | 'center' | 'end' | 'baseline'
type Align = AlignScale | ResponsiveValue<AlignScale>

type WrapScale = 'wrap' | 'nowrap'
type Wrap = WrapScale | ResponsiveValue<WrapScale>

type JustifyScale = 'start' | 'center' | 'end' | 'space-between' | 'space-evenly'
type Justify = JustifyScale | ResponsiveValue<JustifyScale>

type PaddingScale = 'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'
type Padding = PaddingScale | ResponsiveValue<PaddingScale>

function getResponsiveStackAttributes<T extends string | boolean>(
  property: string,
  values?: T | ResponsiveValue<T>,
): Record<string, string> | undefined {
  if (values === undefined) {
    return
  }

  if (typeof values === 'object') {
    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        return [serializeAttributeName(property, key), String(value)]
      }),
    )
  }

  return {
    [property]: String(values),
  }
}

function serializeAttributeName(property: string, breakpoint: string) {
  return `${property}-${breakpoint}`
}

function getPolymorphicElementProps(Component: ElementType, defaultElement: string, className?: string) {
  const isStringElement = typeof Component === 'string'
  const props: Record<string, string | undefined> = {}

  if (className) {
    props[isStringElement && Component.includes('-') ? 'class' : 'className'] = className
  }

  if (isStringElement && Component !== defaultElement) {
    props[defaultElement === 'ds-stack' ? 'stack' : 'stack-item'] = ''
  }

  return props
}

type StackProps<As> = React.PropsWithChildren<{
  /**
   * Customize the element type of the rendered container
   */
  as?: As

  /**
   * Specify the gap between children elements in the stack
   */
  gap?: Gap

  /**
   * Specify the direction for the stack container
   * @default vertical
   */
  direction?: Direction

  /**
   * Specify the alignment between items in the cross-axis of the direction
   * @default stretch
   */
  align?: Align

  /**
   * Specify whether items are forced onto one line or can wrap onto multiple lines
   * @default nowrap
   */
  wrap?: Wrap

  /**
   * Specify how items will be distributed in the stacking direction
   * @default start
   */
  justify?: Justify

  /**
   * Specify the padding of the stack container
   * @default none
   */
  padding?: Padding

  /**
   * Specify the block (vertical) padding of the stack container.
   * Overrides the block axis of `padding` when both are set.
   */
  paddingBlock?: Padding

  /**
   * Specify the inline (horizontal) padding of the stack container.
   * Overrides the inline axis of `padding` when both are set.
   */
  paddingInline?: Padding

  className?: string
}>

const Stack = forwardRef(
  (
    {
      as: Component = 'ds-stack',
      children,
      align = 'stretch',
      direction = 'vertical',
      gap,
      justify = 'start',
      padding = 'none',
      paddingBlock,
      paddingInline,
      wrap = 'nowrap',
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    return (
      <Component
        ref={forwardedRef}
        {...rest}
        {...getPolymorphicElementProps(Component, 'ds-stack', className)}
        {...getResponsiveStackAttributes('gap', gap)}
        {...getResponsiveStackAttributes('direction', direction)}
        {...getResponsiveStackAttributes('align', align)}
        {...getResponsiveStackAttributes('wrap', wrap)}
        {...getResponsiveStackAttributes('justify', justify)}
        {...getResponsiveStackAttributes('padding', padding)}
        {...getResponsiveStackAttributes('padding-block', paddingBlock)}
        {...getResponsiveStackAttributes('padding-inline', paddingInline)}
      >
        {children}
      </Component>
    )
  },
) as PolymorphicForwardRefComponent<ElementType, StackProps<ElementType>>

type StackItemProps<As> = React.PropsWithChildren<{
  /**
   * Customize the element type of the rendered container
   */
  as?: As

  /**
   * Allow item to keep size or expand to fill the available space
   * @default false
   */
  grow?: boolean | ResponsiveValue<boolean>

  /**
   * Allow item to keep size or expand to fill the available space
   * @default true
   */
  shrink?: boolean | ResponsiveValue<boolean>

  className?: string
}>

const StackItem = forwardRef(
  ({as: Component = 'ds-stack-item', children, grow, shrink, className, ...rest}, forwardedRef) => {
    return (
      <Component
        ref={forwardedRef}
        {...rest}
        {...getPolymorphicElementProps(Component, 'ds-stack-item', className)}
        {...getResponsiveStackAttributes('grow', grow)}
        {...getResponsiveStackAttributes('shrink', shrink)}
      >
        {children}
      </Component>
    )
  },
) as PolymorphicForwardRefComponent<ElementType, StackItemProps<ElementType>>

export {Stack, StackItem}
export type {StackProps, StackItemProps}
