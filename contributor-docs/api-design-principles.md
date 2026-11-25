# Proposed component API design principles

**Status: proposed guidance.** These principles guide API design and review; they do not amend released component contracts or change the status of any ADR. A finding against a component's own documented, typed, or released contract is a defect. A mismatch with the accepted benchmark target is an ADR gap with an additive migration path.

Use the [component API design skill](../.agents/skills/component-api-design/SKILL.md) when designing or reviewing changes that affect what consumers can compose, configure, observe, or control.

## Principles

### 1. Give each abstraction a clear job

**Rule:** Classify the public surface as config, presentational, base, utility, leaf, overlay, form control, or collection behavior. State which layer owns structure, styling, state, and interaction. Add a layer only when it serves a named consumer need.

**Applicability:** All components; not every component needs all four modular-DS types.

**Check:** Types, docs, stories, and implementation identify the current public layer and a supported lower-level path when consumers need a variation the high-level API cannot express.

### 2. Give every interactive component a parts surface

**Rule:** Every interactive component exposes a parts surface. A leaf control may use one part for its root element. Each part supports `as` and `render`; `render` accepts an element or a function that receives the part's required props and current state. Preserve existing configured APIs and add the parts path alongside them.

**Applicability:** Components that own pointer, keyboard, focus, form, or state interaction. Pure content components and component-agnostic utilities with no rendered interaction are N/A. A missing parts or substitution API on an interactive component is an ADR gap, including on a leaf.

**Check:** Each part maps to a consumer-reachable region, has a documented owner and default element, and preserves required props, refs, parent context, semantic order, collection relationships, and accessibility behavior for both substitution forms. Record exact part names/default elements as unresolved where the target source leaves them open. Keep free-form content in `children`; use props or data when Primer owns, transforms, orders, or constrains content.

### 3. Preserve the root polymorphism contract and substitute every part

**Rule:** Root-level `as` follows adopted [ADR-003](./adrs/adr-003-prop-norms.md) and remains limited to a clear polymorphism need. Every part has both `as` and `render`, including render-element and render-function forms. This parts requirement comes from the pinned composition target and does not change ADR-003's root-level rule. ADR-022-styled-react places legacy `sx` compatibility at the `@primer/styled-react` boundary; absence of `sx` from `@primer/react` is not a gap.

**Applicability:** Every interactive part. A root without a polymorphism need may remain fixed; pure content and utilities without rendered interaction are N/A.

**Check:** The public type admits supported targets; the default semantic element remains valid; all required behavior props, state, and refs reach the target. The render function receives current state. The behavior for simultaneous `as` and `render` remains an unresolved decision until the target specifies it. Preserve all existing `as` and render callback signatures.

### 4. Specify configured merges and part merges separately

**Rule:** Configured-component and internal merges follow ADR-025. Existing subcomponents retain their current handler and prop behavior as a legacy compatibility exception. New parts follow the pinned composition target: render-element consumer handler, consumer handler passed to the part, then Primer's handler. The target defines no additional internal part-handler stage. A consumer skip method stops the remaining handlers for that event; DOM `preventDefault()` and state-transition `cancel()` remain separate contracts. Consumer classes come first; consumer styles and ordinary duplicate attributes win; all refs are merged; behavior props remain owned by the part. The skip-method name remains unresolved.

**Applicability:** Components with configured/internal merges or interactive parts.

**Check:** Source types and focused runtime tests establish each applicable handler order, skip behavior, class/style/attribute precedence, behavior-prop ownership, and final ref target. Keep the existing ADR-025 configured/internal merge behavior while applying the composition target to newly added part behavior.

### 5. Expose meaningful state at its owner

**Rule:** Expose only state consumers need to control, render, or style. Put state on the part that owns it; document each public state attribute and CSS custom property. Keep `data-component` as identity under [ADR-023](./adrs/adr-023-stable-selectors-api.md), not as a substitute for state.

**Applicability:** State-bearing components and parts. Stateless leaves and utilities are N/A for component state; measured values may justify CSS custom properties.

**Check:** Every exposed state value has a defined owner, source, and consumer use. State props, render state, attributes, and styles agree; consumers do not need private class names or DOM traversal.

### 6. Keep controlled and uncontrolled ownership explicit

**Rule:** When component-owned state is consumer-controllable, a controlled value, `default*` initializer, and change callback have matching types and one owner. Controlled state follows the supplied value; uncontrolled state updates internally. The component does not switch ownership silently during its lifetime.

**Applicability:** State-bearing components that expose controlled state. Read-only, fully controlled-by-parent, and stateless APIs are N/A for the inapplicable mode.

**Check:** Public types and focused tests demonstrate initial, controlled, uncontrolled, and controlled-value update behavior for each supported state axis.

### 7. Expose transition callbacks with an additive contract

**Rule:** Expose a callback for each consumer-observable interactive state transition. A new transition callback takes one object containing the proposed value, `reason`, the originating DOM `event` when one exists, and a synchronous `cancel()` method that prevents the uncontrolled internal commit. `cancel()` is distinct from DOM `preventDefault()` and the part-handler skip method. Preserve every existing callback signature; add a parallel callback or use an explicitly versioned migration when the existing callback cannot accept the new contract.

**Applicability:** Interactive components with consumer-observable state transitions. Stateless interactive controls and native DOM callbacks are N/A.

