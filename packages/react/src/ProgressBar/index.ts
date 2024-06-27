import {ProgressBar as Bar, Item} from './ProgressBar'

import type {ProgressBarProps} from './ProgressBar'

Bar.displayName = 'ProgressBar'
Item.displayName = 'ProgressBar.Item'

/**
 * Collection of ProgressBar related components.
 */
export const ProgressBar = Object.assign(Bar, {Item})

export type {ProgressBarProps}
