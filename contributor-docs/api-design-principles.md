# Proposed component API design principles

**Status: proposed guidance.** These principles guide API design and review; they do not amend released component contracts or change the status of any ADR. A finding against a component's own documented, typed, or released contract is a defect. A mismatch with a proposed ADR is an ADR gap with an additive migration path.

Use the [component API design skill](../.agents/skills/component-api-design/SKILL.md) when designing or reviewing changes that affect what consumers can compose, configure, observe, or control.

## Principles

### 1. Give each abstraction a clear job

**Rule:** Classify the public surface as config, presentational, base, utility, leaf, overlay, form control, or collection behavior. State which layer owns structure, styling, state, and interaction. Add a layer only when it serves a named consumer need.

**Applicability:** All components; not every component needs all four modular-DS types.

**Check:** Types, docs, stories, and implementation identify the current public layer and a supported lower-level path when consumers need a variation the high-level API cannot express.

### 2. Make meaningful parts first-class

**Rule:** Expose a region as a named part only when consumers need to position, omit, replace, style, or configure it independently. Keep free-form content in `children`; use props or data when Primer must own, transform, order, or constrain the content.

**Applicability:** Compound config and presentational components; collections and overlays only for independently configurable regions. Leaf controls, utilities, and fixed-format content do not need parts by default.

**Check:** Every part maps to a distinct consumer-controlled region, has a documented owner, and preserves required parent context, semantic order, and collection relationships. Do not promise arbitrary DOM reparenting.

### 3. Use element substitution only where it preserves the component's job

**Rule:** Use `as` only for a demonstrated polymorphism need, consistent with adopted [ADR-003](./adrs/adr-003-prop-norms.md). For new behavior-bearing parts, an explicit `render` contract may pass required props and state to an alternate element. Do not add interchangeable escape hatches without distinct use cases.

**Applicability:** Roots or parts with a valid alternate semantic element or custom component integration. `as` is not universal; fixed semantic controls and utilities may be N/A.

**Check:** The public type admits only supported targets; the default semantic element remains valid; all required behavior props and refs reach the target. Preserve existing `as`, render callbacks, and signatures.

### 4. Specify prop, handler, class, style, and ref behavior

**Rule:** Document collisions wherever component and consumer props meet. Use the existing contract for the current surface; do not infer package-wide precedence from a helper's existence or one call site. Define and test any new part/render boundary separately.

**Applicability:** Components that combine internal and consumer props, including cloned children, parts, render targets, and wrapped controls.

**Check:** For each collision class, source and tests show the winning value or composition order, cancellation behavior, and final ref target. Keep the existing ADR-025 behavior for configured APIs; ADR-025 remains proposed.

### 5. Expose meaningful state at its owner

**Rule:** Expose only state consumers need to control, render, or style. Put state on the part that owns it; document each public state attribute and CSS custom property. Keep `data-component` as identity under [ADR-023](./adrs/adr-023-stable-selectors-api.md), not as a substitute for state.

**Applicability:** State-bearing components and parts. Stateless leaves and utilities are N/A for component state; measured values may justify CSS custom properties.

**Check:** Every exposed state value has a defined owner, source, and consumer use. State props, render state, attributes, and styles agree; consumers do not need private class names or DOM traversal.

### 6. Keep controlled and uncontrolled ownership explicit

**Rule:** When component-owned state is consumer-controllable, a controlled value, `default*` initializer, and change callback have matching types and one owner. Controlled state follows the supplied value; uncontrolled state updates internally. The component does not switch ownership silently during its lifetime.

**Applicability:** State-bearing components that expose controlled state. Read-only, fully controlled-by-parent, and stateless APIs are N/A for the inapplicable mode.

**Check:** Public types and focused tests demonstrate initial, controlled, uncontrolled, and controlled-value update behavior for each supported state axis.

### 7. Make new state callbacks extensible without changing existing callbacks

**Rule:** Preserve every released callback signature. New state-change callbacks should use one object argument containing the proposed value and typed transition details, consistent with `style.md`. Include a synchronous cancellation method only when the consumer needs to veto an uncontrolled transition; keep state-transition cancellation distinct from DOM event cancellation.

**Applicability:** New APIs that report state transitions. Native DOM callbacks, stateless components, and APIs without consumer-observable state are N/A.

