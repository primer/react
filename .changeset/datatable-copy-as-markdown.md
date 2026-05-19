---
'@primer/react': minor
---

DataTable: Add `Table.CopyAsMarkdownButton` for copying visible rows as a
GitHub-flavoured Markdown table. The button is a slot designed for
composition inside `<Table.Actions>`. Cell values are projected via a new
optional `Column.getExportValue` (preferred) or the field value — never
`renderCell`, so React/JSX output stays out of the plain-text payload.
Pipes, newlines, and ASCII/Unicode control characters are escaped or
stripped before reaching the clipboard. The implementation prefers the
async Clipboard API and falls back to `document.execCommand('copy')` for
non-secure contexts.
