# Ensure spread props come before other props (spread-props-first)

Spread props should come before other named props to avoid unintentionally overriding props. When spread props are placed after named props, they can override the named props, which is often unintended and can lead to UI bugs.

## Rule details

This rule enforces that all spread props (`{...rest}`, `{...props}`, etc.) come before any named props in JSX elements.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/spread-props-first: "error" */

// ❌ Spread after named prop
<Example className="..." {...rest} />

// ❌ Spread in the middle
<Example className="..." {...rest} id="foo" />

// ❌ Multiple spreads after named props
<Example className="..." {...rest} {...other} />
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/spread-props-first: "error" */

// ✅ Spread before named props
<Example {...rest} className="..." />

// ✅ Multiple spreads before named props
<Example {...rest} {...other} className="..." />

// ✅ Only spread props
<Example {...rest} />

// ✅ Only named props
<Example className="..." id="foo" />
```

## Why this matters

Placing spread props after named props can cause unexpected behavior:

```jsx
// ❌ Bad: className might get overridden by rest
<Button className="custom-class" {...rest} />

// If rest = { className: "other-class" }
// Result: className="other-class" (custom-class is lost!)

// ✅ Good: className will override any className in rest
<Button {...rest} className="custom-class" />

// If rest = { className: "other-class" }
// Result: className="custom-class" (as intended)
```

## Options

This rule has no configuration options.

## When to use autofix

This rule includes an autofix that will automatically reorder your props to place all spread props first. The autofix is safe to use as it preserves the order of spreads relative to each other and the order of named props relative to each other.
