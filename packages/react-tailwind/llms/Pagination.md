# Pagination

`Pagination` renders previous, next, and page links from a controlled current page and page count.

Import: `import {Pagination} from '@primer/react-tailwind/Pagination'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {Pagination} from '@primer/react-tailwind/Pagination'
;<Pagination pageCount={15} currentPage={3} />
```

Use `onPageChange` to coordinate a route or data view. `showPages` accepts a boolean or responsive map for compact narrow layouts.

## Custom router links

The complete router migration examples cover both legacy and Tailwind `renderPage` callbacks. Strip `number`, `pageType`, and `onPageSelect` before spreading link props. The callback no longer receives a React `key` or `data-component`; Pagination keys its enclosing Fragment, and the renderer can supply its own marker.

Disabled previous/next controls have no `href`. Render a non-link instead of inventing a fallback router destination. Preserve the provided class, children, accessible name, current-page state, and disabled state.

Previous and next controls keep their identity as their destination changes when the rendered element type and key stay the same. Consumers own pending-request behavior and must prevent repeated activation themselves; `aria-disabled` alone does not prevent navigation. Replacing a link with a disabled element can still change focus.

Forward the supplied `onClick` to your router link, not both `onClick` and `onPageSelect`. If `onPageChange` performs application navigation, guard modified/non-primary clicks, prevented events, and download/external-target behavior before calling `preventDefault()`. Both legacy and Tailwind callbacks receive modified clicks; unconditional cancellation breaks Cmd/Ctrl-click. Alternatively, let the router link own navigation and omit the navigation callback.

Accessible labels use `Next page` and `Previous page` instead of the legacy `Next Page` and `Previous Page`. Update exact-name queries or explicitly restore legacy labels in a custom renderer when required.

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

- `onPageChange(event, page)` keeps upstream's event-first signature rather than the package's usual `(value, details)` order. Both implementations forward modified click events; handlers that intercept navigation must guard them rather than unconditionally calling `preventDefault()`.
- Existing page-state and link composition can generally be retained.
- Update custom `renderPage` code from legacy page metadata to `pageType`.
- Keep data fetching and current-page state outside the component.
- Remove `sx`, styled-system props, and selectors tied to legacy classes.
- **Render metadata:** `renderPage` no longer receives legacy `key` or `data-component`. Pagination keys the enclosing Fragment; do not read `props.key` or forward a fabricated key onto the DOM. Strip `number`, `pageType`, and `onPageSelect` before spreading the remaining props onto a DOM element or router link. Add `data-component` explicitly when custom-render selectors are needed.
- **Disabled destinations:** disabled previous/next controls have `href: undefined` and no activation callback. Render a non-link for that branch; do not fabricate a fallback URL, use a non-null assertion on `href`, or rely on `aria-disabled` to stop a router link navigating.
- **Pending requests and focus:** previous and next controls keep their identity when the destination changes, provided a custom renderer keeps the same element type and key. Consumers own pending-request state and must prevent repeated activation; replacing an anchor with a disabled element can still change focus.
- **Accessible-name difference:** enabled legacy controls were named `Previous Page` and `Next Page`; the Tailwind controls use `Previous page` and `Next page`. Update exact-name queries or explicitly restore the legacy labels in `renderPage` when that compatibility is required. This does not change the visible `Previous`/`Next` text.
- **Custom-router migration:** the examples below use React Router's `Link`, which renders an anchor and forwards native link props. Before, the renderer received its own key and marker:

  ```tsx
  import {Pagination} from '@primer/react'
  import {Link as RouterLink} from 'react-router-dom'

  function RoutedPagination({currentPage}: {currentPage: number}) {
    return (
      <Pagination
        currentPage={currentPage}
        pageCount={10}
        hrefBuilder={page => `/issues?page=${page}`}
        renderPage={({key, number: _number, children, href, ...linkProps}) =>
          href === undefined ? (
            <span
              key={key}
              role="link"
              className={linkProps.className}
              aria-label={linkProps['aria-label']}
              aria-disabled={linkProps['aria-disabled']}
            >
              {children}
            </span>
          ) : (
            <RouterLink key={key} {...linkProps} to={href}>
              {children}
            </RouterLink>
          )
        }
      />
    )
  }
  ```

  After, remove callback-only metadata and supply any custom marker yourself. The owning Fragment provides the React key:

  ```tsx
  import {Pagination} from '@primer/react-tailwind/Pagination'
  import {Link as RouterLink} from 'react-router-dom'

  function RoutedPagination({currentPage}: {currentPage: number}) {
    return (
      <Pagination
        currentPage={currentPage}
        pageCount={10}
        hrefBuilder={page => `/issues?page=${page}`}
        renderPage={({number: _number, pageType, onPageSelect: _onPageSelect, children, href, ...linkProps}) => {
          const marker =
            pageType === 'previous'
              ? 'Pagination.PreviousPage'
              : pageType === 'next'
                ? 'Pagination.NextPage'
                : 'Pagination.Page'
          if (href === undefined) {
            return (
              <span
                role="link"
                className={linkProps.className}
                aria-label={linkProps['aria-label']}
                aria-disabled={linkProps['aria-disabled']}
                data-component={marker}
              >
                {children}
              </span>
            )
          }
          return (
            <RouterLink {...linkProps} to={href} data-component={marker}>
              {children}
            </RouterLink>
          )
        }}
      />
    )
  }
  ```

  Keep `children`, `className`, `rel`, `aria-current`, `aria-disabled`, the accessible name, and the supplied `onClick` on the actionable anchor. `onClick` and `onPageSelect` each call the same page-change callback: forward one, not both. Ellipses are rendered by Pagination itself rather than passed to `renderPage`, despite `pageType`'s declared union including `ellipsis`.

- **Modified-click handling:** the router examples above let `RouterLink` own navigation and do not intercept it. If `onPageChange` also performs application navigation, guard primary activation, modifiers, an already-prevented event, and external-target/download behavior before cancelling the native action. For example, inside a component using React Router:

  ```tsx
  import {useNavigate} from 'react-router-dom'
  import type {PaginationProps} from '@primer/react-tailwind/Pagination'

  const navigate = useNavigate()
  const onPageChange: NonNullable<PaginationProps['onPageChange']> = (event, page) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    const link = event.currentTarget
    if (
      link instanceof HTMLAnchorElement &&
      (link.hasAttribute('download') || (link.target !== '' && link.target !== '_self'))
    ) {
      return
    }
    event.preventDefault()
    navigate(`/issues?page=${page}`)
  }
  ```

  Pass this handler as `onPageChange={onPageChange}`. Modified clicks remain browser-owned, so Cmd/Ctrl-click does not change the current view or get cancelled. Middle-button activation, context-menu navigation, keyboard Enter, and disabled controls also need coverage in the consumer's real router. The callback guard is consumer logic, not a new package-level suppression of modified clicks.
