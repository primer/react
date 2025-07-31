import {FeatureFlagScope} from './FeatureFlagScope'

export const DefaultFeatureFlags = FeatureFlagScope.create({
  primer_react_action_list_item_as_button: false,
  primer_react_overlay_overflow: false,
  primer_react_segmented_control_tooltip: false,
  primer_react_select_panel_fullscreen_on_narrow: false,
  primer_react_select_panel_order_selected_at_top: false,
  primer_react_select_panel_remove_active_descendant: false,
})
