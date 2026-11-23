# [ADR] Adopt a parts-based composition API inspired by Base UI

Date: 2026-11-17 · Updated: 2026-11-23

## Status

| Stage          | State          |
| -------------- | -------------- |
| Status         | Proposed ❓    |
| Implementation | Not planned ⛔ |

## Context

GitHub teams tell us they're reaching for libraries like Base UI when a design is hard to build with Primer React. Often they want to keep most of what a Primer component already does and try a different layout or interaction. How much they can reuse depends on which component they started with.

One reason Base UI appeals to teams is that they can arrange a component's parts themselves and keep the keyboard and focus behavior the library provides. Once someone learns how to put a Tooltip on their own button, they can use the same approach for a menu. We'd like teams to have that room to experiment in Primer.

### What breaks today

- **Small changes can break composition.** A Tooltip works on an `ActionMenu.Button`, but [extracting the pair into a reusable component can break the menu](https://github.com/primer/react/blob/d1e8047f777ce7005622877d206f9675a91f8790/packages/react/src/ActionMenu/ActionMenu.tsx#L119-L173). In one product menu, the team also has to remove the Tooltip when the button is disabled.
- **Consumers have to wire components together themselves.** On a project board card, the same button shows a Tooltip on hover and opens an overlay on click. The team has to connect both refs by hand.
- **Changing the layout takes more work than it should.** Moving a Dialog title or its actions means fitting the new layout back into the structure Dialog expects.
- **The same customization behaves differently across components.** One component might keep both class names or call both click handlers. Another might drop Primer's when the caller supplies one. Teams have to read the source to tell.
- **Callbacks don't give consumers enough information.** `ActionMenu` tells consumers that it closed. They can't tell from the callback whether someone pressed Escape or clicked outside, or cancel that change without taking over its state.

## Decision

We'll take inspiration from Base UI and update Primer to have a more parts-based API. Interactive components will expose the pieces consumers need to arrange their own layouts and combine interactions, with consistent composition conventions across Primer.

Parts and configured components will share Primer's existing implementation. Teams can use the standard patterns or compose the parts directly, while Primer keeps ownership of the public API and can evolve the underlying implementation over time.

### What changes

- **Components are built from parts.** Every interactive component will expose named parts so consumers can move a trigger into their own component, wrap a title, or leave out an optional close button.
- **Every rendered part supports `as` and `render`.** Use `as` to change the element type. Use `render` to put the part's behavior on an element you supply, or pass a function that receives its props (including `ref`) and state. A Tooltip and a menu can share one button without consumers connecting refs by hand. A provider-only root has no element to replace.
- **Parts follow Primer's prop-merging conventions.** Parts follow [ADR-025](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-025-prop-merging.md) when they combine Primer's props with the consumer's, including props on a `render` target, so consumers don't have to learn a different merge order for each component.
- **Callbacks say what happened.** New state-change callbacks take one object, for example `onOpenChange({open, reason, event, cancel})`. Consumers can see what prompted the change and call `cancel()` before it takes effect, without taking over the component's state.
- **The same prop means the same thing everywhere.** Shared props use the same names, values, and defaults across components. If two components offer the same sizes, callers shouldn't have to learn two spellings of `medium`.
- **Component scorecards track consistency over time.** We'll use a [component scorecard](#how-do-we-maintain-composition-quality-over-time) to review new APIs and recheck shipped components as conventions change, so new components and API additions follow the same decisions.

### What stays the same

- **Existing component APIs keep working.** Teams can keep using `<ActionMenu>` with `ActionMenu.Button`, or `Dialog` with `title` and `onClose`. Existing subcomponents keep their prop handling, and existing callbacks keep their signatures, so adopting parts doesn't require rewriting existing usage.
- **Configured components keep their data APIs.** Teams can keep supplying data for common patterns and use parts when they need to arrange the content themselves. A configured prop and a part don't both supply the same content.
- **Existing `as` props and slots stay supported.** Root `as` props and slots keep working where they're supported, so consumers can adopt parts without replacing customizations they already use.
- **Primer keeps its current implementation.** Parts and configured components share Primer's current behavior code, types, CSS Modules, and accessibility defaults, so introducing parts doesn't require a separate behavior or styling stack.

### Example: a Tooltip on a menu trigger

Today, simplified from the product menu above:

```tsx
// Works because ActionMenu finds Tooltip and ActionMenu.Button by identity
<ActionMenu>
  <Tooltip text="Reasoning effort">
    <ActionMenu.Button>Medium</ActionMenu.Button>
  </Tooltip>
  <ActionMenu.Overlay>{/* items */}</ActionMenu.Overlay>
</ActionMenu>
```

Proposed, with illustrative part names:

```tsx
<ActionMenu.Root>
  <Tooltip.Root>
    <Tooltip.Trigger render={<ActionMenu.Trigger render={<Button>Medium</Button>} />} />
    <Tooltip.Popup>Reasoning effort</Tooltip.Popup>
  </Tooltip.Root>
  <ActionMenu.Popup>{/* items */}</ActionMenu.Popup>
</ActionMenu.Root>
```

One `<button>` shows the Tooltip and opens the menu. It gets the menu's `aria-expanded`, keyboard handling, and anchor ref. Neither component needs to recognize the other's children, so consumers can move the shared trigger into their own component. Base UI's [composition guide](https://base-ui.com/react/handbook/composition) illustrates the same pattern with Tooltip, Menu, and Dialog triggers.

### Relationship to ADR-024 and ADR-025

[ADR-024](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-024-modular-ds.md) proposes parts as the way out when a configured API no longer fits. Its Dialog example already has `Dialog.Root`, `Dialog.Trigger`, and `Dialog.Close`. This proposal extends that approach to every interactive component. [ADR-025](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-025-prop-merging.md) proposes the merge rules and leaves cancellation to a separate callback design, which `cancel()` provides. Both ADRs are still proposed.

## How do we maintain composition quality over time?

When someone contributes a component or adds a prop, they should be able to see how we handle the same thing elsewhere in Primer. Each scorecard check points back to an ADR decision. We want two reviewers, or two runs of an agent, to reach the same answer from the same code.

1. **Design.** Include the scorecard when proposing a component or an API change so reviewers can discuss any differences before it ships.
2. **Audit.** In the background, an agent regrades shipped components on a schedule and whenever a change touches a component's public API. Each component gets a scorecard with scores by area, and every finding links to the code behind it.
3. **Fix.** For each gap, the agent opens a PR that links the check and the code it flagged, with a proposed fix in the diff. Maintainers review both together and decide whether to merge, ask for changes, or close the PR.
4. **Learn.** If the check flagged valid usage, we correct it. If review catches a problem the scorecard missed, we add a check. When a convention changes, we update the checks and rerun them on the affected components to establish a fresh baseline.
5. **Verify.** On the next run, check whether the merged fix resolved the finding.

Read each score alongside its findings and the version of the checks that produced it. A component's score can drop when we tighten a check even if its code hasn't changed. To see whether the component improved, compare runs that used the same checks. For now, scorecards are an input to review; whether they block PRs is listed under [Not decided now](#not-decided-now).

## Not decided now

This ADR sets the direction for Primer's composition API. The questions below are left to later ADRs or to individual component rollouts.

- **Adding Base UI as a dependency.** We'll prototype the API on Primer's current internals first. [Moving a component to Base UI](#running-a-component-on-base-ui-internals) is a separate decision each time.
- **Each component's exact parts, names, state, and types.** These belong in [the component's rollout](#rolling-out-parts-for-a-component).
- **Event handler order.** This proposal keeps ADR-025's component-first order. In Base UI, a menu trigger's `onClick` can call [`event.preventBaseUIHandler()`](https://base-ui.com/react/handbook/customization#preventing-base-ui-from-handling-a-react-event) to skip the internal click handler. Primer's proposed `cancel()` in `onOpenChange` stops the state change once the handler has requested it. Before changing the order, we'd want an example where stopping the state change isn't enough and a look at which callers rely on Primer running first.
- **How the object callback replaces an existing one.** ActionMenu already has `onOpenChange(open)`. Moving it to the object form needs either a new prop name or a breaking change in a major release. Each component decides, following Primer's versioning policy.
- **Which Primer overlay combinations are supported.** Escape and outside presses should close one eligible layer at a time, and focus should move into and return from nested overlays correctly. One question for the Dialog and ActionMenu rollout: should callers be able to [let Escape propagate to a parent overlay](https://base-ui.com/react/handbook/customization#allowing-propagation-of-the-dom-event), as Base UI allows? That rollout also settles how Primer coordinates layers, portals, and focus.
- **Whether Primer promises interoperability with Base UI.** This ADR defines Primer's own parts and merge behavior. Any cross-library compatibility contract needs a separate decision and tests.
- **Which components get parts first.** We'll pick an order based on where teams hit composition problems most often. Each rollout follows the requirements in [Rolling out parts for a component](#rolling-out-parts-for-a-component).
- **Styling.** CSS Modules stay. Tailwind or another approach is a separate discussion.
- **Rails/ViewComponents and Primer Brand.** They have their own stacks and APIs.
- **Deprecating slots or configured props.** We'd first need to show that parts cover the same cases.
- **Whether scorecards block PRs.** For now they inform review. We'll decide once the checks have run long enough for us to trust their findings.

## Future decisions

Two kinds of follow-up decisions build on this one: adding parts to a specific component, and possibly running a component on Base UI internals.

### Running a component on Base UI internals

Once a component ships parts, we can evaluate moving its internals to Base UI.

<details>
<summary>Base UI migration criteria</summary>

A proposal to move one component needs to show:

- **Nothing changes for consumers.** The component's existing tests pass on Base UI internals, including when it's combined with components still on Primer internals. Any change to public props, DOM, or behavior needs its own migration and versioning plan.
- **Primer's API stays Primer's.** `as` and `render` keep working on every rendered part. Primer adapts Base UI's `(open, details)` to its object-form callback and preserves existing callback signatures. Base UI's types stay out of Primer's public API.
- **Accessibility and browser behavior hold up.** Manual assistive-technology testing, plus native anchor positioning, Dialog, focus, and scroll behavior against the pinned Base UI version.
- **The cost is measured.** Measured bundle and runtime impact.
- **Someone owns the dependency.** Under Primer's [versioning policy](https://github.com/primer/react/blob/main/contributor-docs/versioning.md), adding Base UI is a minor release and a major Base UI update is a major Primer release. Someone owns upgrades, compatibility checks, and deciding whether a fix goes upstream or into Primer.
- **Mixed implementations are tested.** Tests cover a component running on Base UI internals alongside one still using Primer internals, when that combination is part of the rollout. These tests don't imply a public Primer-to-Base UI interoperability promise.

Later decisions may go further, such as offering unstyled foundations built on Base UI as ADR-024's base-component layer, and would need their own ADR.

</details>

### Rolling out parts for a component

Each component's rollout has an owner and defines:

- which parts render an element, their default elements, what `as` and `render` accept, and whether the root only provides state and context
- which props, attributes, and ARIA relationships Primer controls, and which pass through to the rendered element
- the state passed to `render` functions, and any `data-*` state attributes consumers can style against
- which callbacks support `cancel()`, and their `reason` values
- how existing configured usage keeps working, including any callback migration
- the component's scorecard, reviewed alongside the API proposal

## Consequences

- **Components combine the same way everywhere.** Teams can move parts into their own components and combine interactions without depending on which children a parent recognizes.
- **Parts become long-term public API.** Part names, state, and the `as` and `render` behavior become long-term public API. ADR-024's Card example applies: adding a wrapping part later is a breaking change, so we need to define parts carefully and version changes deliberately.
- **Two ways to build the same component.** Configured components and parts live side by side for a long time. Docs need to say when to use each.

## Evidence

Across seven prototype tasks, reviewers found the Base UI solutions cleaner in most cases, and some needed up to 50% less code. The prototypes also used Tailwind, so the comparison covered API and styling choices together. In the rebuilt menu, the Tooltip could stay in place when the button was disabled. The board card no longer needed to connect refs by hand. All eight tested pairings of legacy and Base UI overlays needed a small bridge.

We piloted the scorecard on eight interactive components. The pilot flagged recurring gaps in `as` support on rendered parts and in how components document their parts. It also showed that the scorecard penalized Button for not supporting `render` even though it merged props correctly on its root, so we changed the weighting. The pilot used an earlier ADR revision, so its merge findings need another pass against ADR-025's component-first order.

We still need a prototype of this API on Primer's current internals, matched trials of other libraries, a production migration, measured costs, and accessibility checks with consumers.

<details>
<summary>Sources and related work</summary>

- Primer: [ADR-024](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-024-modular-ds.md) · [ADR-025](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-025-prop-merging.md) · [versioning policy](https://github.com/primer/react/blob/main/contributor-docs/versioning.md) · [ActionMenu's child matching](https://github.com/primer/react/blob/d1e8047f777ce7005622877d206f9675a91f8790/packages/react/src/ActionMenu/ActionMenu.tsx#L119-L173) · [Base UI and Tailwind exploration, primer/react#8693](https://github.com/primer/react/pull/8693)
- Primer: [contents as data vs. children](https://github.com/primer/react/blob/main/contributor-docs/component-contents-api-patterns.md)
- Base UI: [composition](https://base-ui.com/react/handbook/composition) · [customization](https://base-ui.com/react/handbook/customization) · [`mergeProps`](https://base-ui.com/react/utils/merge-props)
- Scorecards: [rubric](https://github.com/primer/react/blob/fb2460d444e8da0bc935b4c6af9769cd3d08aa30/.agents/skills/component-api-design/references/rubric.md) · [pilot results](https://github.com/primer/react/blob/fb2460d444e8da0bc935b4c6af9769cd3d08aa30/contributor-docs/component-api-audits/combined-report.md) · [Astryx component lifecycle](https://github.com/meta/astryx/wiki/Component-Lifecycle)

</details>

## Appendix: composition contract

This appendix has the detailed rules that each component rollout follows. The Decision section summarizes them.

<details>
<summary>Detailed composition contract</summary>

Every rendered part has a documented default element. `as` changes the element or component it renders. `render` accepts an element or a function that receives the part's props and state. Consumers can omit both props; the public types and runtime validation reject supplying both together.

Each component documents which exports render an element. A provider-only root owns state, callbacks, and descendant relationships. It renders no element and exposes no `as`, `render`, or DOM `ref`.

### Parts and render targets

- **Element form.** Primer combines the part's props and the target element's props using the conventions below. The part owns its behavior, including how it handles `disabled`. Its ref and the consumer's ref point at the documented rendered element.
- **Function form.** `render={(props, state) => element}` receives the part's required props (including `ref`) and its current state. The function forwards the props and ref to the element it returns, following the same merge conventions when it adds props of its own.
- **Custom components** passed to `as` or `render` forward `ref` and spread the props they receive onto their DOM element.

### Prop merging and refs (ADR-025)

- Primer may use the internal `mergeProps(componentProps, consumerProps)` helper; it is not part of the public API.
- Event handlers run in argument order. The consumer handler runs unless the component handler sets `event.defaultPrevented`. `stopPropagation()` alone doesn't skip it. An `undefined` consumer handler is treated as absent.
- Classes combine component-first. Styles merge shallowly with consumer values winning on duplicate properties. Other duplicate props use the consumer value, including an explicit `undefined`.
- `mergeProps` does not compose refs. Use `useMergedRefs` separately.

### Attributes and accessibility

- Ordinary DOM attributes pass through to the rendered element.
- Primer controls required roles, ARIA state, and ARIA relationships. Each part documents what its ref points at and which IDs it connects, and leaves attributes it has to control out of its public types.

### State-change callbacks

- New state-change callbacks take one object: the proposed value under its usual name (`open`, `value`, `checked`), plus `reason`, `event`, and `cancel()`.
- `cancel()` works when called inside the callback, before it returns, and stops Primer's internal state change. It is separate from DOM event `preventDefault()`.
- `event` is the DOM event that caused the change, when there is one.

Illustrative callback on the proposed Tooltip root:

```tsx
<Tooltip.Root
  onOpenChange={({open, reason, cancel}) => {
    if (!open && reason === 'trigger-press') cancel()
  }}
/>
```

</details>
