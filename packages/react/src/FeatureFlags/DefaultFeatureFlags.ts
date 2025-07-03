import {FeatureFlagScope} from './FeatureFlagScope'

export const DefaultFeatureFlags = FeatureFlagScope.create({
  primer_react_css_modules_ga: false,
  primer_react_action_list_item_as_button: false,
  primer_react_select_panel_with_modern_action_list: false,
  primer_react_overlay_overflow: false,
  primer_react_segmented_control_tooltip: false,
  primer_react_select_panel_fullscreen_on_narrow: false,
  primer_react_select_panel_order_selected_at_top: false,
})
