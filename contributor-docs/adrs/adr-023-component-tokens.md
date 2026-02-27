# [ADR] Component tokens as CSS custom properties

📆 Date: 2026-02-26

## Status

| Stage          | State    |
| -------------- | -------- |
| Status         | Proposed |
| Implementation |          |

## Context

Primer React components use design tokens from `@primer/primitives` for colors, spacing, typography, and borders. These tokens enforce consistency across the design system but make it difficult for consumers to customize the appearance of individual component instances without resorting to fragile CSS overrides targeting internal elements.

A common need is to restyle a component for a specific context or adjusting border radius to match a custom layout. Today, the only options are:

1. **Override internal CSS module class names or elements** — brittle, breaks on refactors, and not part of the public API.
2. **Use inline styles on the component** — limited to properties exposed on the root element and cannot target internal elements like the selected state or hover states.
3. **Wrap in a themed provider** — too broad, affects all components in the subtree.

Component tokens solve this by exposing a stable set of CSS custom properties that consumers can set on a parent element or the component itself to customize its appearance.

## Decision

Every component should expose a set of **component tokens** as CSS custom properties. These tokens are the public styling API of the component and follow a consistent pattern across all components.

Documentation must specify this as an escape hatch.

### Naming convention

Component tokens use the following naming pattern:

```
--{componentName}-{property}
--{componentName}-{variant}-{property}
```

Examples from `SegmentedControl`:

| Token                                      | Purpose                                   |
| ------------------------------------------ | ----------------------------------------- |
| `--segmentedControl-bgColor`               | Track background color                    |
| `--segmentedControl-bgColor-hover`         | Track background on hover                 |
| `--segmentedControl-bgColor-active`        | Track background on active/press          |
| `--segmentedControl-borderColor`           | Outer border color                        |
| `--segmentedControl-borderRadius`          | Outer border radius                       |
| `--segmentedControl-iconColor`             | Icon color (default state)                |
| `--segmentedControl-fgColor`               | Text color (default state)                |
| `--segmentedControl-iconColor-hover`       | Icon color (hover state)                  |
| `--segmentedControl-fgColor-hover`         | Text color (hover state)                  |
| `--segmentedControl-fontWeight`            | Text weight (default state)               |
| `--segmentedControl-innerPadding`          | Horizontal padding inside each button     |
| `--segmentedControl-trackPadding`          | Inset between the track border and button |
| `--segmentedControl-selected-bgColor`      | Selected segment background               |
| `--segmentedControl-selected-fgColor`      | Selected segment text color               |
| `--segmentedControl-selected-iconColor`    | Selected segment icon color               |
| `--segmentedControl-selected-fontWeight`   | Selected segment text weight              |
| `--segmentedControl-selected-borderColor`  | Selected element border color             |
| `--segmentedControl-selected-borderRadius` | Selected element border radius            |

### What to tokenize

Expose tokens for visual properties that a consumer may reasonably need to customize:

- **Colors** — background, foreground (text), border, and icon colors for each distinct state (rest, hover, active, selected, disabled).
- **Border radius** — the outer shape of the component.
- **Font weight** — when the component uses non-standard weights (e.g., semibold for selected state).
- **Spacing** — internal padding values that affect the component's visual density, when they are not derived from a standard size primitive.
- **Shadow** — shadows for internal elements and the main element

### What NOT to tokenize

Do not expose tokens for:

- **Layout properties** — `display`, `width`, `height`, `flex`, `position`. These are structural and changing them would break the component.
- **Focus styles** — outline color, offset, and box-shadow for focus states must remain consistent for accessibility.
- **Font size** — controlled by the `size` prop and design system typography scale.
- **Font family** — inherited from the page and should not vary per-component.
- **Cursor** — semantic (e.g., `pointer` for clickable, `not-allowed` for disabled) and should not be overridden.
- **Internal structural values** — z-index, pseudo-element positioning, transforms used for hit areas.

### Implementation pattern: `var()` with fallback

**Do not** define component tokens as custom properties on the component element itself. Setting a property on the element always wins over inherited values, which prevents consumers from overriding tokens from a parent element.

❌ **Wrong — blocks inheritance:**

