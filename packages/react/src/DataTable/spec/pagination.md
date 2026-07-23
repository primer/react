# Pagination

Pagination provides controls for navigating a DataTable whose records are
divided into pages.

## Markup

```html
<nav aria-label="Pagination for Repositories">
  <!-- Unavailable controls expose aria-disabled -->
  <button type="button" aria-disabled="true">Previous page</button>
  <button type="button">1</button>
  <!-- Selected page exposes aria-current -->
  <button type="button" aria-current="page">2</button>
  <button type="button">3</button>
  <!-- Ellipsis before a truncated range is exposed to assistive technologies -->
  <span aria-label="…">…</span>
  <button type="button">10</button>
  <button type="button">Next page</button>
  <!-- Visual-only truncation indicator is hidden from assistive technologies -->
  <span aria-hidden="true">…</span>
</nav>
```

- Pagination MUST render a navigation landmark with an accessible name that
  identifies the related DataTable.
- Pagination MUST display the range of records represented by the selected
  page and the total record count.
- Previous-page, next-page, and visible page options MUST render as native
  buttons.
- When page options are rendered, the selected page button MUST expose
  `aria-current`.
- Unavailable previous-page and next-page controls MUST expose
  `aria-disabled="true"`.
- A visual truncation indicator for omitted page options MUST be hidden from
  assistive technologies.
- The page button immediately before a truncated range MUST expose an ellipsis
  as a continuation cue to assistive technologies.

## Behavior

- Page indexes MUST be zero-based.
- The initial selected page MUST be the first page unless a valid default page
  index is provided.
- The number of pages MUST be derived from the total record count and page
  size.
- Activating a different page, the previous-page control, or the next-page
  control MUST update the selected page and invoke the change callback with the
  new page index.
- Activating the selected page or an unavailable previous-page or next-page
  control MUST NOT invoke the change callback.
- Long page ranges MAY replace omitted page options with truncation indicators.
- Page-number buttons MAY be shown or hidden per viewport width range. When
  hidden at a given viewport width, only the Previous and Next controls and the
  record-range summary remain visible.

## Public API

- Pagination MUST manage page selection without changing DataTable rows.
  Consumers MUST use the page index reported by the change callback to provide
  the records for the selected page.
- The default page index MUST establish uncontrolled initial state. Consumers
  MUST initialize the displayed records from that index because the change
  callback MUST NOT be invoked for the initial render.
- The default page index MUST be greater than or equal to zero and less than the
  number of pages. An invalid initial value MUST produce a warning and fall back
  to the first page.
- Changing to a different valid default page index after the initial render
  MUST update the selected page and invoke the change callback.
- Changing to an invalid default page index after the initial render MUST NOT
  change the selected page or invoke the change callback.
- Consumers MUST compose Pagination with the DataTable it controls and place it
  outside of the semantic `table` element.

## Accessibility

- Each page button MUST have an accessible name that identifies its page.
- Previous-page and next-page controls MUST have accessible names that describe
  their destination.
- A page change MUST announce the displayed record range and total record count.
