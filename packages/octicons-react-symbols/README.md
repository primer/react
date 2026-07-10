# @primer/octicons-react-symbols

> Optimized React components for rendering Octicons with shared SVG symbols

## Getting started

To install `@primer/octicons-react-symbols` in your project, you will need to
run the following command using [npm](https://www.npmjs.com/):

```bash
npm install -S @primer/octicons-react-symbols
```

## Usage

The `@primer/octicons-react-symbols` package provides Octicon components that
reference shared SVG symbols instead of re-creating the same SVG markup every
time an icon is rendered. This is useful in apps that render the same icons many
times, because the symbol definition can be shared while each icon renders a
small `<svg><use /></svg>` reference.

At the root of your application, wrap your app with `OcticonSymbols`:

```tsx
import {OcticonSymbols, CheckSymbol} from '@primer/octicons-react-symbols'

function RootLayout() {
  return (
    <>
      <OcticonSymbols>
        <CheckSymbol />
      </OcticonSymbols>
      <App />
    </>
  )
}
```

Downstream components can render icons normally:

```tsx
import {CheckIcon} from '@primer/octicons-react-symbols'

function Status() {
  return <CheckIcon />
}
```
