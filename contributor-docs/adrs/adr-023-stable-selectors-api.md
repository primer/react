# Stable identifiers for Primer components

📆 Date: 2026-02-20

## Status

| Stage          | State       |
| -------------- | ----------- |
| Status         | Proposed ❓ |
| Implementation | Pending ⚠️  |

## Context

Primer React components do not expose stable identifiers for their rendered DOM
elements. Consumers who need to reference a specific component or slot in the
DOM — for testing, tracking, monitoring, or querying — have no reliable way to
do so.

This creates problems across several areas:

- **Testing.** Unit and end-to-end tests resort to brittle selectors like CSS
  Module hashes (`prc-ActionList-Item-cBBI`), DOM structure assumptions, or
  text content matching — all of which break silently when Primer is updated.
- **Tracking and monitoring.** Consumers that want to measure how components are
  used in production (e.g., counting how many ActionList items appear on a page)
  have no stable hook to query against.
- **JavaScript queries.** Finding all instances of a component or its parts in
  the DOM (e.g., all selected items in an action list) requires knowledge of
  internal implementation details.
- **Style overrides.** When consumers do need to customize appearance, CSS
  Module hashes are not stable across versions, leaving no reliable selector to
  target.

The `data-component` attribute is already used internally across multiple
components (`Button`, `ActionList`, `PageHeader`, `UnderlineNav`, `Avatar`, and
others) for internal CSS targeting and DOM queries. However, the naming
convention is inconsistent:

| Pattern              | Examples                                         |
| -------------------- | ------------------------------------------------ |
| `ComponentName.Part` | `ActionList.Description`, `ActionList.Selection` |
| `PREFIX_Part`        | `PH_LeadingAction`, `PH_Title`, `PH_Navigation`  |
| `camelCase`          | `buttonContent`, `leadingVisual`, `text`         |
| `PascalCase`         | `Avatar`, `IconButton`, `SkeletonText`           |

Because `data-component` is not documented as a public API, values have changed
without notice and coverage is incomplete — many component parts have no
`data-component` attribute at all.

## Decision

Establish two **public, stable data attributes** that act as reliable
identifiers for Primer components and their parts in the DOM. Think of these as
built-in test IDs — stable, predictable anchors that consumers can use for
testing, tracking, monitoring, and querying without coupling to internal DOM
structure.

- **`data-component`** — identifies the root element of a component or
  sub-component.
- **`data-part`** — identifies an inner structural part within a component.

These attributes are primarily intended for:

1. **Testing** — use them as locators in unit tests, integration tests, and
   end-to-end tests instead of brittle class names or DOM paths.
2. **Tracking and monitoring** — query the DOM for component usage metrics,
   analytics, or observability.
3. **JavaScript queries** — find specific components or parts
   programmatically (e.g.,
   `document.querySelectorAll('[data-component="ActionList.Item"]')`).
4. **Simple CSS overrides** — as an added benefit, these selectors also
   provide a stable target for style customizations when needed.

### Implementation details

#### Naming convention

All values use PascalCase. The two attributes serve distinct roles:

```
data-component="ComponentName"     → root element of a component or sub-component
data-part="PartName"               → inner part within a component
```

##### Rules

1. **Root components** get `data-component` with their React component name.

   ```html
   <ul data-component="ActionList"></ul>
   ```

2. **Public sub-components** get `data-component` matching the React API. If
   consumers write `<ActionList.Item>`, the DOM element gets
   `data-component="ActionList.Item"`.

   ```html
   <li data-component="ActionList.Item"></li>
   ```

   Note: a sub-component root uses `data-component`, not `data-part`, because it
   is itself a component — it has its own props, its own identity, and may
   contain its own slots.

3. **Inner structural parts** (DOM elements that are not exposed as a
   sub-component but represent a meaningful part of the structure) get
   `data-part` with a PascalCase name describing the part.

   ```html
   <span data-part="Label">monalisa</span>
   <span data-part="Content">...</span>
   <span data-part="LeadingVisual"><img /></span>
   ```

   Slot names are **scoped to their parent component** — a `Label` slot inside
   `ActionList.Item` is distinct from a `Label` slot inside `Button` because
   they exist within different `data-component` boundaries.

4. **State and modifier attributes remain separate.** `data-component` and
   `data-part` identify _what_ an element is. Existing attributes like
   `data-variant`, `data-size`, and `data-loading` describe the _state_ of that
   element. These concerns must not be mixed.

   ```html
   <li data-component="ActionList.Item" data-variant="danger" data-active="true">
     <span data-part="Label">Delete file</span>
   </li>
   ```

#### `data-component` and `data-part` on all components and slots

All Primer components will receive a `data-component` attribute on their root
element, and all meaningful slots will receive a `data-part` attribute. These
attributes serve as the stable identifiers that consumers can use for targeting,
ensuring full coverage across the library.

Every component must provide:

- **`data-component`** on the root element of every component and public
  sub-component
- **`data-part`** on every internal structural element that a consumer might
  reasonably need to target (labels, content wrappers, visual slots, action
  slots)

