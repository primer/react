# Pagination

`Pagination` renders previous, next, and page links from a controlled current page and page count.

Import: `import {Pagination} from '@primer/react-tailwind/Pagination'`

## Props

- `currentPage`: `number`
- `data-component`: `string` — Default `'Pagination'`.
- `hrefBuilder`: `(page: number) => string` — Default `defaultHrefBuilder`.
- `marginPageCount`: `number` — Default `1`.
- `onPageChange`: `(event: React.MouseEvent, page: number) => void`
- `pageCount`: `number`
- `renderPage`: `(props: PageProps) => React.ReactNode`
- `showPages`: `boolean | ResponsiveValue<boolean>` — Default `true`.
- `surroundingPageCount`: `number` — Default `2`.

## Page props

- `children`: `React.ReactNode`
- `number`: `number`
- `onPageSelect`: `React.MouseEventHandler`
- `pageType`: `PageType`

## Differences from `@primer/react`

- `onPageChange(event, page)` keeps upstream's event-first signature rather than the package's usual `(value, details)` order, so existing handlers port unchanged.

