# Alignment

## From: `@primer/react`

Legacy LinkButton supports link variants, trailing actions, and polymorphic router-link replacement through `as`.

## To: `@primer/react-tailwind`

LinkButton composes the shared Button presentation onto a native anchor or a consumer-provided Base UI `render` element while retaining link semantics and navigation behavior. It supports the shared Button variants, sizes, visuals, trailing actions, counters, loading state, and layout props without duplicating those layers.

## Migration notes

- Replace `as={RouterLink}` with `render={<RouterLink to="/path" />}`.
- Replace legacy Button navigation with LinkButton even when `as: 'a'`, `href`, or `target` comes from a computed object or `Partial<ButtonProps>` spread. Use link-specific props on navigation branches; successful type-checking of a stale spread is not evidence of an anchor. Preserve native/router modifier-click, middle-click, context-menu and target behavior instead of routing every click through an action handler. The default root is an anchor, while the public ref is typed `HTMLElement` for replacement roots; forward custom-render refs to the actual anchor and recheck any button-only ref assumptions. The Button alignment guide describes the complete spread-detection migration.
- `href` remains optional for loading placeholders and custom render elements.
- Disabled and loading links suppress ordinary clicks but retain `href`; browser actions such as opening the link from a context menu can still navigate. Use noninteractive content when the destination must not be available.
- LinkButton is also the public loading icon-link composition surface: provide a name with `aria-label` or `aria-labelledby`, an icon in `leadingVisual`, square sizing through `className`, and a surrounding Tooltip instead of text children. Use `loading` and `loadingAnnouncement` for the spinner and loading description; keep router `render` rooted in a real anchor. IconLinkButton intentionally does not expose these loading props. Loading is not a substitute for removing an unavailable destination.
- The text-only loading overlay shares Button's targeted mitigation for host `.invisible` and `.absolute` utility collisions. Other host CSS can still affect it; verify mixed-package styles in the consumer.
- Set `loadingAnnouncement=""` when the host owns loading announcements. This omits the built-in status and loading description without removing consumer descriptions; the default populated status does not by itself guarantee spoken output.
- Use a real Button for actions that do not navigate.
- Replace `sx` and styled-system props with `className`.
