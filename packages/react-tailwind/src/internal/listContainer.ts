'use client'

import React from 'react'
import {useFeatureFlag} from '../components/FeatureFlags/useFeatureFlag'

export const itemGapFeatureFlag = 'primer_react_action_list_item_gap'

/** Names the component that renders a list, so the list can adopt that container's treatment. */
export const ListContainerContext = React.createContext<'NavList' | undefined>(undefined)

/**
 * Whether sibling items get a small gap between them. The gap is gated behind a feature flag,
 * applies only to navigation lists, and can be opted out of per list.
 */
export function useItemGap(disableItemGap = false) {
  const enabled = useFeatureFlag(itemGapFeatureFlag)
  const container = React.useContext(ListContainerContext)
  return enabled && !disableItemGap && container === 'NavList'
}
