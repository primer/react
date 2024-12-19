import React from 'react'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {getResponsiveAttributes} from '../internal/utils/getResponsiveAttributes'
import classes from './Stack.module.css'
import {clsx} from 'clsx'
import {defaultSxProp} from '../utils/defaultSxProp'
import Box from '../Box'
import type {SxProp} from '../sx'

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

type StackProps = React.PropsWithChildren<{
  /**
   * Customize the element type of the rendered container
   */
  as?: React.ElementType

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
}> &
  SxProp &
  React.HTMLAttributes<HTMLDivElement>

function Stack({
  as = 'div',
  children,
  align = 'stretch',
  direction = 'vertical',
  gap,
  justify = 'start',
  padding = 'none',
  wrap = 'nowrap',
  sx: sxProp = defaultSxProp,
  className,
  ...rest
}: StackProps) {
  if (sxProp !== defaultSxProp || as !== 'div') {
    return (
      <Box
        {...rest}
        as={as}
        className={clsx(className, classes.Stack)}
        {...getResponsiveAttributes('gap', gap)}
        {...getResponsiveAttributes('direction', direction)}
        {...getResponsiveAttributes('align', align)}
        {...getResponsiveAttributes('wrap', wrap)}
        {...getResponsiveAttributes('justify', justify)}
        {...getResponsiveAttributes('padding', padding)}
      >
        {children}
      </Box>
    )
  }

  return (
    <div
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
    </div>
  )
}

type StackItemProps = React.PropsWithChildren<{
  /**
   * Customize the element type of the rendered container
   */
  as?: React.ElementType

  /**
   * Allow item to keep size or expand to fill the available space
   * @default false
   */
  grow?: boolean | ResponsiveValue<boolean>
  className?: string
}> &
  SxProp &
  React.HTMLAttributes<HTMLDivElement>

function StackItem({as = 'div', children, grow, className, sx: sxProp = defaultSxProp, ...rest}: StackItemProps) {
  if (sxProp !== defaultSxProp || as !== 'div') {
    return (
      <Box as={as} className={clsx(className, classes.StackItem)} {...getResponsiveAttributes('grow', grow)} {...rest}>
        {children}
      </Box>
    )
  }

  return (
    <div {...rest} className={clsx(className, classes.StackItem)} {...getResponsiveAttributes('grow', grow)}>
      {children}
    </div>
  )
}

export {Stack, StackItem}
export type {StackProps, StackItemProps}
