import type React from 'react'
import {cn} from '../../internal/cn'
import {responsiveClasses} from '../../utils/responsive'
import type {ResponsiveValue} from '../../utils/types'
import type {PolymorphicProps} from '../../utils/types/component'
type Gap = 'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'

const gap = {
  none: 'gap-0',
  tight: 'gap-1',
  condensed: 'gap-2',
  cozy: 'gap-3',
  normal: 'gap-4',
  spacious: 'gap-6',
}
const padding = {
  none: 'p-0',
  tight: 'p-1',
  condensed: 'p-2',
  cozy: 'p-3',
  normal: 'p-4',
  spacious: 'p-6',
}
const paddingBlock = {
  none: 'py-0',
  tight: 'py-1',
  condensed: 'py-2',
  cozy: 'py-3',
  normal: 'py-4',
  spacious: 'py-6',
}
const paddingInline = {
  none: 'px-0',
  tight: 'px-1',
  condensed: 'px-2',
  cozy: 'px-3',
  normal: 'px-4',
  spacious: 'px-6',
}

export type StackProps<As extends React.ElementType = 'div'> = PolymorphicProps<
  As,
  {
    /**
     * Element to render. Its props, events, and ref follow the selected element.
     * @default 'div'
     */
    as?: As
    /** Spacing between children. Accepts a responsive object to vary it per viewport. */
    gap?: ResponsiveValue<Gap>
    /** Whether children are laid out in a row or a column. */
    direction?: ResponsiveValue<'horizontal' | 'vertical'>
    /** Alignment of children across the stack's direction. */
    align?: ResponsiveValue<'stretch' | 'start' | 'center' | 'end' | 'baseline'>
    /** Whether children may wrap onto another line. */
    wrap?: ResponsiveValue<'wrap' | 'nowrap'>
    /** Distribution of children along the stack's direction. */
    justify?: ResponsiveValue<'start' | 'center' | 'end' | 'space-between' | 'space-evenly'>
    /** Inner spacing on all sides. */
    padding?: ResponsiveValue<Gap>
    /** Inner spacing at the top and bottom, overriding `padding`. */
    paddingBlock?: ResponsiveValue<Gap>
    /** Inner spacing at the start and end, overriding `padding`. */
    paddingInline?: ResponsiveValue<Gap>
  },
  'div'
>

function StackRoot<As extends React.ElementType = 'div'>({
  as,
  align = 'stretch',
  className,
  direction = 'vertical',
  gap: gapValue = 'normal',
  justify = 'start',
  padding: paddingValue = 'none',
  paddingBlock: paddingBlockValue,
  paddingInline: paddingInlineValue,
  wrap = 'nowrap',
  ...rest
}: StackProps<As>) {
  const Component = as ?? 'div'
  return (
    <Component
      {...rest}
      className={cn(
        'primer:flex primer:min-w-0',
        responsiveClasses(direction, {horizontal: 'flex-row', vertical: 'flex-col'}, 'vertical'),
        responsiveClasses(
          align,
          {
            stretch: 'items-stretch',
            start: 'items-start',
            center: 'items-center',
            end: 'items-end',
            baseline: 'items-baseline',
          },
          'stretch',
        ),
        responsiveClasses(wrap, {wrap: 'flex-wrap', nowrap: 'flex-nowrap'}, 'nowrap'),
        responsiveClasses(
          justify,
          {
            start: 'justify-start',
            center: 'justify-center',
            end: 'justify-end',
            'space-between': 'justify-between',
            'space-evenly': 'justify-evenly',
          },
          'start',
        ),
        responsiveClasses(gapValue, gap),
        responsiveClasses(paddingValue, padding, 'none'),
        responsiveClasses(paddingBlockValue, paddingBlock),
        responsiveClasses(paddingInlineValue, paddingInline),
        className,
      )}
      data-component="Stack"
    />
  )
}

export type StackItemProps<As extends React.ElementType = 'div'> = PolymorphicProps<
  As,
  {
    /**
     * Element to render. Its props, events, and ref follow the selected element.
     * @default 'div'
     */
    as?: As
    /** Lets the item take up any remaining space. */
    grow?: ResponsiveValue<boolean>
    /** Lets the item shrink below its content size when space is tight. */
    shrink?: ResponsiveValue<boolean>
  },
  'div'
>

export function StackItem<As extends React.ElementType = 'div'>({
  as,
  className,
  grow = false,
  shrink = true,
  ...rest
}: StackItemProps<As>) {
  const Component = as ?? 'div'
  return (
    <Component
      {...rest}
      className={cn(
        'primer:min-w-0',
        responsiveClasses(grow, {true: 'grow', false: 'grow-0'}, false),
        responsiveClasses(shrink, {true: 'shrink', false: 'shrink-0'}, true),
        className,
      )}
      data-component="StackItem"
    />
  )
}

StackRoot.displayName = 'Stack'
StackItem.displayName = 'StackItem'

export const Stack: {
  <As extends React.ElementType = 'div'>(props: StackProps<As>): React.ReactElement
  Item: typeof StackItem
  displayName: string
} = Object.assign(StackRoot, {Item: StackItem})
