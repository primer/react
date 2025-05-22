import type React from 'react'
import {forwardRef, type ElementType} from 'react'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {getResponsiveAttributes} from '../internal/utils/getResponsiveAttributes'
import classes from './Stack.module.css'
import {clsx} from 'clsx'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'

type GapScale = 'none' | 'condensed' | 'normal' | 'spacious'
type Gap = GapScale | ResponsiveValue<GapScale>

type DirectionScale = 'horizontal' | 'vertical'
type Direction = DirectionScale | ResponsiveValue<DirectionScale>

type AlignScale = 'stretch' | 'start' | 'center' | 'end' | 'baseline'
type Align = AlignScale | ResponsiveValue<AlignScale>

type WrapScale = 'wrap' | 'nowrap'
type Wrap = WrapScale | ResponsiveValue<WrapScale>

type JustifyScale = 'start' | 'center' | 'end' | 'space-between' | 'space-evenly'
type Justify = JustifyScale | ResponsiveValue<JustifyScale>

type PaddingScale = 'none' | 'condensed' | 'normal' | 'spacious'
type Padding = PaddingScale | ResponsiveValue<PaddingScale>

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
  className?: string
}>

const StackBaseComponent = toggleSxComponent('div') as React.ComponentType<StackProps<React.ElementType>>
const Stack = forwardRef(
  <As extends ElementType>(
    {
      as,
      children,
      align = 'stretch',
      direction = 'vertical',
      gap,
      justify = 'start',
      padding = 'none',
      wrap = 'nowrap',
      className,
      ...rest
    }: StackProps<As> & React.ComponentPropsWithRef<ElementType extends As ? As : 'div'>,
    forwardedRef: React.Ref<HTMLDivElement> | undefined,
  ) => {
    return (
      <StackBaseComponent
        as={as}
        ref={forwardedRef}
        {...rest}
        className={clsx(className, classes.Stack)}
        {...getResponsiveAttributes('gap', gap)}
        {...getResponsiveAttributes('direction', direction)}
        {...getResponsiveAttributes('align', align)}
        {...getResponsiveAttributes('wrap', wrap)}
        {...getResponsiveAttributes('justify', justify)}
        {...getResponsiveAttributes('padding', padding)}
      >
        {children}
      </StackBaseComponent>
    )
  },
)

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
  className?: string
}>

const StackItemBaseComponent = toggleSxComponent('div') as React.ComponentType<StackItemProps<React.ElementType>>
const StackItem = forwardRef(
  <As extends ElementType>(
    {
      as,
      children,
      grow,
      className,
      ...rest
    }: StackItemProps<As> & React.ComponentPropsWithRef<ElementType extends As ? As : 'div'>,
    forwardRef: React.Ref<HTMLDivElement> | undefined,
  ) => {
    return (
      <StackItemBaseComponent
        as={as}
        ref={forwardRef}
        {...rest}
        className={clsx(className, classes.StackItem)}
        {...getResponsiveAttributes('grow', grow)}
      >
        {children}
      </StackItemBaseComponent>
    )
  },
)

export {Stack, StackItem}
export type {StackProps, StackItemProps}