Elements that are purely for layout and have no semantic meaning (spacers,
wrappers that exist only for CSS grid/flex layout) do not require either
attribute.

#### ESLint rule in `eslint-plugin-primer-react`

A new ESLint rule will be added to `eslint-plugin-primer-react` that **warns**
whenever a `data-component` or `data-part` selector is used in consumer code. The warning will
inform consumers of the implications of relying on these selectors — namely that
the surrounding DOM structure, attributes, parents, and children of the targeted
element are not guaranteed to be stable.

Consumers must **explicitly override** the
rule on a per-usage basis to use a `data-component` selector. Overriding the
rule acts as an acknowledgment that the consumer understands the risks and
accepts responsibility for any breakage caused by structural changes to the
component's DOM.

```js
/* eslint-disable primer-react/no-data-component-selector -- 
   Intentionally targeting ActionList.Item for custom border radius. 
   We accept that the surrounding DOM may change. */
```

#### Internal CSS usage

Components may use `data-part` selectors in their own CSS Modules for targeting
child parts. This replaces ad-hoc patterns like bare `[data-component='text']`
with the standardized naming:

```css
/* ButtonBase.module.css */
& :where([data-part='LeadingVisual']) {
  color: var(--button-leadingVisual-fgColor);
}
```

#### Testing requirements

The presence and values of `data-component` and `data-part` attributes must be
covered by tests. This can be achieved through:

- Unit tests that assert the attributes are present on rendered elements
- Snapshot tests that capture the attribute values

#### Documentation on Primer Docs

A dedicated section will be added to Primer Docs explaining what the stable
selectors are intended for and what they are not intended for.

**Intended use cases:**

- **Unit tests** — targeting components and slots in test assertions
  (e.g., `getByAttribute('data-component', 'ActionList.Item')`)
- **End-to-end testing** — using stable selectors in Playwright or Cypress
  locators instead of brittle class names or DOM structure
- **Simple CSS selectors** — directly targeting a component or slot for style
  overrides (e.g., `[data-component="Button"] { border-radius: 8px; }`)

**Not intended for:**

- **Complex CSS selector chaining** — sibling selectors (`~`, `+`), child
  combinators (`>`), or parent selectors (`:has()`) that depend on DOM structure
- **CSS hacks** — workarounds that rely on the internal layout, nesting, or
  ordering of elements within a component
- **Any code that assumes a specific DOM structure** — the DOM tree around a
  `data-component` element (its parent, children, siblings, and attributes) is
  not part of the public API and may change without notice

The best solution is always to work alongside Primer for your use case. If you
find yourself needing overly complex selectors or targeting `data-component`
attributes for something bigger than their intended use, chances are there is a
better approach. The Primer team is happy to help, guide, and assist with
whatever your use case may be. The design system is always growing — if we are
not covering your use case, we would love to hear from you, or even better,
accept a contribution!

### Relationship to CSS Modules and CSS Layers

While the primary purpose of `data-component` and `data-part` is identification
(testing, tracking, querying), they also serve as stable selectors for CSS
overrides when consumers need to customize appearance.

In that context, they complement the existing styling architecture:

- **CSS Modules** provide scoped class names for internal styling. Components
  continue to use CSS Module classes for their own styles.
- **CSS Layers** ([ADR-021](./adr-021-css-layers.md)) ensure that consumer
  overrides take precedence over component styles regardless of specificity.
- **`data-component` and `data-part`** provide the stable selectors that
  consumers can use to target components and their parts within those overrides.

Example of a simple, supported override:

> **Note:** This is an example for demo purposes only. In practice,
> `ActionList.Item` accepts a `className` prop, which is better suited for this
> type of override. You should always prefer the `className` prop over a stable
> selector when possible.

```css
[data-component='ActionList.Item'] {
  border-radius: 8px;
}
```

### Versioning and breaking changes

The **only** guarantee provided for `data-component` and `data-part` attributes is
that they **exist** and are **tied to the most relevant DOM element** for each
component and its slots.

The following aspects are **not** part of the public API and may change at any
time without notice or a major semver bump:

- The specific DOM element a `data-component` or `data-part` attribute is
  applied to
- The attributes, parent, or children of that element

Because of this, consumers should only rely on the **direct targeting** of
these selectors (e.g., `[data-component="ActionList.Item"]`). Chaining
selectors that depend on DOM structure — such as parent, child, or sibling
selectors — is **not supported** and may break without warning.

| Change                                                             | semver bump   |
| ------------------------------------------------------------------ | ------------- |
| A `data-component` or `data-part` attribute is added to an element | `minor`       |
| A `data-component` or `data-part` value is renamed                 | `major`       |
| A `data-component` or `data-part` attribute is removed             | `major`       |
| A `data-component` is changed to `data-part` or vice-versa         | `major`       |
| The DOM element an attribute is applied to changes                 | `minor`       |
| Attributes, parents, or children of the element change             | `patch/minor` |

