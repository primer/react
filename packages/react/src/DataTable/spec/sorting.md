# Sorting

Sorting allows consumers to identify sortable columns and order rows by one
column at a time.

## Markup

```html
<table>
  <thead>
    <tr>
      <!-- Active sorted column exposes aria-sort -->
      <th scope="col" aria-sort="ascending">
        <button type="button">Name</button>
      </th>
      <!-- Unsorted sortable columns do not expose aria-sort -->
      <th scope="col">
        <button type="button">Updated</button>
      </th>
      <!-- Non-sortable columns render plain headers -->
      <th scope="col">Type</th>
    </tr>
  </thead>
  <!-- ... -->
</table>
```

- A sortable column header MUST contain a native button that includes the
  column heading.
- The active sorted column header MUST expose `aria-sort="ascending"` or
  `aria-sort="descending"` to match its current direction.
- Column headers that are not actively sorted MUST NOT expose `aria-sort`.

## Behavior

- Activating an unsorted column MUST sort it in ascending order.
- Activating the currently sorted column MUST alternate between ascending and
  descending order. Sorting MUST NOT cycle through an unsorted state.
- Activating a different sortable column MUST make it the active column and
  start it in ascending order.
- Built-in sorting MUST support basic value comparison, natural alphanumeric
  comparison, and date-time comparison.
- A custom sort function MUST receive complete row values rather than only the
  column field values when sorting a field-backed column.
- For built-in field-based sorting, blank values (`null`, `undefined`, and the
  empty string) MUST appear after populated values in both sort directions.
- When external sorting is enabled, activating a sortable column MUST update
  the displayed sort direction and invoke the sort callback without reordering
  the provided rows.
- DataTable MUST maintain sort state for at most one column at a time.
- Internal sorting MUST reorder only the rows in the provided data collection.
- When the columns change and no longer include the active sort column,
  DataTable MUST clear the sort state.
- When the data collection changes, internal sorting MUST apply the current sort
  state to the new rows.

## Public API

- An initial sort column MUST correspond to the identifier or field of a
  sortable column.
- When an initial sort column is provided without an initial direction, the
  direction MUST default to ascending.
- When only an initial direction is provided, it MUST apply to the first
  sortable column.
- Initial sort options describe the order of the provided data; consumers MUST
  provide the data in that initial order.
- Initial sort options MUST establish uncontrolled initial state. Changes to
  those options after the initial render MUST NOT control the active sort
  column or direction.
- The sort callback MUST receive the active column identifier and its new
  ascending or descending direction after an interaction. It MUST NOT be called
  for the initial render.
- When external sorting is enabled, consumers MUST use the sort callback to
  provide the reordered data.

## Accessibility

- Sort controls MUST be operable with pointer input and with the Enter and Space
  keys.
- An unsorted sortable column MUST communicate that activating its control will
  sort the column in ascending order.
- The active sort direction MUST be programmatically determinable from the
  column header.
