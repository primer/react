# Alignment

## From: `@primer/react`

The selected legacy source is experimental Tabs, which supports tab lists, panels, controlled examples, vertical behavior, and experimental compositions that replace the list with arbitrary ActionList content.

## To: `@primer/react-tailwind`

Stable Tabs promotes the selected replacement under `Tabs` with `Root`, `TabList`, `Tab`, and `TabPanel`. Base UI owns tab relationships, roving focus, selection, and controlled/uncontrolled value state; tabs activate on focus by default. Like the selected legacy primitive, its parts are intentionally unstyled so applications can supply a presentation without undoing package defaults.

## Migration notes

- Use `value`, `defaultValue`, and `onValueChange` for selection state.
- **Parity — activation mode:** `activationMode` keeps the upstream `'automatic' | 'manual'` values. Manual mode moves the roving tab stop with Arrow, Home, and End keys and commits selection on Enter, Space, or click. An explicit `TabList` `activateOnFocus` prop takes precedence over the root mode.
- Keep `TabList` and `Tab` composition; reproduce custom presentations with static classes or Base UI `render` composition.
- Query and style the active tab panel; inactive-panel rendering follows Base UI behavior.
- Use `render` for element composition and `className`, not `sx`.
