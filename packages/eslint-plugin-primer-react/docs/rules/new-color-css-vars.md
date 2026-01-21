## Upgrade legacy color CSS variables to Primitives v8 in sx prop

CSS variables are allowed within the `sx` prop in Primer React components. However, the legacy color CSS variables are
deprecated in favor of the new CSS variables introduced in Primitives v8. This rule will warn you if you are using the
deprecated color CSS variables in the `sx` prop, and autofix it.

## Rule Details

This rule looks inside the `sx` prop for the following properties:

```json
[
  "bg",
  "backgroundColor",
  "color",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "border",
  "boxShadow",
  "caretColor"
]
```

The rule references a static JSON file called `css-variable-map.json` that matches the old color CSS variables to a new
one based on the property. We only check `sx` because `stylelint` is used to lint other forms of CSS-in-JS.

👎 Examples of **incorrect** code for this rule

```jsx
<Button sx={{color: 'var(--color-fg-muted)'}}>Test</Button>
```

👍 Examples of **correct** code for this rule:

```jsx
<Button sx={{color: 'var(--fgColor-muted)'}}>Test</Button>
```
