# Alignment

## From: `@primer/react`

Legacy Timeline includes product-specific event-card stories that combine avatars, labels, links, state labels, comment chrome, taxonomy renderers, feature flags, ActionBar overflow, and DataTable behaviors.

## To: `@primer/react-tailwind`

Timeline exposes root, item, avatar, badge, body, break, and action parts. It retains `clipSidebar`, condensed items, badge variants, a semantic ordered-list root, and responsive action wrapping. `Timeline.Break` always renders a presentational list item.

This is a presentational API. Consumers retain control of event content, ordering, links, headings, and actions through normal React composition. It is not a Base UI primitive and does not absorb product taxonomies or application feature gates.

## Migration notes

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
