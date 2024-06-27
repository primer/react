import {CircleBadge as CircleBadgeImpl, CircleBadgeIcon} from './CircleBadge'
import type {CircleBadgeProps, CircleBadgeIconProps} from './CircleBadge'

CircleBadgeIcon.displayName = 'CircleBadge.Icon'

export const CircleBadge = Object.assign(CircleBadgeImpl, {Icon: CircleBadgeIcon})

export type {CircleBadgeProps, CircleBadgeIconProps}
