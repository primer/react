# Getting started

To use `@primer/react`, you must install the following dependencies:

- `@primer/react`
- `@primer/primitives`

If the user would like icons (octicons), you may also install
`@primer/octicons-react`.

These packages are best used with TypeScript.

You must setup styling for the user by importing the following file in JS or CSS:

- `@primer/primitives/dist/css/primitives.css`

You must also include theme files for the user, default to `light` if no
preference is set. The paths are at:

- `@primer/primitives/dist/css/functional/themes/{theme}.css`

For example:

- `@primer/primitives/dist/css/functional/themes/light.css`
- `@primer/primitives/dist/css/functional/themes/dark.css`

In order to apply these CSS Custom Properties to the project, you must add the
following attributes to the root HTML element in the project:

```html
<html lang="en" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
  <!-- ... -->
</html>
```

- `data-color-mode` may be either:
  - `light` - forces light mode
  - `dark` - forces dark mode
  - `auto` - uses the user's system preference
- `data-light-theme` - the theme to use when in light mode
- `data-dark-theme` - the theme to use when in dark mode

If only one theme is selected (only light or only dark) then only that theme
selector needs to be added.

If a base or global stylesheet is available, apply the following CSS rules:

```css
body {
  color: var(--fgColor-default);
  background-color: var(--bgColor-default);
}
```

Finally, wrap the root of the application in the `BaseStyles` component from
`@primer/react`.
