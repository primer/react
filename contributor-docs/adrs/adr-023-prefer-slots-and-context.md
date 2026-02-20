# Prefer slots and context over React.Children and cloneElement

📆 Date: 2026-02-20

## Status

| Stage          | State          |
| -------------- | -------------- |
| Status         | Proposed ❓    |
| Implementation | Not planned ⛔ |

## Context

Several component APIs in `@primer/react` rely on `React.Children` and `React.cloneElement` to inspect, filter, wrap, or augment their children. At least 14 components use `React.Children` and 10+ use `React.cloneElement`:

| Component        | `React.Children` | `cloneElement` | What it does                                     |
| ---------------- | ---------------- | -------------- | ------------------------------------------------ |
| SegmentedControl | ✅               | ✅             | Iterates children to track selected index        |
| ActionMenu       | ✅               | ✅             | Clones anchor/trigger children to wire up events |
| NavList          | ✅               | ✅             | Finds SubNav children, clones with ref           |
| FormControl      | —                | ✅             | Clones input child to inject id and aria props   |
| TooltipV2        | —                | ✅             | Clones trigger child to add event handlers       |
| AvatarStack      | ✅               | ✅             | Maps children to add responsive size props       |
| ButtonGroup      | ✅               | —              | Wraps each child in a `<div>`                    |
| TreeView         | ✅               | —              | Finds SubTree child to determine expandability   |
| Breadcrumbs      | ✅               | —              | Filters valid elements, wraps in `<li>`          |
| LabelGroup       | ✅               | —              | Maps children for overflow measurement           |
| PageHeader       | ✅               | —              | Counts children for layout decisions             |
| ProgressBar      | ✅               | —              | Validates children types                         |
| UnderlineNav     | ✅               | —              | Iterates children for overflow detection         |
| CheckboxGroup    | ✅               | —              | Iterates for group state management              |

These patterns create several problems:

### 1. Ownership violation

The [component contents API doc](../component-contents-api-patterns.md) establishes that the _owner_ of a React element (the component that created it) should have the highest authority over it. `React.Children` and `cloneElement` allow a component to reach into elements it does not own — overriding, augmenting, or ignoring props set by the actual owner. This breaks the principle of least surprise.

### 2. Fragile assumptions about children structure

Components using `React.Children` assume direct children match expected types. This breaks when consumers wrap children in fragments, higher-order components, or conditional wrappers. For example:

```tsx
// This works:
<SegmentedControl>
  <SegmentedControl.Button>One</SegmentedControl.Button>
  <SegmentedControl.Button>Two</SegmentedControl.Button>
</SegmentedControl>

// This breaks — the fragment hides the children from React.Children:
<SegmentedControl>
  <>
    <SegmentedControl.Button>One</SegmentedControl.Button>
    <SegmentedControl.Button>Two</SegmentedControl.Button>
  </>
</SegmentedControl>
```

### 3. Props merging conflicts

`cloneElement` shallowly merges props, which can silently override consumer-provided props like `className`, `style`, event handlers, and `ref`. This creates bugs that are difficult to trace because the consumer's code looks correct but the component overrides it.

### 4. We already have a better pattern

The `useSlots` hook exists in the codebase and is already used by Dialog, ActionList, PageLayout, FormControl, and TreeView to extract named children without cloning them. It is declarative, type-safe, and SSR-compatible.

## Decision

### New components MUST NOT use `React.Children` or `React.cloneElement`

When a new component needs to detect, position, or coordinate with specific children, use one of these patterns instead (in order of preference):

### Pattern 1: Slots via `useSlots` — when you need to render children in specific locations

Use `useSlots` when the parent needs to extract specific children and render them in different positions within its own layout.

```tsx
// Dialog extracts Header, Body, Footer and renders them in a fixed layout
const [slots, childrenWithoutSlots] = useSlots(children, {
  header: Dialog.Header,
  body: Dialog.Body,
  footer: Dialog.Footer,
})

return (
  <div className={classes.Dialog}>
    {slots.header}
    {slots.body ?? <Dialog.Body>{childrenWithoutSlots}</Dialog.Body>}
    {slots.footer}
  </div>
)
```

**When to use:** The parent controls _where_ children render (layout slots). The parent doesn't need to modify the children — just place them.

**Wrapper components work with slots.** `useSlots` matches children by component type _or_ by the `__SLOT__` symbol. If a consumer wraps a slot component, the wrapper just needs to copy the original's symbol:

```tsx
import {Dialog} from '@primer/react'

// Custom wrapper around Dialog.Header
const MyCustomHeader = props => (
  <Dialog.Header {...props}>
    <Logo />
    {props.children}
  </Dialog.Header>
)

// Copy the slot symbol so useSlots still recognizes it
MyCustomHeader.__SLOT__ = Dialog.Header.__SLOT__
```

This means `useSlots` extracts the wrapper as a match for the original slot. The `isSlot()` utility checks `element.type.__SLOT__` against the config's `__SLOT__`, so both direct and wrapped components are detected.

**How to add slot support to a sub-component:**

1. Assign a unique symbol to the component: `MyComponent.__SLOT__ = Symbol('Parent.MyComponent')`
2. Add it to the parent's `useSlots` config: `{ mySlot: MyComponent }`
3. Use the `SlotMarker` / `FCWithSlotMarker` types for proper typing:

