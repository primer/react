# Alignment

## From: `@primer/react`

`Pagination` renders a navigation list of page links with previous/next controls and selected-page state. Its public API includes page-count/current page state, `showPages`, margin/surrounding counts, `hrefBuilder`, and the `renderPage` escape hatch receiving legacy `PageProps`. CSS modules and styled-system props supply the presentation. It is a presentational navigation component; page state and data fetching remain the consumer's responsibility.

## To: `@primer/react-tailwind`

Tailwind preserves the `Pagination` API and `renderPage` composition while using native links, Tailwind utilities, and Primer semantic tokens. Its `renderPage` callback receives `PageProps` with the new `pageType` (`previous`, `next`, `page`, or `ellipsis`) field. Selected, disabled, previous, and next states remain visual/semantic states owned by the rendered controls. No Base UI primitive is involved, and CSS-module/styled-system styling is not retained.

## Migration notes

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