```css
.SegmentedControl {
  --segmentedControl-bgColor: var(--controlTrack-bgColor-rest);
  background-color: var(--segmentedControl-bgColor);
}
```

With this pattern, setting `--segmentedControl-bgColor` on a parent `<div>` has no effect because the component redefines it on its own element.

✅ **Correct — use `var()` with a fallback value:**

```css
.SegmentedControl {
  background-color: var(--segmentedControl-bgColor, var(--controlTrack-bgColor-rest));
}
```

The token is never defined by the component. It only references it with a fallback. If a consumer sets `--segmentedControl-bgColor` on any ancestor element, that value is inherited and used. If not, the fallback kicks in.

### Documentation in CSS

List all available component tokens in a comment block at the top of the component's root selector:

```css
.SegmentedControl {
  /*
   * Component tokens – override these custom properties from a parent
   * element to customize the control:
   *
   * --segmentedControl-bgColor
   * --segmentedControl-bgColor-hover
   * --segmentedControl-borderColor
   * --segmentedControl-borderRadius
   * --segmentedControl-fgColor
   * --segmentedControl-iconColor
   * --segmentedControl-fontWeight
   * --segmentedControl-innerPadding
   * --segmentedControl-trackPadding
   * --segmentedControl-selected-bgColor
   * --segmentedControl-selected-borderColor
   * --segmentedControl-selected-borderRadius
   * --segmentedControl-selected-fgColor
   * --segmentedControl-selected-iconColor
   * --segmentedControl-selected-fontWeight
   */

  background-color: var(--segmentedControl-bgColor, var(--controlTrack-bgColor-rest));
  /* ... */
}
```

### Consumer usage

Consumers override tokens by setting them on a parent element or via inline styles:

```tsx
<div
  style={
    {
      '--segmentedControl-bgColor': 'var(--bgColor-accent-muted)',
      '--segmentedControl-selected-bgColor': 'var(--bgColor-accent-emphasis)',
      '--segmentedControl-selected-fgColor': 'var(--fgColor-onEmphasis)',
    } as React.CSSProperties
  }
>
  <SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
  </SegmentedControl>
</div>
```

Consumers should prefer using Primer primitive values (e.g., `var(--bgColor-accent-emphasis)`) over hardcoded colors to maintain theme compatibility.

## Consequences

### Positive

- **Stable public API** — consumers can customize components without depending on internal class names.
- **Inheritance-friendly** — tokens set on a parent cascade down, enabling contextual theming.
- **Backward compatible** — existing components continue to work unchanged; tokens are purely additive.
- **Self-documenting** — the comment block in each component's CSS file serves as the token reference.
- **Theme-safe** — fallback values ensure the component always looks correct even if no tokens are set.

### Negative

- **Stylelint noise** — component tokens trigger `primer/colors` and `primer/borders` lint rules because they are not recognized Primer primitives. Each usage requires a `stylelint-disable` comment. This could be mitigated by allowing component tokens with primitives in styleLint.
- **API surface** — once a token is documented and adopted, renaming or removing it is a breaking change per our [versioning policy](../versioning.md#a-component-changes-its-usage-of-a-css-custom-property).

## Alternatives

### Use `data-component` and `data-slot` attributes for styling hooks

Components could expose stable DOM hooks such as `data-component="SegmentedControl"` and `data-slot="button"`, allowing consumers to target internal parts with selectors:

```css
[data-component='SegmentedControl'] {
  background-color: var(--bgColor-accent-muted);
}

[data-component='SegmentedControl'] [data-slot='selected'] {
  color: var(--fgColor-onEmphasis);
}
```

This relies on selector-based overrides, couples consumers to the component's internal DOM shape, and encourages state styling through external selectors rather than a constrained token contract. It can be useful for testing and diagnostics, but component tokens provide a clearer, inheritance-friendly, and more stable public styling API, that we can control with guradrails.

### Expose a `style` prop for each sub-element

Instead of CSS custom properties, components could accept style objects for internal elements (e.g., `selectedStyle`, `hoverStyle`). This was rejected because it couples styling to the React API, does not support CSS inheritance, and significantly increases the prop surface of every component.
