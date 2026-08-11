import {forwardRef} from 'react'
import type {ElementType} from 'react'
import {IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import type {SlotMarker} from '../utils/types/Slots'
import type {ActionListTrailingActionProps} from './TrailingAction'
import {mergeProps} from '../utils/mergeProps'

/**
 * Props for `ActionList.GroupHeading.TrailingAction`.
 *
 * Mirrors the shape of `ActionList.TrailingAction` so the API is consistent
 * across `ActionList.Item` and `ActionList.GroupHeading`. The only
 * difference is that `icon` is required here — group headings are not
 * interactive on their own, so the action must always render as a square
 * IconButton with a uniform hit target.
 */
export type ActionListGroupHeadingTrailingActionProps = Omit<ActionListTrailingActionProps, 'icon'> & {
  icon: ElementType
}

const GroupHeadingTrailingActionImpl = forwardRef(
  ({as = 'button', icon, label, href = null, tooltipDirection = 'w', ...props}, forwardedRef) => (
    <IconButton
      {...mergeProps(
        {
          as,
          'aria-label': label,
          icon,
          variant: 'invisible' as const,
          size: 'small' as const,
          tooltipDirection,
          href,
          'data-component': 'ActionList.GroupHeading.TrailingAction',
        },
        props,
      )}
      // @ts-expect-error StyledButton wants both Anchor and Button refs
      ref={forwardedRef}
    />
  ),
) as PolymorphicForwardRefComponent<'button' | 'a', ActionListGroupHeadingTrailingActionProps> & {
  __SLOT__?: SlotMarker
  displayName?: string
}

GroupHeadingTrailingActionImpl.displayName = 'ActionList.GroupHeading.TrailingAction'
GroupHeadingTrailingActionImpl.__SLOT__ = Symbol('ActionList.GroupHeading.TrailingAction')

export const GroupHeadingTrailingAction = GroupHeadingTrailingActionImpl
