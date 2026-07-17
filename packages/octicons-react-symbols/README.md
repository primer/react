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

In your project, add the `OcticonSymbols` component and provide the symbols that
you would like to include.

```tsx
import {OcticonSymbols, CheckSymbol} from '@primer/octicons-react-symbols'

function RootLayout() {
  return (
    <OcticonSymbols symbols={[CheckSymbol]}>
      <App />
    </OcticonSymbols>
  )
}
```

Nested `OcticonSymbols` components only render symbols that have not already
been provided by an ancestor.

Downstream components can render icon references normally:

```tsx
import {CheckIconReference} from '@primer/octicons-react-symbols'

function Status() {
  return <CheckIconReference />
}
```

### Custom symbols

Use `createOcticonSymbol` to include custom SVG symbols in the same sprite:

```tsx
import {createOcticonSymbol, OcticonSymbols} from '@primer/octicons-react-symbols'

const StatusSymbol = createOcticonSymbol({
  id: 'status',
  definition: (
    <symbol id="status-16" viewBox="0 0 16 16">
      <path d="..." />
    </symbol>
  ),
})

function RootLayout() {
  return <OcticonSymbols symbols={[StatusSymbol]}>{/* Application content */}</OcticonSymbols>
}
```
