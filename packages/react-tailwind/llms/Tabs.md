# Tabs

`Tabs` provides unstyled tab, tab list, and tab panel behavior that can be composed into an application-specific presentation.

Import: `import {Tabs, Tab, TabList, TabPanel} from '@primer/react-tailwind/Tabs'`

Forwards unrecognized props to Base UI's [`Tabs.Root`](https://base-ui.com/react/components/tabs#root), so it also accepts that part's props.

## Props

- `activationMode`: `TabsActivationMode` — Default `'automatic'`. Whether arrow-key focus also selects a tab. `automatic` selects the focused tab; `manual` only moves focus, and Enter, Space, or a click commits the selection. An explicit `TabList` `activateOnFocus` takes precedence.

## Tab

Forwards unrecognized props to Base UI's [`Tabs.Tab`](https://base-ui.com/react/components/tabs#tab), so it also accepts that part's props.

## TabList

Forwards unrecognized props to Base UI's [`Tabs.List`](https://base-ui.com/react/components/tabs#list), so it also accepts that part's props.

## TabPanel

Forwards unrecognized props to Base UI's [`Tabs.Panel`](https://base-ui.com/react/components/tabs#panel), so it also accepts that part's props.

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for selection state.
