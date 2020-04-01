---
title: Pagination
---
import State from '../components/State'

Use the pagination component to create a connected set of links that go to related pages (for example, previous, next, or page numbers).

## Basic example

The pagination component only requires two properties to render: `pageCount`, which is the total number of pages, and `currentPage`, which is the currently selected page number (which should be managed by the consuming application).

```jsx live
<Pagination
  pageCount={10}
  currentPage={2}
  onPageChange={e => e.preventDefault()}
/>
```

However, to handle state changes when the user clicks a page, you also need to pass `onPageChange`, which is a function that takes a click event and page number as an argument:

```javascript
type PageChangeCallback = (evt: React.MouseEvent, page: number) => void
```

By default, clicking a link in the pagination component will cause the browser to navigate to the URL specified by the page. To cancel navigation and handle state management on your own, you should call `preventDefault` on the event, as in this example:

```jsx live
<State default={1}>
  {([page, setPage]) => {
    const totalPages = 15
    const onPageChange = (evt, page) => {
      evt.preventDefault()
      setPage(page)
    }

    return (
      <BorderBox p={2}>
        <Box>Current page: {page} / {totalPages}</Box>
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={onPageChange}
        />
      </BorderBox>
    )
  }}
</State>
```

## Customizing link URLs

To customize the URL generated for each link, you can pass a function to the `hrefBuilder` property. The function should take a page number as an argument and return a URL to use for the link.

```javascript
type HrefBuilder = (page: number) => string
```

```jsx live
<State default={'(nothing clicked yet)'}>
  {([lastUrl, setLastUrl]) => {
    const onPageChange = (evt, page) => {
      evt.preventDefault()
      setLastUrl(evt.target.href)
    }
    const hrefBuilder = (page) => {
      return `https://example.com/pages/${page}`
    }

    return (
      <BorderBox p={2}>
        <Box>The last URL clicked was: {lastUrl}</Box>
        <Pagination
          pageCount={10}
          currentPage={2}
          onPageChange={onPageChange}
          hrefBuilder={hrefBuilder}
        />
      </BorderBox>
    )
  }}
</State>
```

## Customizing which pages are shown

Two props control how many links are displayed in the pagination container at any given time. `marginPageCount` controls how many pages are guaranteed to be displayed on the left and right of the component; `surroundingPageCount` controls how many pages will be displayed to the left and right of the current page.

```jsx live
<Pagination
  pageCount={20}
  currentPage={10}
  marginPageCount={1}
  surroundingPageCount={2}
  onPageChange={e => e.preventDefault()}
/>
```

The algorithm tries to minimize the amount the component shrinks and grows as the user changes pages; for this reason, if any of the pages in the margin (controlled via `marginPageCount`) intersect with pages in the center (controlled by `surroundingPageCount`), the center section will be shifted to the right. Consider the following examples, where pages one through six are shown when any of the first four pages are selected. Only when the fifth page is selected and there is a gap between the margin pages and the center pages does a break element appear.

```jsx live
<Box>
  {[1, 2, 3, 4, 5].map(page => (
    <Pagination
      pageCount={20}
      currentPage={page}
      marginPageCount={1}
      surroundingPageCount={2}
      onPageChange={e => e.preventDefault()}
    />
  ))}
</Box>
```

### Previous/next pagination

To hide all the page numbers and create a simple pagination container with just the Previous and Next buttons, set `showPages` to `false`.

```jsx live
<State default={1}>
  {([page, setPage]) => {
    const totalPages = 10
    const onPageChange = (evt, page) => {
      evt.preventDefault()
      setPage(page)
    }

    return (
      <BorderBox p={2}>
        <Box>Current page: {page} / {totalPages}</Box>
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={onPageChange}
          showPages={false}
        />
      </BorderBox>
    )
  }}
</State>
```