```tsx
import type {FCWithSlotMarker} from '../utils/types'

const Header: FCWithSlotMarker<HeaderProps> = ({children, ...rest}) => {
  return <div {...rest}>{children}</div>
}
Header.__SLOT__ = Symbol('Dialog.Header')
```

**Tradeoff:** `useSlots` can only extract _direct_ children (same as `React.Children`). Fragments between parent and slot child will prevent extraction. This is intentional — it keeps the parent-child contract explicit.

### Pattern 2: Context — when children need data from the parent

Use React context when children need to read parent state (variant, size, disabled status) but the parent doesn't need to modify or position the children.

```tsx
// Parent provides context
const SegmentedControlContext = React.createContext({selectedIndex: 0, onChange: () => {}})

function SegmentedControl({children, selectedIndex, onChange}) {
  const value = useMemo(() => ({selectedIndex, onChange}), [selectedIndex, onChange])
  return (
    <SegmentedControlContext.Provider value={value}>
      <div role="tablist">{children}</div>
    </SegmentedControlContext.Provider>
  )
}

// Child reads from context — no cloneElement needed
function Button({children, index}) {
  const {selectedIndex, onChange} = useContext(SegmentedControlContext)
  return (
    <button role="tab" aria-selected={index === selectedIndex} onClick={() => onChange(index)}>
      {children}
    </button>
  )
}
```

**When to use:** Children need data from the parent, but the parent doesn't need to control child layout. This replaces the most common use of `cloneElement` — injecting props like `selected`, `size`, `disabled`, or `id`.

**Tradeoff:** Requires children to opt in by reading from context. Children from third-party libraries won't automatically participate.

### Pattern 3: Data props — when the parent needs to iterate, sort, filter, or count

Use data props when the component needs to manipulate items as data (sorting, filtering, pagination, overflow calculations).

```tsx
// Instead of iterating children with React.Children.toArray
<LabelGroup labels={['bug', 'enhancement', 'help wanted']} overflowAt={3} />
```

**When to use:** The component needs the full dataset to make decisions (how many items? which should overflow?). The component owns the rendering of items.

**Tradeoff:** Less compositional than children-based APIs. Customization requires render props or custom renderers.

### Applying this to existing components

This ADR does not require migrating the 14+ existing components. The migration path for each would be:

| Component        | Current pattern          | Recommended migration                                                 |
| ---------------- | ------------------------ | --------------------------------------------------------------------- |
| SegmentedControl | `React.Children` + clone | Context for selected state; children self-register                    |
| ActionMenu       | `React.Children` + clone | Context for anchor ref/handlers; `useSlots` for trigger extraction    |
| NavList          | `React.Children` + clone | `useSlots` for SubNav; context for navigation state                   |
| FormControl      | `cloneElement`           | Context for id/validation/disabled; already partially uses `useSlots` |
| TooltipV2        | `cloneElement`           | Context or callback ref pattern for trigger props                     |
| AvatarStack      | `React.Children` + clone | Context for size; or data prop for avatar list                        |
| ButtonGroup      | `React.Children`         | CSS-only wrapping (`:nth-child` or gap), no JS iteration needed       |
| TreeView         | `React.Children`         | Already uses `useSlots` for SubTree; finish migration                 |
| Breadcrumbs      | `React.Children`         | Data prop (`items`), or CSS list styling without JS wrapping          |
| LabelGroup       | `React.Children`         | Data prop (`labels`) for overflow counting                            |
| PageHeader       | `React.Children`         | `useSlots` for named regions                                          |
| ProgressBar      | `React.Children`         | Data prop (`items`) with value/color                                  |
| UnderlineNav     | `React.Children`         | Context for overflow state; data prop for item list                   |
| CheckboxGroup    | `React.Children`         | Context for group state; children self-register via context           |

These migrations should be done individually as breaking changes (major version) or as parallel v2 components. They are not urgent — the primary goal of this ADR is to prevent new usage.

## Consequences

**Positive:**

- New components have more predictable, less fragile APIs
- Consumers can wrap children in fragments, conditionals, or HOCs without breaking the parent
- Prop conflicts from `cloneElement` merging are eliminated
- Type safety improves — `useSlots` config is strongly typed
- SSR compatibility is maintained (no refs needed for child detection)

**Negative:**

- Context-based coordination is slightly more verbose than `cloneElement`
- Third-party children can't implicitly participate in context coordination
- `useSlots` has the same direct-children-only limitation as `React.Children`
- Migrating existing components is a significant effort that must be sequenced as breaking changes

## Alternatives

### Keep allowing React.Children/cloneElement in new code

Rejected. The patterns are fragile, violate ownership, and we have strictly better alternatives already in the codebase.

### Require migrating all existing components now

Rejected. The migration surface is too large (~14 components) and each migration is a breaking change. Preventing new usage is the higher-leverage action.

### Use render props instead of slots

Considered but not recommended as the primary pattern. Render props are powerful but make JSX harder to read and don't match the `<Parent.Child>` composition pattern that Primer components use. Render props remain a valid escape hatch for advanced customization within data-prop-based components.
