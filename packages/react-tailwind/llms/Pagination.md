# Pagination

`Pagination` renders previous, next, and page links from a controlled current page and page count.

Import: `import {Pagination} from '@primer/react-tailwind/Pagination'`

Renders a [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `currentPage` (required): `number` — Page currently being viewed, counting from one.
- `data-component`: `string` — Default `'Pagination'`. Overrides the marker used to identify this element in tests and styling.
- `hrefBuilder`: `((page: number) => string)` — Default `` page => `#${page}` ``. Builds the URL for a page, so pagination works without JavaScript.
- `marginPageCount`: `number` — Default `1`. How many pages stay visible at each end of the range.
- `onPageChange`: `((event: MouseEvent<Element, MouseEvent>, page: number) => void)` — Called with the event and the requested page when a page is selected.
- `pageCount` (required): `number` — Total number of pages.
- `renderPage`: `((props: PageProps) => React.ReactNode)` — Renders each page link yourself, for integrating with a router.
- `showPages`: `ResponsiveValue<boolean>` — Default `true`. Shows the numbered pages. Accepts a responsive object to hide them on narrow viewports.
- `surroundingPageCount`: `number` — Default `2`. How many pages stay visible on each side of the current one.

## Differences from `@primer/react`

- `onPageChange(event, page)` keeps upstream's event-first signature rather than the package's usual `(value, details)` order, so existing handlers port unchanged.
- Existing page-state and link composition can generally be retained.
- Update custom `renderPage` code from legacy page metadata to `pageType`.
- Keep data fetching and current-page state outside the component.
- Remove `sx`, styled-system props, and selectors tied to legacy classes.
