# Timeline

`Timeline` is a presentational compound activity stream built from `Item`, `Badge`, `Body`, `Actions`, `Avatar`, and `Break` parts.

Import: `import {Timeline} from '@primer/react-tailwind/Timeline'`

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
