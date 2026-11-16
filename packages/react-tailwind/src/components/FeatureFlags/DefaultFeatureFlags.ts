import {FeatureFlagScope} from './FeatureFlagScope'

/** The flags this package reads, each off by default as in upstream. Unknown flags also read as off. */
export const DefaultFeatureFlags = FeatureFlagScope.create({
  primer_react_action_list_item_gap: false,
  primer_react_select_panel_fullscreen_on_narrow: false,
  primer_react_select_panel_order_selected_at_top: false,
})
