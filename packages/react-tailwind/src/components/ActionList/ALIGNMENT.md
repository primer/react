# Alignment

## From: `@primer/react`

Legacy ActionList is a broad compound list surface with groups, headings, visuals, descriptions, dividers, link items, selection variants, trailing actions, and older loading, inactive, and CSS-module-only visual variants.

## To: `@primer/react-tailwind`

The stable compound API provides `Root`, `Item`, `LinkItem`, `Group`, `GroupHeading`, `Description`, and `TrailingAction`. It preserves disabled, inactive, loading, selected, active, size, description, divider, group, link, and visual composition.

A trailing action is a sibling of the primary item action, so the markup never nests interactive controls. Menu selection follows Primer's checkmark convention rather than a filled item background.

## Migration notes

- `ActionList.Item` and `ActionList.LinkItem` accept `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`; `ActionList` and `ActionList.Group` accept `heading`; `ActionList.GroupHeading` accepts `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
- `ActionList.Heading` renders before the list, as upstream does, and the list is labelled by it. It accepts `size` (`small`, `medium`, or `large`) and `visuallyHidden`, and keeps an `id` you pass.
- `ActionList.GroupHeading.TrailingAction` renders a small invisible icon button or link, matching upstream, and a group that follows another item is always spaced from it, including a group with a filled heading.
- Use `loading` with `loadingText` for an unavailable item that is waiting on work. Loading items expose disabled semantics, render a shared spinner, and suppress trailing actions until ready. As upstream does, the spinner (and the inactive warning icon outside menus and listboxes) replaces the leading visual when the item has one and the trailing visual otherwise, so the selection indicator stays in place.
- Use `inactiveText` for supporting inactive status text, not a legacy inactive prop.
- While an enabled item's `TrailingAction` is `loading`, the item sets `data-trailing-action-loading` and keeps its label and description at the default foreground colour, as upstream does. A text trailing action shows its spinner at its end.
- Multiple `Description` children are preserved in author order instead of being collapsed by the legacy slot extractor. Use one description when strict legacy rendering is required.
- Use `size="small"` for compact items, `size="large"` for the spacious item geometry, and `GroupHeading variant="filled"` for a separated heading surface. `LinkItem` accepts the same `size`, plus `active` and `inactiveText`.
- When the `primer_react_action_list_item_gap` feature flag is on, items in a list contained by NavList are separated by a small gap. Pass `disableItemGap` to opt a list out. The container is identified internally rather than through upstream's `ActionList.ContainerContext` export.
- Upstream's private `_PrivateTooltipText` item prop is not ported; NavList renders its own tooltip with `tooltipText`.
- Selection indicators, visuals, and the label align to the first line of an item, as upstream does, so multi-line items keep their visuals at the top. The single-select checkmark uses the muted foreground colour. Multiple selection inside a menu also renders a checkmark rather than a checkbox, as upstream does.
- `showDividers` draws each divider above the item's content rather than across the whole row, so it starts after the selection indicator and leading visual. It is hidden for the first item, the item after an `ActionList.Divider`, and around active and hovered items. Items with an inline description paint the line twice, matching upstream's slightly stronger rule there.
- Item content inherits its colour from the item, so `variant="danger"` and inactive items tint their label, descriptions, and visuals together. The inactive warning keeps the attention colour. Custom item content that sets its own text colour will override this.
- CSS-module-only variants remain unsupported.
- Use `className` rather than `sx` or styled-system props.
