# Alignment

## From: `@primer/react`

`ScrollableRegion` renders a `div` with `position: relative` and `overflow: auto`. When either axis overflows, it adds `role="region"`, the supplied accessible name, and `tabIndex={0}`. The public props are the native `div` props plus the requirement to provide `aria-label` or `aria-labelledby`; the component does not provide a separate focus, dialog, or virtualized-list behavior.

## To: `@primer/react-tailwind`

Tailwind `ScrollableRegion` preserves the native scroll container and overflow-triggered region semantics with static Tailwind utilities. It forwards the root ref and DOM props, remains React 19 and SSR compatible, and uses an internal overflow observer rather than a Base UI primitive. It intentionally does not add masks, shadows, custom scrollbar styling, or a responsive direction prop because those are not part of the source component's behavior.

The overflow state is updated for resize, child, text, and attribute changes, and can return to the non-region state when overflow is removed. A focused region retains its semantics until focus leaves, preventing focus loss. This differs from the source implementation, which only transitions to the overflow state.

## Migration notes

- Existing children, native scrolling props, accessible-name props, and scroll usage can generally be retained.
- A focused scroll region retains its name and tab stop until focus leaves if its content stops overflowing.
- Replace CSS-module selectors with Tailwind utilities or `className` styles.
- The Tailwind package does not support legacy CSS-module selectors or styled-system APIs.
