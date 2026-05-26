import {FeatureFlagScope} from './FeatureFlagScope'

export const DefaultFeatureFlags = FeatureFlagScope.create({
  primer_react_css_anchor_positioning: false,
  primer_react_select_panel_fullscreen_on_narrow: false,
  primer_react_select_panel_order_selected_at_top: false,
  primer_react_styled_react_use_primer_theme_providers: false,
  primer_react_action_list_group_heading_trailing_action: false,
})
