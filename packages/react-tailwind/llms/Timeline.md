# Timeline

`Timeline` is a presentational compound activity stream built from `Item`, `Badge`, `Body`, `Actions`, `Avatar`, and `Break` parts.

Import: `import {Timeline} from '@primer/react-tailwind/Timeline'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Timeline} from '@primer/react-tailwind'
;<Timeline>
  <Timeline.Item>
    <Timeline.Badge variant="success">✓</Timeline.Badge>
    <Timeline.Body>Deployment succeeded.</Timeline.Body>
  </Timeline.Item>
</Timeline>
```

Use `Timeline.Item` for each event and preserve reading order when adding actions. The root is an ordered list and each item is a list item; `Timeline.Break` is a presentational list item. `clipSidebar` trims the first and/or last event's rule. At container widths below 480px, actions wrap below the event body.

Timeline does not prescribe event taxonomies. Compose package primitives such as `Avatar`, `Label`, `Link`, and `RelativeTime` inside its parts. The event stories demonstrate Issues, comments, Code Scanning, Dependabot, License Compliance, and Secret Scanning compositions without adding product-specific runtime APIs.

## Playgrounds

The Event Playground configures a single event from public parts: actor size and type, badge icon and variant, timestamp format, an optional app attribution, note, and actions. The Timeline Playground renders representative rows for one product surface and filters them by the categories and event types checked in the Controls panel.

## Filtering

Timeline does not filter events. Consumers own the predicate and render only the items that pass it. Optional `data-event-scope`, `data-event-type`, `data-event-category`, `data-event-visibility`, and `data-actor-type` attributes on `Timeline.Item` give filtering code a stable hook without changing the visual output. The example below toggles categories with a multi-select `ActionMenu` and pins the opening and closing rows so the timeline is never empty.

Renders an [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `clipSidebar`: `"both" | "end" | "start" | boolean` — Trims the connecting line at the start, the end, or both, where the timeline meets other content.

## Timeline.Item

Renders a [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `condensed`: `boolean` — Reduces the item's vertical spacing, for a minor event in the timeline.

## Timeline.Avatar

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Timeline.Badge

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `variant`: `"accent" | "attention" | "closed" | "danger" | "done" | "open" | "severe" | "sponsors" | "success"` — Colour of the badge, conveying what kind of event it marks.

## Timeline.Body

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Timeline.Break

Renders a [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Timeline.Actions

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Compose local Avatar, StateLabel, links, and actions inside Timeline parts.
- Keep feature flags, data selection/pagination, and automatic ActionBar overflow outside Timeline.
- Compose package Button, Link, Avatar, Label, RelativeTime, BranchName, and StateLabel primitives inside Timeline parts when their contracts fit the event.
- `sx` and styled-system props are unsupported.
- Event-family stories mirror the upstream visual fixtures with story-only compositions; they do not introduce runtime event components or exports.
- Comment fixture stories cover the stable large-gutter form, compact inline-avatar form, and overlapping app-avatar badge variant.
- Comment fixtures retain the upstream `Internal` story identity so automated visual comparisons remain directly paired; they are still documented as a Timeline event-family composition.
- The upstream Event Playground and Timeline Playground stories are mirrored as `EventPlayground` and `TimelinePlayground`. They use story-only illustrative data (`Timeline.playground.storyHelpers.tsx`) and Tailwind utilities instead of story CSS modules; neither adds runtime API.
- The `WithFiltering` story mirrors the upstream Viewing menu with `ActionMenu.CheckboxItem` rows. Base UI checkbox menu items stay open on toggle and expose `menuitemcheckbox`, so the upstream `preventDefault` workaround is unnecessary. Filtering stays consumer-owned; there is no `Timeline.Filter` API.
- The upstream list-semantics feature flag wrappers are dropped because the Tailwind root is always an ordered list.
- The `Internal` `Helpers` story documents the shared story-only helpers, matching the upstream reference story.
