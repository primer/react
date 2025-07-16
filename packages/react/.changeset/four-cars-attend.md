---
'@primer/react': minor
---

SelectPanel: Remove `aria-activedescendant` from SelectPanel

- Remove aria-activedescendant pattern from modern ActionList implementation (when `primer_react_select_panel_with_modern_action_list` feature flag is enabled)
- Replace with roving tabindex behavior for better accessibility 
- Simplify announcement logic since roving tabindex provides focus announcements automatically
- This change only affects SelectPanel when using the modern ActionList feature flag