**Check:** Public types, docs, and runtime tests establish the value, reason, event, and synchronous cancellation behavior. Keep the additive callback's name visible as an unresolved design choice where the component already uses a legacy callback.

### 8. Keep imperative APIs narrow

**Rule:** Prefer declarative props. Add an actions ref or specialized ref only for a named integration need that declarative APIs cannot express; document its target and supported operations.

**Applicability:** Components with external integration needs; ordinary DOM refs remain governed by adopted ADR-003.

**Check:** Every imperative method has a concrete consumer and targets a documented object or element. A specialized ref does not displace the ordinary ref target without a documented reason.

### 9. Define an overlay lifecycle at the overlay owner

**Rule:** Define popup mount policy, portal target, dismissal, focus entry/return, and exit lifecycle at the component or shared primitive that owns those behaviors. Do not claim cross-overlay coordination from matching prop names or a narrow context signal.

**Applicability:** Overlays, dialogs, popovers, menus, tooltips, and controls that own popup content. Other shapes are N/A.

**Check:** The component's documented open/close paths have explicit mount, dismissal, and focus ownership; supported combinations have tests for Escape, outside dismissal, nesting, and trigger availability where applicable.

### 10. Keep semantics, accessibility, and native form behavior with the pattern owner

**Rule:** The component owns the roles, relationships, keyboard model, focus behavior, and native form wiring required by its pattern. Prefer native elements when they provide sufficient semantics and UI. A custom element must provide client-side behavior or a ShadowDOM benefit. Document consumer responsibilities that cannot be provided automatically. Alternate render targets preserve the required contract.

**Applicability:** All rendered components; form-specific checks apply to form controls and components integrated with field context; keyboard checks apply to interactive patterns.

**Check:** The DOM and focused tests verify required semantics and actual native control attributes at the element that performs the interaction or form submission.

### 11. Align common names and defaults

**Rule:** Public exports, prop types, implementation defaults, docs, and stories describe the same contract. Use aligned names and defaults for concepts shared by multiple components. For a shared size concept, use the common `small`, `medium`, `large` scale with `medium` as the default. Keep existing released names and defaults during migration.

**Applicability:** Every public component and part; compare names/defaults only for concepts they share. Styling-state checks apply when state styling is exposed.

**Check:** The documented surface exists in public types and exports, examples compile against it, defaults match implementation, shared concepts align, and stable selectors follow their adopted contract.

### 12. Use shared providers only for shared configuration

**Rule:** Put a setting in context/provider only when it affects multiple descendants and cannot be expressed naturally by local props. State the provider's effect boundary and preserve local overrides where the contract permits them.

**Applicability:** Components or utilities that configure a subtree; standalone leaves are N/A.

**Check:** At least two descendant consumers share the setting, the provider owns one source of truth, and tests establish the boundary and any supported local override.

### 13. Keep component structure discoverable

**Rule:** Put each component in a PascalCase directory directly under `src/`. Expose a component's subcomponents as properties of its exported parent. Name a replacement component with an incremented number rather than an unrelated name.

**Applicability:** Every component implementation; the subcomponent and replacement rules apply only when those cases exist.

**Check:** Verify the directory name and location, inspect public exports for parent-property ownership of subcomponents, and compare replacement names with the component they replace.

## Applicability vocabulary

Use the following shapes to decide whether a check applies: **config** composes a complete pattern from intent/data; **presentational** exposes Primer-styled parts for consumer composition; **base** provides a low-level primitive, often unstyled; **utility** provides component-agnostic behavior or state; **leaf** renders one main semantic control; **overlay** owns a floating or modal lifecycle; **form control** participates in native form or field context; **collection** manages related items, ordering, selection, or keyboard navigation. A component may have more than one shape.

`N/A` requires a reason tied to the component's shape and public contract. Do not mark an item N/A because it is inconvenient to inspect. Every interactive component remains applicable to the parts and substitution requirements. A mismatch with the accepted benchmark target is an ADR gap, even if the released component never promised that feature. A finding must name a consumer path that can reach the behavior; type-rejected and undocumented inputs are not reachable victims.

## Authority and compatibility

For this benchmark, use the [pinned target baseline](../.agents/skills/component-api-design/references/target-baseline.md): every ADR in the audited `origin/main` snapshot and the pinned composition gist are included regardless of status label. Resolve conflicts at the requirement and package-scope level; explicit later decision text controls an overlapping earlier requirement even without a supersession label. ADR-022-styled-react keeps legacy `sx` compatibility at the compatibility-package boundary while ADR-003's unaffected root `ref`, `as`, and DOM-prop rules remain in force. This benchmark assumption does not change ADR metadata or the released contract. Assess the component's own stated contract separately so an existing contract violation is recorded as a `DEFECT` and a target mismatch is recorded as an `ADR GAP`.

For a released surface, any recommended API change retains existing props, callback signatures, and behavior while adding an opt-in path or a documented versioned migration. Apply release checks only when a recommendation changes an existing published API; all-additive recommendations are not release-dependent. Prefer existing Primer behavior and native platform APIs where they satisfy the contract.

## Review checklist

- Establish the component's public contract from exports, types, docs, stories, and focused tests before evaluating proposed patterns.
- Record contract defects separately from ADR gaps; cite a reachable consumer path and the owning fix.
- Apply only checks relevant to the component's shape; provide a reason for every N/A.
- Keep current API signatures and provide additive migration examples.
- Verify findings against source at a pinned commit before recording them.
