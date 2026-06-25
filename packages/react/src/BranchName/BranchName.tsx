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

// `description` renders a tooltip (via aria-describedby), which needs an interactive trigger
// So it is only allowed on an anchor that has an `href`.

type BranchNameAsAnchorProps = PolymorphicProps<'a', 'a', {description?: never} | {description: string; href: string}>

// `as="span"`. A span is never interactive, so `description` is not allowed.
type BranchNameAsSpanProps = PolymorphicProps<'span', 'a', {description?: never}>

export type BranchNameProps = BranchNameAsAnchorProps | BranchNameAsSpanProps

// Wraps its child in a description tooltip, but only on an interactive trigger similar to the types above
const ConditionalTooltip: React.FC<React.PropsWithChildren<{description?: string; href?: string}>> = ({
  description,
  href,
  children,
}) => {
  if (!description || !href) return children
  return (
    <Tooltip text={description} type="description">
      {children}
    </Tooltip>
  )
}

function BranchNameComponent(props: BranchNameProps, ref: ForwardedRef<HTMLSpanElement | HTMLAnchorElement>) {
  const {as: Component = 'a', className, children, description, ...rest} = props as BranchNameAsAnchorProps

  const [slots, textChildren] = useSlots(children, {
    leadingVisual: LeadingVisual,
    trailingAction: TrailingAction,
  })

  const link = (
    <ConditionalTooltip description={description} href={rest.href}>
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
    <span className={classes.BranchNameWithTrailingAction}>
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
