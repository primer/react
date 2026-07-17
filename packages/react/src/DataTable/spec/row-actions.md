# Row actions

Row actions allow consumers to perform operations whose scope is one DataTable
row by rendering controls in a custom cell.

## Markup

- DataTable MUST render row-action controls inside the cell produced by the
  column's custom cell renderer.
- The row-action column MUST have a column header like every other column.

## Behavior

- DataTable MUST pass the complete row to the custom cell renderer.
- DataTable MUST NOT handle row-action activation or menu state.

## Public API

- A fieldless row-action column MUST define an explicit identifier and a custom
  cell renderer.

## Accessibility

- Consumers SHOULD place row actions in the final column and provide a visible
  or visually hidden heading that identifies the column as actions.
- Consumers MUST give each repeated row action an accessible name containing
  the operation and enough row-specific context to identify the affected row.
- Consumers are responsible for the keyboard and focus behavior of controls
  rendered inside a custom cell.