The [Migration](#migration) table below captures the full set of renames
planned for the next major release.

### Migration

Existing `data-component` values must be migrated to the new convention. Inner
parts move from `data-component` to `data-part` with simplified names (since
they are scoped to their parent component). This migration is a breaking change
and should be coordinated as part of a major release.

| Current attr     | Current value                           | New attr         | New value                   |
| ---------------- | --------------------------------------- | ---------------- | --------------------------- |
| `data-component` | `buttonContent`                         | `data-part`      | `Content`                   |
| `data-component` | `text` (in Button)                      | `data-part`      | `Label`                     |
| `data-component` | `leadingVisual` (in Button)             | `data-part`      | `LeadingVisual`             |
| `data-component` | `trailingVisual` (in Button)            | `data-part`      | `TrailingVisual`            |
| `data-component` | `trailingAction` (in Button)            | `data-part`      | `TrailingAction`            |
| `data-component` | `ButtonCounter`                         | `data-part`      | `Counter`                   |
| `data-component` | `PH_LeadingAction`                      | `data-part`      | `LeadingAction`             |
| `data-component` | `PH_Breadcrumbs`                        | `data-part`      | `Breadcrumbs`               |
| `data-component` | `PH_LeadingVisual`                      | `data-part`      | `LeadingVisual`             |
| `data-component` | `PH_Title`                              | `data-part`      | `Title`                     |
| `data-component` | `PH_TrailingVisual`                     | `data-part`      | `TrailingVisual`            |
| `data-component` | `PH_TrailingAction`                     | `data-part`      | `TrailingAction`            |
| `data-component` | `PH_Actions`                            | `data-part`      | `Actions`                   |
| `data-component` | `PH_Navigation`                         | `data-part`      | `Navigation`                |
| `data-component` | `TitleArea`                             | `data-part`      | `TitleArea`                 |
| `data-component` | `GroupHeadingWrap`                      | `data-component` | `ActionList.GroupHeading`   |
| `data-component` | `ActionList.Item--DividerContainer`     | `data-part`      | `SubContent`                |
| `data-component` | `icon` (in UnderlineTabbedInterface)    | `data-part`      | `Icon`                      |
| `data-component` | `text` (in UnderlineTabbedInterface)    | `data-part`      | `Label`                     |
| `data-component` | `counter` (in UnderlineTabbedInterface) | `data-part`      | `Counter`                   |
| `data-component` | `multilineContainer`                    | `data-part`      | `Container`                 |
| `data-component` | `input` (in TextInput)                  | `data-part`      | `Input`                     |
| `data-component` | `AnchoredOverlay`                       | `data-component` | `AnchoredOverlay`           |
| `data-component` | `ActionBar.VerticalDivider`             | `data-component` | `ActionBar.VerticalDivider` |

Components that currently have no attributes on key parts must also be updated.

## Consequences

### Positive

- **Stable identifiers for testing.** Consumers can use `data-component` and
  `data-part` as reliable locators in unit tests, integration tests, and
  end-to-end tests — no more coupling to CSS Module hashes or DOM structure.
- **Enables tracking and monitoring.** Consumers can query the DOM for component
  usage metrics and observability without relying on implementation details.
- **Enables JavaScript queries.** Consumers and tests can use
  `querySelectorAll('[data-component="ActionList.Item"]')` reliably.
- **Clear separation.** `data-component` answers "which component is this?"
  while `data-part` answers "which part of the component is this?" This makes
  the DOM self-documenting and avoids overloading a single attribute.
- **Consistent naming.** A single convention replaces four inconsistent patterns,
  making the codebase easier to learn and maintain.
- **Scoped slot names.** Because `data-part` values are scoped to their parent
  `data-component`, names like `Label` or `LeadingVisual` can be reused across
  components without ambiguity.
- **Supports CSS overrides.** Consumers who need to
  customize styles have stable selectors to target, complementing CSS Layers
  (ADR-021) for a complete override path.

### Negative

- **Breaking change for existing consumers.** Anyone currently relying on the
  undocumented `data-component` values (e.g., in tests, tracking code, CSS
  overrides, or `querySelector` calls) will need to update when values are
  renamed. This must be coordinated in a major release.

## Alternatives

### 1. Stable class names alongside CSS Module classes

Add a non-hashed class name to every part (e.g.,
`className={clsx(classes.Item, 'ActionList-item')}`).

**Why not chosen:** Pollutes the global CSS namespace. Risk of collisions with
consumer or third-party styles. Requires consumers to understand which class
names are "stable" vs. which are CSS Module hashes. Data attributes are a
cleaner separation of concerns — class names for styling, data attributes for
identification.

### 2. CSS `::part()` pseudo-element

The `::part()` CSS pseudo-element allows styling of elements inside a shadow
DOM.

**Why not chosen:** Only works with Shadow DOM, which React does not use. Not
applicable to our architecture.

### 3. Do nothing — keep `data-component` as an internal implementation detail

Continue using `data-component` informally without guaranteeing stability.

**Why not chosen:** Consumers are already depending on these attributes in
tests, tracking code, and CSS overrides. Without a stability guarantee, any
refactor can silently break consumer code. Formalizing the API acknowledges the
reality and provides a proper contract.
