# DataTable spec

DataTable presents a collection of records as rows and the fields for each
record as columns. It supports sortable columns and may be composed with
pagination controls, actions, and loading or error states.

## Accessibility

- DataTable MUST provide native table semantics and the relationships between
  column headers, row headers, and data cells.
- Consumers MUST provide an accessible name by referencing a title with
  `aria-labelledby`. The referenced title MAY be rendered with `Table.Title`,
  visually hidden, or provided elsewhere on the page.
- Consumers MAY reference supplementary text with `aria-describedby`.
- When horizontal overflow is detected, DataTable MUST automatically make its
  scroll container a focusable region named by the table title.

## Features

- [Default](./default.md)
- [Header and actions](./header-and-actions.md)
- [Sorting](./sorting.md)
- [Pagination](./pagination.md)
- [Row actions](./row-actions.md)
- [Loading and errors](./loading-and-errors.md)

## Log

<!-- Record notable decisions and significant spec changes in reverse-chronological order. -->
