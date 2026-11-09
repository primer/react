# Tabs

`Tabs` provides unstyled tab, tab list, and tab panel behavior that can be composed into an application-specific presentation.

Import: `import {Tabs, Tab, TabList, TabPanel} from '@primer/react-tailwind/Tabs'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Tab, TabList, TabPanel, Tabs} from '@primer/react-tailwind/Tabs'
;<Tabs defaultValue="one">
  <TabList aria-label="Views">
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel value="one">First panel</TabPanel>
  <TabPanel value="two">Second panel</TabPanel>
</Tabs>
```

Use `defaultValue` for uncontrolled tabs or `value` with `onValueChange` for controlled tabs. Give each tab list an accessible label, preserve the tab-to-panel value relationship, and style the parts with static Tailwind classes or `render` composition.

Import the complete composition from the `/Tabs` subpath. The root barrel exports `Tabs` and the compatibility hooks, but not `TabList`, `Tab`, or `TabPanel`; there are no `Tabs.List`, `Tabs.Tab`, or `Tabs.Panel` properties.

### Migrating legacy behavior hooks

Legacy experimental `useTab`, `useTabList`, and `useTabPanel` supplied behavior and ARIA props for native elements. The Tailwind hooks only return the supplied Base UI props: spreading them onto a plain `button` or `div` does not implement tabs. Replace those hook-based wrappers with `Tab`, `TabList`, and `TabPanel` inside `Tabs`. The complete before/after example shows vertical feature-preview tabs.

Move legacy `aria-orientation="vertical"` from the list to `orientation="vertical"` on the root, and use layout classes such as `flex flex-col` on the list. Orientation controls keyboard behavior, not visual layout. Controlled `onValueChange` now receives `(value, eventDetails)` instead of `{value}`. Let the primitives own selection, roving tab indexes, tab/panel IDs, ARIA relationships, and keyboard handling; remove the old hook spreads and manual navigation handlers. Give each tab a distinct feature name and associate supplementary status text with `aria-describedby` rather than using that status as its name.

### Activation mode

By default, selection follows focus: navigating with the Arrow, Home, and End keys immediately selects the newly focused tab (`activationMode="automatic"`). Set `activationMode="manual"` to move focus without changing selection — selection is then committed with Enter, Space, or a pointer click. Prefer manual activation when displaying a panel is not instant (for example, it triggers a network request), per the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

```tsx
<Tabs defaultValue="one" activationMode="manual">
  {/* ... */}
</Tabs>
```

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
- **Parity — activation mode:** `activationMode` keeps the upstream `'automatic' | 'manual'` values. Manual mode moves the roving tab stop with Arrow, Home, and End keys and commits selection on Enter, Space, or click. An explicit `TabList` `activateOnFocus` prop takes precedence over the root mode.
- Keep `TabList` and `Tab` composition; reproduce custom presentations with static classes or Base UI `render` composition.
- Query and style the active tab panel; inactive-panel rendering follows Base UI behavior.
- Use `render` for element composition and `className`, not `sx`.
- **Public entry point:** import `Tabs`, `TabList`, `Tab`, and `TabPanel` from `@primer/react-tailwind/Tabs`. The root barrel exports `Tabs` and the compatibility hooks, but not the three parts. These are named exports, not properties such as `Tabs.List`.
- **Breaking behavior-hook migration:** legacy experimental hooks generated keyboard, selection, visibility, and ARIA props for native elements. The Tailwind hooks only return their supplied Base UI props; they are composition boundaries, not drop-in behavior hooks. Before:

  ```tsx
  import React from 'react'
  import {Tabs, useTab, useTabList, useTabPanel} from '@primer/react/experimental'

  function FeatureTabList({children}: React.PropsWithChildren) {
    const {tabListProps} = useTabList<HTMLDivElement>({
      'aria-label': 'Feature previews',
      'aria-orientation': 'vertical',
    })
    return <div {...tabListProps}>{children}</div>
  }

  function FeatureTab({value, children}: React.PropsWithChildren<{value: string}>) {
    const {tabProps} = useTab<HTMLButtonElement>({value})
    return (
      <button type="button" {...tabProps}>
        {children}
      </button>
    )
  }

  function FeaturePanel({value, children}: React.PropsWithChildren<{value: string}>) {
    const {tabPanelProps} = useTabPanel<HTMLDivElement>({value})
    return <div {...tabPanelProps}>{children}</div>
  }

  function FeaturePreviews() {
    return (
      <Tabs defaultValue="search">
        <FeatureTabList>
          <FeatureTab value="search">Fast search</FeatureTab>
          <FeatureTab value="dashboard">New dashboard</FeatureTab>
        </FeatureTabList>
        <FeaturePanel value="search">Search preview settings</FeaturePanel>
        <FeaturePanel value="dashboard">Dashboard preview settings</FeaturePanel>
      </Tabs>
    )
  }
  ```

  After: replace the hook wrappers with the complete unstyled primitive composition from the subpath:

  ```tsx
  import {Tab, TabList, TabPanel, Tabs} from '@primer/react-tailwind/Tabs'

  function FeaturePreviews() {
    return (
      <Tabs defaultValue="search" orientation="vertical">
        <TabList aria-label="Feature previews" className="flex flex-col">
          <Tab value="search">Fast search</Tab>
          <Tab value="dashboard">New dashboard</Tab>
        </TabList>
        <TabPanel value="search">Search preview settings</TabPanel>
        <TabPanel value="dashboard">Dashboard preview settings</TabPanel>
      </Tabs>
    )
  }
  ```

  Move legacy list `aria-orientation` to root `orientation`; a vertical list uses ArrowUp/ArrowDown and Home/End, not horizontal arrow navigation. Layout classes alone do not set keyboard orientation. In automatic mode those keys also select; retain `activationMode="manual"` when selection should wait for Enter, Space, or click. Controlled `onValueChange` changes from `({value}) => setValue(value)` to `(value, eventDetails) => setValue(value)`.

  Remove the legacy hook spreads and manual role, roving `tabIndex`, generated ID, selection, visibility, and navigation machinery from the replacement elements. Keep matching values for each tab/panel and let the primitives register items and own behavior. Custom wrappers must forward received props and refs to the same primitive; Base UI `render` composition must preserve those contracts. Keep feature names distinct, and associate supplementary status text with `aria-describedby`; if that text appears inside a tab, use `aria-labelledby` pointing to its visible feature-name element so the status does not become part of the tab name. This migration does not require a dependency patch or an arrow-key fallback.