**Check:** The type and tests establish the value, reason, originating event when present, and whether cancellation occurs before internal state commits. Any new convention or adapter is explicit.

### 8. Keep imperative APIs narrow

**Rule:** Prefer declarative props. Add an actions ref or specialized ref only for a named integration need that declarative APIs cannot express; document its target and supported operations.

**Applicability:** Components with external integration needs; ordinary DOM refs remain governed by adopted ADR-003.

**Check:** Every imperative method has a concrete consumer and targets a documented object or element. A specialized ref does not displace the ordinary ref target without a documented reason.

### 9. Define an overlay lifecycle at the overlay owner

**Rule:** Define popup mount policy, portal target, dismissal, focus entry/return, and exit lifecycle at the component or shared primitive that owns those behaviors. Do not claim cross-overlay coordination from matching prop names or a narrow context signal.

**Applicability:** Overlays, dialogs, popovers, menus, tooltips, and controls that own popup content. Other shapes are N/A.

**Check:** The component's documented open/close paths have explicit mount, dismissal, and focus ownership; supported combinations have tests for Escape, outside dismissal, nesting, and trigger availability where applicable.

### 10. Keep semantics, accessibility, and native form behavior with the pattern owner

**Rule:** The component owns the roles, relationships, keyboard model, focus behavior, and native form wiring required by its pattern. Document consumer responsibilities that cannot be provided automatically. Alternate render targets preserve the required contract.

**Applicability:** All rendered components; form-specific checks apply to form controls and components integrated with field context; keyboard checks apply to interactive patterns.

**Check:** The DOM and focused tests verify required semantics and actual native control attributes at the element that performs the interaction or form submission.

### 11. Make types, defaults, identifiers, and documentation agree

**Rule:** Public exports, prop types, implementation defaults, docs, and stories describe the same contract. Reuse an established role name and state vocabulary when it expresses the same behavior; do not rename a released API for stylistic consistency.

**Applicability:** Every public component and part; styling-state checks only apply when state styling is exposed.

**Check:** The documented surface exists in public types and exports, examples compile against that surface, defaults match implementation, and any stable selector follows its own adopted contract.

### 12. Use shared providers only for shared configuration

**Rule:** Put a setting in context/provider only when it affects multiple descendants and cannot be expressed naturally by local props. State the provider's effect boundary and preserve local overrides where the contract permits them.

**Applicability:** Components or utilities that configure a subtree; standalone leaves are N/A.

**Check:** At least two descendant consumers share the setting, the provider owns one source of truth, and tests establish the boundary and any supported local override.

## Applicability vocabulary

Use the following shapes to decide whether a check applies: **config** composes a complete pattern from intent/data; **presentational** exposes Primer-styled parts for consumer composition; **base** provides a low-level primitive, often unstyled; **utility** provides component-agnostic behavior or state; **leaf** renders one main semantic control; **overlay** owns a floating or modal lifecycle; **form control** participates in native form or field context; **collection** manages related items, ordering, selection, or keyboard navigation. A component may have more than one shape.

`N/A` requires a reason tied to the component's shape and public contract. Do not mark an item N/A because it is inconvenient to inspect. A missing proposed capability is never a defect by itself. A finding must name a consumer path that can reach the behavior; type-rejected and undocumented hostile inputs are not a reachable victim.

## Authority and compatibility

Apply current Primer guarantees first: adopted ADRs, the released component's own contract, and objective accessibility/native-platform requirements. Then assess alignment with proposed ADR-024, ADR-025, and the [Base UI-compatible composition ADR](https://gist.github.com/adierkens/894bb9ec4268f85e5a3119ed7de33410) as design opportunities. The last three remain proposals and cannot be used to label missing capability as a shipped defect.

For a released surface, any recommended API change must retain existing props, callback signatures, and behavior while adding an opt-in path or a documented versioned migration. Verify release status before raising a breaking-change finding. Prefer existing Primer behavior and native platform APIs where they satisfy the contract.

## Review checklist

- Establish the component's public contract from exports, types, docs, stories, and focused tests before evaluating proposed patterns.
- Record contract defects separately from ADR gaps; cite a reachable consumer path and the owning fix.
- Apply only checks relevant to the component's shape; provide a reason for every N/A.
- Keep current API signatures and provide additive migration examples.
- Verify findings against source at a pinned commit before recording them.
