# Alignment

## From: `@primer/react`

The selected legacy source is experimental Tabs, which supports tab lists, panels, controlled examples, vertical behavior, and experimental compositions that replace the list with arbitrary ActionList content.

## To: `@primer/react-tailwind`

Stable Tabs promotes the selected replacement with a `Tabs` root and named `TabList`, `Tab`, and `TabPanel` parts. Base UI owns tab relationships, roving focus, selection, and controlled/uncontrolled value state; tabs activate on focus by default. Like the selected legacy primitive, its parts are intentionally unstyled so applications can supply a presentation without undoing package defaults.

## Migration notes

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
