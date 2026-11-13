# Alignment

## From: `@primer/react`

`Label` renders compact metadata with a `variant`, `small` or `large` size, and a polymorphic `as` prop.

## To: `@primer/react-tailwind`

Tailwind retains the same variants, sizes, `as` prop, and variant data attribute, using utility classes for styling. It does not emit the legacy size data attribute.

## Migration notes

- Existing `variant`, `size`, and `as` usage can be retained; element-specific props and refs follow the element selected by `as`.
- Use `FormControl.Label` to label a form field.
- Replace `sx`, styled-system props, and selectors targeting `data-size`.
- `data-variant` reflects the supplied variant or `default` when omitted, matching legacy selectors. Passing `variant={null}` disables variant styling and omits the attribute. An explicit `data-variant` takes precedence, matching legacy prop forwarding.
- Package borders use `border-thin` so legacy `@primer/css` does not override variant colors through its important `.border` shorthand. App-authored borders should use `border-thin` too; adding `className="border"` reintroduces the collision. This is not full isolation from other legacy utilities.
