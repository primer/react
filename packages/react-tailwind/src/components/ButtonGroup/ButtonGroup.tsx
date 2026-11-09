'use client'

import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {mergeRefs} from '../../internal/refs'
import {useFocusZone} from '../../internal/useFocusZone'

// Every direct child is a joined item, like Primer React's `ButtonGroup.Item` wrappers. Children are matched
// structurally rather than by `data-component` because trigger parts (for example `ActionMenu.Trigger`) replace the
// rendered button's `data-component`.
const groupVariants = cva(
  'primer:inline-flex primer:isolate primer:align-middle primer:*:relative primer:*:rounded-none primer:*:hover:z-1 primer:*:focus-visible:z-1 primer:*:active:z-1',
  {
    variants: {
      orientation: {
        horizontal: 'primer:flex-row primer:*:first:rounded-s-md primer:*:last:rounded-e-md primer:*:not-first:-ms-px',
        vertical: 'primer:flex-col primer:*:first:rounded-t-md primer:*:last:rounded-b-md primer:*:not-first:-mt-px',
      },
    },
    defaultVariants: {orientation: 'horizontal'},
  },
)

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element to render as the group root.
   * @default 'div'
   */
  as?: React.ElementType
  /**
   * Direction the buttons are joined in.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Role of the group. A `toolbar` keeps one button in the tab order and moves focus between buttons with the arrow
   * keys in its orientation, Home, and End.
   * @default 'group'
   */
  role?: React.AriaRole
}

export const ButtonGroup = React.forwardRef<HTMLElement, ButtonGroupProps>(function ButtonGroup(
  {as: Component = 'div', children, className, orientation = 'horizontal', role = 'group', ...rest},
  ref,
) {
  const isToolbar = role === 'toolbar'
  const isVertical = orientation === 'vertical'
  const focusZoneRef = useFocusZone<HTMLElement>({
    bindKeys: [isVertical ? 'ArrowVertical' : 'ArrowHorizontal', 'HomeAndEnd'],
    disabled: !isToolbar,
    focusOutBehavior: 'wrap',
  })
  const groupRef = React.useMemo(() => mergeRefs(ref, focusZoneRef), [ref, focusZoneRef])

  return (
    <Component
      aria-orientation={isToolbar && isVertical ? 'vertical' : undefined}
      {...rest}
      ref={groupRef}
      role={role}
      data-component="ButtonGroup"
      data-orientation={orientation}
      className={cn(groupVariants({orientation}), className)}
    >
      {children}
    </Component>
  )
})

ButtonGroup.displayName = 'ButtonGroup'
