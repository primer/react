import {forwardRef, type ElementType, type CSSProperties} from 'react'
import {IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import type {SlotMarker} from '../utils/types/Slots'

type ElementProps =
  | {
      as?: 'button'
      href?: never
    }
  | {
      as: 'a'
      href: string
    }

export type ActionListGroupHeadingTrailingActionProps = ElementProps & {
  /** Octicon to render inside the IconButton. Required because the action
   *  must always render as a square icon button — group headings are not
   *  interactive on their own, so the action needs a uniform, predictable
   *  hit target. */
  icon: ElementType
  /** Accessible label for the IconButton. */
  label: string
  /** Size of the underlying IconButton. Defaults to `small` to match the
   *  compact heading row visual. */
  size?: 'small' | 'medium' | 'large'
  className?: string
  style?: CSSProperties
}

const GroupHeadingTrailingActionImpl = forwardRef(
  ({as = 'button', icon, label, href = null, size = 'small', className, style, ...props}, forwardedRef) => {
    return (
      <IconButton
        as={as}
        aria-label={label}
        icon={icon}
        variant="invisible"
        size={size}
        tooltipDirection="w"
        href={href}
        // @ts-expect-error StyledButton wants both Anchor and Button refs
        ref={forwardedRef}
        className={className}
        style={style}
        data-component="ActionList.GroupHeading.TrailingAction"
        {...props}
      />
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ActionListGroupHeadingTrailingActionProps> & {
  __SLOT__?: SlotMarker
  displayName?: string
}

GroupHeadingTrailingActionImpl.displayName = 'ActionList.GroupHeading.TrailingAction'
GroupHeadingTrailingActionImpl.__SLOT__ = Symbol('ActionList.GroupHeading.TrailingAction')

export const GroupHeadingTrailingAction = GroupHeadingTrailingActionImpl
