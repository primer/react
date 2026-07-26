# Alignment

## From: `@primer/react`

Legacy DataTable combines table rendering with query loading/error state, pagination, action menus, grid-based column sizing, sorting, and a product-oriented error dialog.

## To: `@primer/react-tailwind`

DataTable preserves native table semantics, nested field paths, columns, caller-owned row identity, column widths, initial and external sorting, and `onToggleSort`. It also exposes composable parts for head, body, rows, headers, sortable headers, cells, container, title, subtitle, actions, skeletons, and pagination.

## Migration notes

- **Intentional:** Fetching, error dialogs, and product action menus are not configuration props on the base table. Compose `Table.Skeleton`, `Table.Pagination`, `ActionMenu`, and error UI in the application instead.
- **Intentional:** Legacy `Table.Title` and `Table.Subtitle` accepted arbitrary `as` elements. Tailwind's parts preserve predictable native `h2` and `p` semantics; use `Heading` or consumer-authored labelled content for another structure.
- `Table.Pagination` composes the shared `Pagination` model and controls while preserving DataTable's zero-based page index, visible item range, responsive page visibility, and footer geometry.
- Column sizing uses a single CSS Grid template with nested subgrids on native table groups and rows, so `width`, `minWidth`, and `maxWidth` preserve the legacy distribution without duplicating width styles on cells.
- Use `externalSorting` and `onToggleSort` when sorting is owned by the caller. Use `className` instead of `sx` or styled-system props.
