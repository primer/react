# Loading and errors

Loading and error states communicate that table content is unavailable while it
is being retrieved or could not be retrieved.

## Markup

- `Table.Skeleton` MUST render a semantic table with the provided column
  headers.
- Each skeleton cell MUST expose loading text to assistive technologies.
- `Table.ErrorDialog` MUST render an alert dialog with Retry and Dismiss
  controls.

## Behavior

- The configured row count MUST determine the number of visual placeholders in
  each skeleton column; it MUST NOT create that number of semantic table rows.
- Retrying an error MUST invoke the retry handler. Dismissing an error MUST
  invoke the dismiss handler.

## Public API

- DataTable MUST NOT infer loading or error state from its data. Consumers MUST
  compose `Table.Skeleton` or `Table.ErrorDialog` around DataTable when needed.

## Accessibility

- Consumers MUST provide the same accessible naming and description
  relationships to a skeleton that they provide to the loaded DataTable.
- Loading animation MUST respect the user's reduced-motion preference.
- An error dialog MUST preserve the keyboard and focus behavior of the dialog
  primitive.
