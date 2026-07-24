# `@primer/react-tailwind`

Primer React components implemented with Tailwind CSS and Base UI.

This package is under active development. It does not depend on `@primer/react`
at runtime.

## Compiled CSS

Import the compiled component and theme styles once:

```tsx
import '@primer/react-tailwind/styles.css'
import {Button} from '@primer/react-tailwind/Button'
```

## Tailwind v4

Applications that compile the package classes themselves can import the Primer
theme configuration and explicitly scan the package:

```css
@import 'tailwindcss';
@import '@primer/react-tailwind/tailwind.css';
@source '../node_modules/@primer/react-tailwind/dist';
```

Do not combine host-generated package utilities with `styles.css`, because that
duplicates the component rules.

`base.css` is optional and does not include Tailwind Preflight.
