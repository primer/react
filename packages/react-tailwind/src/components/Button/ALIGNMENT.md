# Alignment

## From: `@primer/react`

Legacy Button supports styled-system props plus button/link variants, counters, trailing actions, inactive styling, label wrapping, and keybinding-hint-oriented compositions.

## To: `@primer/react-tailwind`

Button is the stable Base UI-backed button primitive with aligned `variant`, `size`, `block`, `alignContent`, `leadingVisual`, `trailingVisual`, `trailingAction`, `count`, `inactive`, `labelWrap`, `loading`, `loadingAnnouncement`, and `notificationIndicator` contracts while forwarding valid button props and refs. Shared `CounterLabel`, `Spinner`, and `VisuallyHidden` primitives provide counter and loading behavior. Visual props accept either an icon component or a rendered element, matching modern Primer composition without its private slot markers.

## Migration notes

- Prefer LinkButton for navigation; the `link` Button variant remains available for semantic button actions rendered as inline links.
- Pass counters through `count`, trailing disclosure icons through `trailingAction`, and keyboard shortcuts through a composed `KeybindingHint` in `trailingVisual`.
- Use `inactive` for the interactive visually-disabled state and add an accessible description when the reason is not otherwise evident.
- Use `render`, not `as`, when composing a Base UI trigger or other existing element. Set `nativeButton={false}` when the rendered element is not a `<button>`.
- `notificationIndicator` accepts `button` or `leadingVisual`; the dot is visual only, so include the activity in the accessible name or description.
- The `link` variant underlines only the label on hover when visuals are present, matching upstream `data-no-visuals` behavior.
- Replace `sx` and styled-system props with `className`.
