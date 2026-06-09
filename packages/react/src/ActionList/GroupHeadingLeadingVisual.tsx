import React from 'react'
import {clsx} from 'clsx'
import groupClasses from './Group.module.css'
import type {FCWithSlotMarker} from '../utils/types/Slots'

/**
 * Props for `ActionList.GroupHeading.LeadingVisual`.
 *
 * Mirrors the shape of `ActionList.LeadingVisual` so the API is consistent
 * across `ActionList.Item` and `ActionList.GroupHeading`. The leading visual is
 * decorative (typically an icon) and renders before the group heading text.
 */
export type ActionListGroupHeadingLeadingVisualProps = React.HTMLAttributes<HTMLSpanElement>

const GroupHeadingLeadingVisualImpl: FCWithSlotMarker<
  React.PropsWithChildren<ActionListGroupHeadingLeadingVisualProps>
> = ({className, ...props}) => {
  return (
    <span
      className={clsx(className, groupClasses.GroupHeadingLeadingVisual)}
      data-component="ActionList.GroupHeading.LeadingVisual"
      {...props}
    >
      {props.children}
    </span>
  )
}

GroupHeadingLeadingVisualImpl.displayName = 'ActionList.GroupHeading.LeadingVisual'
GroupHeadingLeadingVisualImpl.__SLOT__ = Symbol('ActionList.GroupHeading.LeadingVisual')

export const GroupHeadingLeadingVisual = GroupHeadingLeadingVisualImpl
