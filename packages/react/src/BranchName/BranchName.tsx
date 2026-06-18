import type React from 'react'
import {forwardRef, type ForwardedRef} from 'react'
import {clsx} from 'clsx'
import type {IconProps} from '@primer/octicons-react'
import classes from './BranchName.module.css'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'
import {useSlots} from '../hooks/useSlots'
import type {FCWithSlotMarker, WithSlotMarker} from '../utils/types'
import {IconButton} from '../Button'
import {Tooltip} from '../TooltipV2'

type LeadingVisualProps = React.ComponentPropsWithoutRef<'span'>

const LeadingVisual: FCWithSlotMarker<LeadingVisualProps> = ({children, ...rest}) => {
  return (
    <span {...rest} data-component="BranchName.LeadingVisual">
      {children}
    </span>
  )
}

LeadingVisual.displayName = 'BranchName.LeadingVisual'
LeadingVisual.__SLOT__ = Symbol('BranchName.LeadingVisual')

type TrailingActionProps = {
  icon: React.ComponentType<React.PropsWithChildren<IconProps>>
  'aria-label': string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'aria-labelledby'>

const TrailingAction = forwardRef<HTMLButtonElement, TrailingActionProps>(
  ({icon, 'aria-label': ariaLabel, ...rest}, ref) => {
    return (
      <span data-component="BranchName.TrailingAction">
        <IconButton ref={ref} icon={icon} aria-label={ariaLabel} variant="invisible" size="small" {...rest} />
      </span>
    )
  },
)

TrailingAction.displayName = 'BranchName.TrailingAction'
;(TrailingAction as WithSlotMarker<typeof TrailingAction>).__SLOT__ = Symbol('BranchName.TrailingAction')

export type BranchNameProps<As extends 'span' | 'a'> = PolymorphicProps<
  As,
  'a',
  {
    className?: string
    /** Description tooltip text (renders as aria-describedby) */
    description?: string
  }
>

// Wraps its child in a description tooltip only when `description` is provided.
const ConditionalTooltip: React.FC<React.PropsWithChildren<{description?: string}>> = ({description, children}) => {
  if (!description) return children
  return (
    <Tooltip text={description} type="description">
      {children}
    </Tooltip>
  )
}

function BranchNameComponent<As extends 'span' | 'a'>(
  props: BranchNameProps<As>,
  ref: ForwardedRef<HTMLSpanElement | HTMLAnchorElement>,
) {
  const {as: Component = 'a', className, children, description, ...rest} = props as BranchNameProps<'a'>

  const [slots, textChildren] = useSlots(children, {
    leadingVisual: LeadingVisual,
    trailingAction: TrailingAction,
  })

  const link = (
    <ConditionalTooltip description={description}>
      <Component
        {...rest}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={clsx(className, classes.BranchName)}
        data-component="BranchName"
      >
        {slots.leadingVisual}
        {textChildren}
      </Component>
    </ConditionalTooltip>
  )

  // Without a trailing action, render the link on its own.
  if (!slots.trailingAction) return link

  // With a trailing action, render the action as a sibling of the link
  return (
    <span className={classes.BranchNameWithTrailingAction} data-component="BranchName.WrapperWithAction">
      {link}
      {slots.trailingAction}
    </span>
  )
}

BranchNameComponent.displayName = 'BranchName'

const BranchName = Object.assign(fixedForwardRef(BranchNameComponent), {
  LeadingVisual,
  TrailingAction,
})

export default BranchName
