# Alignment

## From: `@primer/react`

Legacy IconButton is the icon-only button surface with description and keybinding props and common Tooltip and ActionMenu compositions.

## To: `@primer/react-tailwind`

IconButton is a stable icon-only button with required `icon` (an icon component or a rendered element), normal button semantics, loading behavior, and valid button DOM props. Like upstream, it renders a Tooltip by default: `aria-label` as a visual label tooltip, or `description` as an accessible description, plus optional `keybindingHint` and `tooltipDirection`. It is implemented as a local Button composed into `Tooltip.Trigger`, so Base UI behavior is inherited through those primitives.

## Migration notes

- Supply an accessible name with `aria-label` or `aria-labelledby`. An `aria-label` supplies the visual label tooltip; an external label can instead be paired with `description` or an enclosing Tooltip.
- With the default tooltip, `keybindingHint` is an accessible description, not part of the button's accessible name. Legacy 38.44.0 TooltipV2 could name the button from tooltip text plus its hidden shortcut hint. Migrate exact-name queries and assertions to the supplied name, and check the shortcut separately as a description; do not append it to the label just to preserve a test. The host issue-creation fullscreen control reports name "Open issue creation in fullscreen" and macOS description "(command shift enter)" with working activation. That host evidence does not establish manual screen-reader announcement parity.
- Migrate navigation to `IconLinkButton`, not an IconButton with a legacy `as: 'a'` hidden in a spread or wrapper. Inspect computed prop factories and legacy `Partial<ButtonProps>`/IconButton prop aliases as well as JSX attributes; TypeScript can accept stale spread keys without preserving anchor semantics. Keep IconButton for actions, and retain the link's accessible name, destination, target, modified-click behavior, and anchor-root ref semantics on navigation branches. The Button alignment guide covers detection and branch-specific prop/ref migration.
- **Unsupported link substitute:** `IconButton render={<a href="..." />} nativeButton={false} role="link"` still composes Base UI button activation; changing the element and role does not make it equivalent to IconLinkButton. In the host's installed `95baea6` package with React 19.2 and Base UI 1.8, a focused Chromium reproduction dispatched a click on Space keyup, unlike a native link. The host reports that IconLinkButton restores native Space/Enter behavior. This evidence is limited to Chromium, not cross-browser or assistive-technology parity; do not add a key-handler workaround to treat the button composition as a navigation contract.
- The default tooltip is skipped when `unsafeDisableTooltip` is set, when neither a label nor a description is available, or inside an external Tooltip, and stays closed while disabled or while an attached popup is expanded.
- Compose `ActionMenu.Trigger render={<IconButton … />}` to use it as a menu anchor.
- An enabled, mounted Tooltip provides a reference target in server-rendered HTML even when its visual popup is portaled. Use an independent label if the tooltip can be disabled or removed, and follow Tooltip's server-rendering guidance for custom content.
- `notificationIndicator` accepts `button` or `icon`; the dot is visual only, so include the activity in `aria-label` or a description.
- Pass a rendered element such as `icon={<HeartIcon />}` when the icon comes from a Server Component.
- Icon controls have a 28 CSS pixel default size floor, which can increase their dimensions with a smaller root font. Consumer sizing utilities can override it.
- Use `className`, not `sx` or styled-system props.
- When `aria-labelledby` is passed, the redundant `aria-label` is dropped from the button; `aria-label` still provides the default tooltip text.
