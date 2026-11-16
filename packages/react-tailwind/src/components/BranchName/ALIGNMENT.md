# Alignment

## From: `@primer/react`

Legacy BranchName presents branch text and icons and is commonly composed with Tooltip, clipboard announcements, and SelectPanel branch-picker controls.

## To: `@primer/react-tailwind`

BranchName remains a small presentational branch label with its documented `as` compatibility for simple rendered text. It keeps branch text, icon, and copy-state fixtures without taking ownership of overlays, clipboard announcements, or picker behavior. It does not use Base UI; Tooltip and SelectPanel are independent local components.

## Migration notes

- Compose Tooltip, live announcements, and selection controls around BranchName instead of expecting BranchName props for them.
- Use `as` only for simple presentational element replacement, not interactive trigger composition.
- Use `className` rather than `sx` or styled-system props.
- Clipboard announcement behavior remains an explicit consumer or LiveRegion concern.
