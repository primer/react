# Default

DataTable renders structured row data from a collection of column definitions.

## Markup

```html
<table>
  <thead>
    <tr>
      <th scope="col">Column header</th>
      <!-- Row header column -->
      <th scope="col">Row identifier</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell value</td>
      <!-- Row header cell -->
      <th scope="row">Row identifier value</th>
    </tr>
  </tbody>
</table>
```

- DataTable MUST render a semantic `table` containing a header row and a body
  row for each item in the data collection.
- DataTable MUST render one column header row.
- Each column MUST render a `th` with `scope="col"` in the header row.
- Each data value MUST render as a `td` unless its column is identified as a row
  header.
- A row header MUST render as a `th` with `scope="row"`.
- The header and body MUST render as separate row groups.

## Behavior

- Columns MUST render in the order in which they are provided.
- Rows MUST render in the order in which they are provided unless the
  [sorting](./sorting.md) feature changes that order.
- A column with a field MUST read the corresponding value from each row,
  including values referenced by a nested field path.
- A custom cell renderer MUST receive the complete row and its rendered result
  MUST replace the field value for that cell.
- The row identifier returned for each row MUST be used as its stable identity.
- An empty data collection MUST render the column header row with no body rows.
  DataTable MUST NOT substitute a loading or empty-state presentation.

## Public API

- Every column MUST define either a field or an explicit identifier.
- A column without a field MUST provide a custom cell renderer.
- When both a field and custom cell renderer are provided, the custom renderer
  MUST determine the rendered cell content.
- Column definitions represent one header and one cell per row. Grouped headers
  and cells that span rows or columns are not supported.
- `Table` MUST forward its ref to the semantic `table` element.

## Accessibility

- The table, header row group, body row group, rows, column headers, row
  headers, and cells MUST expose their corresponding table roles.
