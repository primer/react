# UnderlineNav

`UnderlineNav` is a presentational navigation composition for sibling destinations. It keeps native link semantics, while consumers own route integration, item order, and selected state.

Import: `import {UnderlineNav} from '@primer/react-tailwind/UnderlineNav'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {UnderlineNav} from '@primer/react-tailwind/UnderlineNav'
;<UnderlineNav aria-label="Repository">
  <UnderlineNav.Item href="/code" aria-current="page">
    Code
  </UnderlineNav.Item>
</UnderlineNav>
```

Place `UnderlineNav.Item` links directly in the root, which renders them as a list. Items that do not fit move into a "More" menu, in order. Give the navigation landmark an accessible name and use one `aria-current="page"` item for the current destination. `Item` renders an anchor by default; use `as` to compose a router link when its props are compatible.

Native anchor items default to `href="#"`. When a custom component is supplied with `as`, no default `href` is added, so the component can supply its own navigation target. `UnderlineNav.Item` infers the selected component's props and ref, including router-specific props such as `to`. The router component must forward the supplied props and ref to its interactive element; the same navigation props are used in the overflow menu.

For a typed wrapper, use `UnderlineNavItemProps<typeof RouterLink>` to include the router's props. Unparameterized `UnderlineNavItemProps` and `React.ComponentProps<typeof UnderlineNav.Item>` retain the legacy anchor-shaped props and broadly typed `as`.

## Responsive behavior

The list keeps one visible row and moves items that do not fit into the "More" menu. `hideIconsBreakpoint` hides leading visuals at the selected root container width; set it to `null` to always show them. The default is `medium`, so icons show when the navigation is at least 768px wide. To keep icons visible in a narrow container, use a smaller breakpoint such as `xsmall`.

## Events and state

`onSelect` is called after an unprevented native click, which makes it suitable for client-side navigation. Keep selected state in the consuming application and update `aria-current` in response. `loadingCounters` replaces every supplied counter with a skeleton to reserve counter space while data loads.

## Accessibility

This is navigation, not a tablist: use destination links rather than `role="tab"` or arrow-key tab behavior. `CounterLabel` supplies an accessible counter label, and a loading counter is hidden from the accessible name until its value is available. Native links retain standard keyboard activation and focus behavior.

Renders a [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'nav'`. Element to render.
- `hideIconsBreakpoint`: `HideIconsBreakpoint` — Default `'medium'`. Container width below which item icons are hidden to save space. To keep icons visible in a narrow container, use a smaller breakpoint such as `xsmall`, or set to `null` to always show icons.
- `loadingCounters`: `boolean` — Default `false`. Shows placeholders in place of item counters while their values load.
- `variant`: `"flush" | "inset"` — Default `'inset'`. Whether the bar is inset from its container or sits flush against it.

## UnderlineNav.Item

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `As` — Default `'a'`. Element or component supplied by the wrapper.
- `className`: `string`
- `counter`: `string | number` — Number shown after the label.
- `leadingVisual`: `React.ReactNode` — Icon shown before the label.
- `onSelect`: `((event: MouseEvent<HTMLElement, MouseEvent>) => void)` — Called when the item is activated, from the bar or from the "More" menu.
- `ref`: `Ref<HTMLElement>`

## Differences from `@primer/react`

- **Parity — composition:** Place `UnderlineNav.Item` children directly inside `UnderlineNav`; the root renders the `ul` and a visually hidden "`aria-label` navigation" heading, as upstream does.
- **Parity — responsive overflow:** Items wrap onto a clipped second line and an `IntersectionObserver` moves them into a "More" menu, in document order. Clipped items stay mounted for measurement but are `aria-hidden` and removed from the tab order. The menu shows counters and marks the current item with a bold label and leading bar; like upstream, menu items omit leading visuals.
- **Parity — current item in the menu:** When the current item overflows, the "More" button gets `data-current` (drawing the active underline) and the accessible name "More items, including current item".
- **Parity — SSR overflow detection:** A scroll-driven animation on the root reveals the "More" button before hydration when the list already overflows, so server-rendered pages don't flash; JavaScript takes over after mount.
- **Intentional — selection:** The consumer owns `aria-current`; Tailwind does not inspect children or throw when more than one item is current.
- **Parity — counters and visuals:** `loadingCounters` renders a package skeleton for every supplied counter, and `hideIconsBreakpoint` supports the legacy breakpoint values, including `null`. Like upstream, it defaults to `medium`, so icons hide only when the navigation container is narrower than 48rem.
- **Parity — custom links:** Native anchor items default to `href="#"`; items rendered with a custom `as` component receive no default `href`, so router links can supply their own target. The "More" menu renders the same `as` component with its navigation props. Item props and refs follow the selected component, including required router props such as `to`; the custom component must forward its props and ref to the interactive element.
- **Parity — box sizing:** The root uses border-box sizing and a fixed `max-height`, matching upstream's wrap-mode `box-sizing`/`border` rules so overflow measurement never adds width.
- **Parity — interaction stories:** The `Interactions` stories tab through the visible items, open the "More" menu with the keyboard or pointer, and select an overflowing item. Upstream's versions don't await their events, so their plays fail on the first assertion and finish in a different focus state. A `beforeEach` hook, rather than the play, narrows the canvas to 800px and restores it afterwards.
- **Unsupported — deprecated API:** The legacy `icon` alias is omitted; use `leadingVisual`.
- **Intentional — events:** `onSelect` runs once after an unprevented native click, from the bar or the "More" menu. The legacy key handler could call it in addition to the click generated by Enter.
- **Unsupported — styling system:** Use `className`; `sx` and styled-system props are not available.
