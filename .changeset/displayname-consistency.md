---
'@primer/react': patch
---

Normalise component `displayName` strings to the canonical `Parent.Slot` convention, and add `displayName` to compound sub-components and `forwardRef`-wrapped components that were missing it.

- Renames sub-component `displayName` strings that were using camelCase without a separator to the canonical `Parent.Slot` convention: `BannerPrimaryAction` → `Banner.PrimaryAction`, `BannerSecondaryAction` → `Banner.SecondaryAction`, `Summary` → `Details.Summary`, `TimelineItem|Body|Break` → `Timeline.Item|Body|Break`, `ParentLink|TitleArea` → `PageHeader.ParentLink|TitleArea`, `HorizontalDivider|VerticalDivider` → `PageLayout.HorizontalDivider|VerticalDivider`.
- Adds `displayName` to compound sub-components where the runtime function name doesn't match the canonical name users see (e.g. `Visual` → `Blankslate.Visual`, `SegmentedControlButton` → `SegmentedControl.Button`, `Panel` → `SelectPanel`, `FormControlCaption` → `FormControl.Caption`, etc.) and to `forwardRef`-wrapped components with anonymous inner arrow functions where DevTools would otherwise show `ForwardRef`.
- Adds a contributor skill at `.github/skills/display-name/SKILL.md` documenting when `displayName` is required vs redundant, the canonical naming convention, and how it interacts with the slot system.

No runtime behaviour changes.