# Header and actions

The DataTable header provides the table's title, optional supplementary
description, and optional actions that apply to the table as a whole.

## Markup

- `Table.Title` MUST render an `h2` by default and MUST place its identifier on
  that heading.
- `Table.Subtitle` MUST place its identifier on its rendered element.
- Consumers MUST place `Table.Actions` outside of the semantic `table`.
- A divider between header content and the table MUST be presentational.

## Behavior

- `Table.Title` MUST allow consumers to select a heading level appropriate for
  the surrounding page.
- `Table.Subtitle` MUST allow consumers to select the semantic element used for
  supplementary content.

## Public API

- `Table.Title` and `Table.Subtitle` MUST NOT automatically label or describe
  DataTable. Consumers MUST reference their identifiers with
  `aria-labelledby` and `aria-describedby`, respectively.
- A heading rendered elsewhere on the page MAY be referenced instead of using
  `Table.Title`.
- `Table.Title` MUST forward its ref to the rendered title element.

## Accessibility

- Consumers MUST ensure that the referenced title is available to assistive
  technologies.
- `Table.Actions` does not assign group semantics or accessible names.
  Consumers MUST provide accessible names for action controls and any grouping
  required by the surrounding interface.
