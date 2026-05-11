---
'@primer/react': minor
---

ActionList: Add support for `ActionList.TrailingAction` as a child of `ActionList.GroupHeading`. When the `primer_react_action_list_group_heading_trailing_action` feature flag is enabled, a single trailing action passed inside `ActionList.GroupHeading` renders as a sibling of the heading element (not inside it), enabling header-level actions on grouped lists. Only supported for the default `list` role; using it inside an `ActionList` with `role="menu"` or `role="listbox"` (e.g. `ActionMenu`, `SelectPanel`) will throw.
