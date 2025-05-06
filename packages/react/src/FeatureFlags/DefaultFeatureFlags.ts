import {FeatureFlagScope} from './FeatureFlagScope'

const featureFlags = [
  'primer_react_css_modules_ga',
  'primer_react_action_list_item_as_button',
  'primer_react_select_panel_with_modern_action_list',
  'primer_react_overlay_overflow',
  'primer_react_segmented_control_tooltip',
  'primer_react_select_panel_fullscreen_on_narrow',
] as const

type FeatureFlag = (typeof featureFlags)[number]

const defaultFlags: Record<FeatureFlag, boolean> = {
  primer_react_css_modules_ga: false,
  primer_react_action_list_item_as_button: false,
  primer_react_select_panel_with_modern_action_list: false,
  primer_react_overlay_overflow: false,
  primer_react_segmented_control_tooltip: false,
  primer_react_select_panel_fullscreen_on_narrow: false,
}

const DefaultFeatureFlags = FeatureFlagScope.create(defaultFlags)

export {DefaultFeatureFlags, featureFlags}
export type {FeatureFlag}
