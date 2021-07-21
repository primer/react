---
'@primer/components': patch
---

Deprecate system props from components that are not `Box`

The following components will be have system props removed:

Avatar
AvatarStack
BranchName
Breadcrumb
Button
ButtonBase
ButtonClose
ButtonTableList
CircleBadge
CounterLabel
Details
Dialog
Dropdown
FilteredSearch
FilterList
Flash
FormGroup
FormGroupLabel
Header
HeaderItem
Label
LabelGroup
Link
Overlay
Pagehead
Pagination
Popover
PopoverContent
SelectMenu
SelectMenuDivider
SelectMenuFilter
SelectMenuFooter
SelectMenuHeader
SelectMenuItem
SelectMenuList
SelectMenuLoadingAnimation
SelectMenuModal
SelectMenuTab
SelectMenuTabPanel
SelectMenuTabs
SideNav
Spinner
StateLabel
StyledOcticon
SubNav
TabNav
TabNavLink
TextInput
Timeline
Tooltip
Truncate
UnderlineNav

In place of these components, you should now put any system prop assignments in the `sx` prop. There is a codemod available to effectively handle this migration.

First, install jscodeshift:

`npm install -g jscodeshift`

Then, run the codemod using the appropriate command (examples given from the primer/components root directory)

typescript example:
`jscodeshift -t codemods/removeSystemProps.js --parser=tsx path/to/workspace/src/*.tsx`

babel example:
`jscodeshift -t codemods/removeSystemProps.js --parser=babel path/to/workspace/src/*.jsx`
