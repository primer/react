---
"@primer/react": minor
---
ActionList.Group: deprecate `title` prop - please use `ActionList.GroupHeading` instead
ActionList.GroupHeading: update the warning to be an error if there is no explict `as` prop for list `role` action lists. 
ActionList.GroupHeading: There shouldn't be an `as` prop on `ActionList.GroupHeading` for `listbox` or `menu` role action lists. console.error if there is one
