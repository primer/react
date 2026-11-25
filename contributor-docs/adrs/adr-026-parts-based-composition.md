# [ADR] Adopt a parts-based composition API inspired by Base UI

Date: 2026-11-17 · Updated: 2026-11-23

## Status

| Stage          | State          |
| -------------- | -------------- |
| Status         | Proposed ❓    |
| Implementation | Not planned ⛔ |

## Context

GitHub teams tell us they're reaching for libraries like Base UI when a design is hard to build with Primer, often due to APIs that are inconsistent or too locked down to properly experiment with new combinations. This often leads to re-implementations of common patterns, and risks regressions for a11y or performance.

With Base UI, teams get a consistent way to compose components and combine their behavior. We want teams to be able to do that in Primer.

### What breaks today

- **Small changes can break composition.** A Tooltip works on an `ActionMenu.Button`, but [extracting the pair into a reusable component can break the menu](https://github.com/primer/react/blob/59b51e1e33dbe6a40a90035a42b4e0e7c495051b/packages/react/src/ActionMenu/ActionMenu.tsx#L124-L139). In one product example, the team also has to remove the Tooltip from the React tree when the button is disabled to work around limitations in our APIs. 
- **Consumers have to wire components together themselves.** On a project card, the same button shows a Tooltip on hover and opens an overlay on click. The team has to connect both refs by hand.
- **Changing the layout takes more work than it should.** Moving a Dialog title or its actions means fitting the new layout back into the structure Dialog expects.
- **The same customization behaves differently across components.** One component might keep both class names or call both click handlers. Another might drop Primer's when the caller supplies one. Teams have to read the source to tell.
- **Callbacks don't give consumers enough information.** `ActionMenu` tells consumers that it closed. They can't tell from the callback whether someone pressed Escape or clicked outside, or cancel that change without taking over its state.

## Decision

We'll adopt Base UI's approach to composition as a starting point for Primer's parts-based API. All Primer components will follow the same API conventions. Components will expose parts where consumers need to arrange their own layouts or combine behavior. Simpler components may not need parts.

Parts and configured components will share Primer's existing implementation. Teams can keep using configured components for standard patterns and use parts when they need more control. Primer will define and maintain the public API, even if we change the implementation later.

### What changes

- **Components are built from parts.** Every interactive component will expose named parts so consumers can move a trigger into their own component, wrap a title, or leave out an optional close button.
- **Every rendered part supports `as` and `render`.** Use `as` to change the element type. Use `render` to put the part's behavior on an element you supply, or pass a function that receives its props (including `ref`) and state. A Tooltip and a menu can share one button without consumers connecting refs by hand. Roots that only provide state and context don't take these props.
- **Parts follow Primer's prop-merging conventions.** Parts use [ADR-025](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-025-prop-merging.md) to combine Primer's props with the consumer's, including props on a `render` target. The merge order stays the same across components.
- **State-change callbacks use a consistent shape.** New callbacks take one object with the proposed value and information about what prompted the change. The same interaction uses the same `reason` across components. Callbacks that support cancellation include `cancel()` so consumers can stop a change without taking over the component's state.
- **The same prop means the same thing everywhere.** Shared props use the same names, values, and defaults across components. If two components offer the same sizes, callers shouldn't have to learn two different ways to refer to `medium`.
- **Component health scorecards track how components measure up to Primer's standards.** We'll start with [checks for API design and composition](#component-health-scorecards) and use them to review new APIs and recheck shipped components as our standards change.

### What stays the same

- **Existing component APIs keep working.** Teams can keep using `<ActionMenu>` with `ActionMenu.Button`, or `Dialog` with `title` and `onClose`. Existing subcomponents keep their prop handling, and existing callbacks keep their signatures, so adopting parts doesn't require rewriting existing usage.
- **Configured components keep their data APIs.** Teams can keep supplying data for common patterns and use parts when they need to arrange the content themselves. Consumers choose a configured prop or a part for a given piece of content.
- **Existing `as` props and slots stay supported.** Root `as` props and slots keep working where they're supported, so consumers can adopt parts without replacing customizations they already use.
- **Primer keeps its current implementation.** We'll reuse Primer's behavior code, types, CSS Modules, and accessibility defaults across parts and configured components as much as possible, and expose utilities to help teams adopt parts.

### Example: a Tooltip on a menu trigger

Today, simplified from the product menu above:

```tsx
<ActionMenu>
  <Tooltip text="Reasoning effort">
    <ActionMenu.Button>Medium</ActionMenu.Button>
  </Tooltip>
  <ActionMenu.Overlay>{/* items */}</ActionMenu.Overlay>
</ActionMenu>
```

This works while the Tooltip and button are inline. If a team moves them into an `<EffortTrigger />` component, `ActionMenu` sees the wrapper and no longer recognizes its trigger.

With the proposed API (the part names are examples):

```tsx
<ActionMenu.Root>
  <Tooltip.Root>
    <Tooltip.Trigger render={<ActionMenu.Trigger render={<Button>Medium</Button>} />} />
    <Tooltip.Popup>Reasoning effort</Tooltip.Popup>
  </Tooltip.Root>
  <ActionMenu.Popup>{/* items */}</ActionMenu.Popup>
</ActionMenu.Root>
```

The same `<button>` shows the Tooltip and opens the menu. It gets the menu's `aria-expanded`, keyboard handling, and anchor ref. Consumers can move this trigger into their own component because the Tooltip and menu no longer need to recognize each other's children. Base UI's [composition guide](https://base-ui.com/react/handbook/composition) shows the same pattern with Tooltip, Menu, and Dialog triggers.

### Relationship to ADR-024 and ADR-025

If approved, this ADR supersedes [ADR-024](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-024-modular-ds.md) as Primer React's direction for composition. It keeps the same goal of letting teams start with a configured component and use parts when they need more control.

[ADR-025](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-025-prop-merging.md) remains the proposal for prop merging. Parts use its component-first handler order.

### What this enables

The [examples appendix](#appendix-examples-of-what-composition-enables) compares hover submenus, a shared Tooltip/popover trigger, and menu selection using current Primer and an experimental parts API. It shows which responsibilities move out of caller code and where the experiments still needed work. The [composition contract](#appendix-composition-contract) includes type sketches for rendering and state-change callbacks.

## Component health scorecards

A component health scorecard shows how a shipped component measures up to the standards Primer has set for it. The first introduced checks will cover API design and composition: for example, can callers supply their own trigger and still get the props and ref it needs? Accessibility, documentation, and other library decisions can extend these as needed.

We'll run the checks when someone proposes a new component or API, and rerun them on shipped components as their APIs or our standards change. Each finding links to the code it flagged and the standard behind the check. A score can change when we update a check even if the component hasn't, so each report records the commit, ADR revision, and rubric version it ran against. The [eight-component pilot](https://github.com/primer/react/blob/fb2460d444e8da0bc935b4c6af9769cd3d08aa30/contributor-docs/component-api-audits/combined-report.md) ran an earlier version of these checks and shows what a report looks like.

We'll save reports as workflow artifacts and leverage issues to track component health over time. A parent issue will have a sub-issue for each component, with individual findings underneath. We'll use those findings to decide what needs fixing, where a migration makes sense, and whether the checks need adjusting. After a fix lands, we'll rerun the checks to confirm it worked before closing the finding.

## Deferred

We'll work through these questions in later ADRs or as we add parts to each component.

- **Adopting Base UI's components and API in full.** We'll introduce composition on Primer's current implementation first to keep API changes separate from behavior changes. Full adoption needs a separate decision covering how Primer and Base UI popovers, menus, and dialogs work together during migration, including focus, dismissal, and nesting.
- **Event handler order.** This proposal keeps ADR-025's component-first order. In Base UI, a menu trigger's `onClick` can call [`event.preventBaseUIHandler()`](https://base-ui.com/react/handbook/customization#preventing-base-ui-from-handling-a-react-event) to skip the internal click handler. Before changing the order, we'd want an example where stopping the state change isn't enough and a look at which callers rely on Primer running first.
- **How we introduce the object callback where a callback already exists.** ActionMenu already has `onOpenChange(open)`. Moving it to the object form needs either a new prop name or a breaking change in a major release. We'll choose an approach for each component, following Primer's versioning policy.
- **Explicit library interop with BaseUI.** We'll need a separate decision and tests before promising that components from the two libraries can be combined.
- **Which components get parts first.** We'll pick an order based on where teams hit composition problems most often. Each rollout follows the requirements in [Rolling out parts for a component](#rolling-out-parts-for-a-component).

## Rolling out parts for a component

We'll roll out new Composable API one component at a time, adding them alongside the existing configured API and keeping it as backward compatible as possible. Teams should be able to upgrade without changing their code, then adopt parts where they need a custom layout or interaction. If a breaking change can't be avoided, we'll document the migration path and follow [Primer's versioning policy](https://github.com/primer/react/blob/main/contributor-docs/versioning.md).

For each component, we'll document:

- which parts render an element, their default elements, what `as` and `render` accept, and whether the root only provides state and context
- which props, attributes, and ARIA relationships Primer controls, and which pass through to the rendered element
- the state passed to `render` functions, and any `data-*` state attributes consumers can style against
- the state-change callback shapes, their `reason` values, and which changes consumers can cancel
- how existing configured usage keeps working, including any callback migration
- the component's scorecard, reviewed alongside the API proposal

Each rollout also includes a working example on Primer's current implementation so reviewers can try the configured API and the new parts. The component's MAS grade shouldn't regress, and we'll test the changed interactions with a keyboard and assistive technology before the rollout ships.

## Consequences

- **Components combine the same way everywhere.** Teams can move parts into their own components and combine interactions without depending on which children a parent recognizes.
- **We'll need to maintain the parts API.** Teams will depend on part names, state, and the behavior of `as` and `render`. We'll need to choose these carefully and follow Primer's versioning policy when they change. Adding a wrapping part later is a breaking change, as ADR-024's Card example shows.
- **We'll support both configured components and parts.** Both will stay available for a long time, and the docs need to say when to use each.

## Appendix: composition contract

Each component follows these rules as we add parts.

<details>
<summary>Detailed composition contract</summary>

Every part that renders an element has a documented default, like a `<button>` for a trigger. Consumers can use `as` to change the element or component, or `render` to pass their own element or a function that receives the part's props and state. Without either prop, the part uses its default. Passing both is an error in the types and at runtime.

A root can manage state, handle callbacks, and connect its parts without adding a DOM element, as in the proposed `Tooltip.Root`. These roots don't take `as`, `render`, or a DOM `ref`. Each component's docs say which parts render an element and which only provide state and context.

### Parts and render targets

- **Element form.** When consumers pass an element, like `render={<Button />}`, Primer merges the part's props with the element's props using the conventions below. Primer still handles the part's behavior, including `disabled`. The part's ref and the consumer's ref both point at the documented rendered element.
- **Function form.** With `render={(props, state) => element}`, consumers get the part's props (including `ref`) and its current state. They forward those props and ref to the element they return, and use the same merge conventions if they add props of their own.
- **Custom components.** A component passed to `as` or `render` needs to forward `ref` and spread the props it receives onto its DOM element.

This type sketch shows the choice between `as` and the two forms of `render`:

```ts
type RenderOptions<Props, State> =
  | {as?: React.ElementType; render?: never}
  | {
      as?: never
      render: React.ReactElement | ((props: Props, state: State) => React.ReactElement)
    }
```

`Props` includes the part's ref, and `State` describes its current state. The full component types also need to preserve the props and ref type of the element chosen with `as` or `render`.

### Prop merging and refs (ADR-025)

- Internally, Primer can use a `mergeProps(componentProps, consumerProps)` helper. It isn't part of the public API.
- Primer's event handler runs first, then the consumer's. If Primer's handler calls `event.preventDefault()`, the consumer's handler doesn't run. Calling `stopPropagation()` on its own doesn't skip it. Passing `undefined` as a handler is the same as not passing one.
- Class names are combined, with Primer's first. Styles are merged shallowly, and the consumer's value wins when both set the same property. For any other prop, the consumer's value wins, even when it's an explicit `undefined`.
- `mergeProps` doesn't handle refs, so parts combine them with `useMergedRefs`.

### Attributes and accessibility

- Regular DOM attributes pass through to the rendered element.
- Primer controls the required roles, ARIA state, and ARIA relationships. Each part documents what its ref points at and which IDs it connects. The part's public types leave out attributes that Primer needs to control.

### State-change callbacks

New state-change callbacks take one object. It includes the proposed value, using a field such as `open`, `value`, or `checked`, along with `reason` and the originating `event`, if there is one. Callbacks that support cancellation also include `cancel()`.

We'll reuse field names and `reason` values for the same behavior across components. Each component's API proposal defines its callback names, value fields, supported reasons, and which changes can be canceled. Existing callbacks keep their signatures until we agree on a migration path for that component.

An open-state callback that supports cancellation could use this shape:

```ts
type StateChange<ValueFields, Reason extends string> = ValueFields & {
  reason: Reason
  event?: Event
}

type OpenChange<Reason extends string> = StateChange<{open: boolean}, Reason>

type CancelableChange<Change> = Change & {
  cancel(): void
}

type OpenChangeHandler<Reason extends string> = (change: CancelableChange<OpenChange<Reason>>) => void
```

A checked-state callback would use `{checked: boolean}` in place of `{open: boolean}`. Callbacks without cancellation leave out the `CancelableChange` wrapper. These helper names are just for the type sketches.

</details>

## Appendix: examples of what composition enables

We tried these interactions with existing Primer components and an experimental Base UI-backed Primer package. The examples below compare the code needed for hover submenus, a shared Tooltip/popover trigger, and menu selection.

The after examples use the experimental package's names and callback signatures. The proposed Primer conventions are in the [composition contract](#appendix-composition-contract). Popup contents and unrelated styling are omitted to keep the comparisons short.

The experimental package changed behavior internals and styling as well as the API. We'll need to build these examples on Primer's current implementation as we add parts to each component.

| Interaction                          | Current Primer in the experiment                                                   | Experimental parts API                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Hover submenu                        | The caller managed open state and mouse-enter handling.                            | `Submenu` and `SubmenuTrigger` handled the interaction.                            |
| Tooltip and popover on one badge     | The caller connected refs, suppressed the Tooltip, and restored focus by hand.     | `Popover.Trigger` composed with an `IconButton` that supplied its own description. |
| Single-choice menu with descriptions | Each list item checked whether it was selected and supplied an `onSelect` handler. | A `RadioGroup` owned selection, and each `RadioItem` supplied its value.           |

<details>
<summary>Before and after examples</summary>

### Opening a submenu on hover

The menu needs to open a submenu when the pointer moves over an item. With the existing API, the caller controls the open state and adds a mouse-enter handler.

#### Before: current Primer (hover submenu)

```tsx
<ActionMenu open={openCategory === 'status'} onOpenChange={open => setOpenCategory(open ? 'status' : null)}>
  <ActionMenu.Anchor>
    <ActionList.Item onMouseEnter={() => setOpenCategory('status')}>Status</ActionList.Item>
  </ActionMenu.Anchor>
  <ActionMenu.Overlay>{/* submenu items */}</ActionMenu.Overlay>
</ActionMenu>
```

#### After: experimental parts API (hover submenu)

```tsx
<ActionMenu.Submenu>
  <ActionMenu.SubmenuTrigger aria-label="Status" delay={0} closeDelay={200}>
    Status
  </ActionMenu.SubmenuTrigger>
  <ActionMenu.Content aria-label="Status">{/* submenu items */}</ActionMenu.Content>
</ActionMenu.Submenu>
```

`Submenu` and `SubmenuTrigger` handle the open state and pointer interaction. We also hit a hover failure while testing the experimental version, so that behavior needs more work before shipping.

### A Tooltip and popover sharing one badge

The badge shows a short description on hover and opens details when clicked. The first version uses the Tooltip's ref to connect the button to the popup and restores focus by hand when the popup closes.

#### Before: current Primer (Tooltip and popover)

```tsx
function closeAndReturnFocus() {
  setOpen(false)
  badgeRef.current?.focus()
}

;<Tooltip ref={badgeRef} text={finding.shortExplanation} _privateDisableTooltip={open}>
  <IconButton icon={riskIcons[finding.riskLevel]} aria-label={`${finding.title}: ${finding.riskLevel} risk`} />
</Tooltip>
```

The popup code, omitted here, also adds an Escape listener and moves focus into the details.

#### After: experimental parts API (Tooltip and popover)

```tsx
<Popover>
  <Popover.Trigger
    render={
      <IconButton
        aria-label={`${finding.title}: ${finding.riskLevel} risk`}
        description={finding.shortExplanation}
        icon={ShieldLockIcon}
      />
    }
  />
  <Popover.Content align="start" side="bottom" portal={false} initialFocus={false} finalFocus>
    {/* details */}
  </Popover.Content>
</Popover>
```

`Popover.Trigger` uses the IconButton through `render`. The button supplies its Tooltip through `description`, and Popover handles dismissal and focus return. The caller no longer needs the ref and focus code above.

Current Primer's IconButton also has a built-in Tooltip, which the first version didn't use. That would simplify the existing version too.

### Managing selection on the menu group

Both APIs can build a single-choice menu with descriptions. With the existing API, each item checks whether it's selected and supplies its own change handler.

#### Before: current Primer (menu selection)

```tsx
<ActionList selectionVariant="single">
  {options.map(option => (
    <ActionList.Item key={option.id} selected={option.id === mode} onSelect={() => setMode(option.id)}>
      {option.label}
      <ActionList.Description variant="block">{option.description}</ActionList.Description>
    </ActionList.Item>
  ))}
</ActionList>
```

#### After: experimental parts API (menu selection)

```tsx
<ActionMenu.RadioGroup value={mode} onValueChange={setMode}>
  {options.map(option => (
    <ActionMenu.RadioItem key={option.id} value={option.id} label={option.label}>
      <span id={`power-mode-${option.id}-label`}>{option.label}</span>
      <ActionMenu.Description id={`power-mode-${option.id}-description`} variant="block">
        {option.description}
      </ActionMenu.Description>
    </ActionMenu.RadioItem>
  ))}
</ActionMenu.RadioGroup>
```

The parts version puts the selected value and change handler on the group. Each item supplies its own value, label, and description.

</details>
