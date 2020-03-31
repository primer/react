---
title: Pagination
---
import State from '../components/State'

Use the pagination component to create a connected set of links that go to related pages (for example, previous, next, or page numbers).

## Basic example

The pagination component only requires two properties to function: `pages`, which is the total number of pages, and `currentPage`, which is the currently selected page (which should be managed by the consuming application). However, to handle state changes when the user clicks a page, you also need to pass `onPageChange`, which is a function that takes a click event and page number as an argument:

```javascript
type PageChangeCallback = (evt: React.MouseEvent, page: number) => void
```

By default, clicking a link in the pagination component will cause the browser to navigate to the URL specified by the page. To cancel navigation and handle state management on your own, you should call `preventDefault` on the event, like in the `onPageChange` function defined in this example:

```jsx live
<State default={9}>
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
          pages={totalPages}
          currentPage={page}
          onPageChange={onPageChange}
        />
      </BorderBox>
    )
  }}
</State>
```

## Previous/next pagination

You can make a simple pagination container with just the Previous and Next buttons by setting `showPages` to `false`. You still need to define the total number of pages and the current page so that the component calculates the correct styles.

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
          pages={totalPages}
          currentPage={page}
          onPageChange={onPageChange}
          showPages={false}
        />
      </BorderBox>
    )
  }}
</State>
```
