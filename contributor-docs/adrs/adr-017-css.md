# ADR 17: Styling with CSS

## Status

| Stage    | Status                                                                |
| -------- | --------------------------------------------------------------------- |
| Approved | ✅                                                                    |
| Adopted  | 🚧 [github/primer#2160](https://github.com/github/primer/issues/2160) |

## Context

Reasons for change: Performance, utilise css variables

The main reason for changing our styling architecture is to remove performance issues for applications:

Relevant parts from [primer/discussions#1928](https://github.com/github/primer/discussions/1928#reasons)(Hubbers only link):

1. Initial page loads take longer

   Because styles are injected during runtime, we can not parallelize this work. The page is un-styled till the javascript bundle is
   downloaded and processed. The processing time is longer on slower devices.

   Benchmarks:

   i. Lab benchmarks: rendering a page with 1000 components
   runtime injection of css: 242ms
   static .css files: 96ms (60% faster)

   ii. Application benchmarks: render times for repo directory (>1000 files, [gh/gh#241090](https://github.com/github/github/pull/241090))
   with primer/react Box: 3800ms
   with custom css: 3076ms (20% faster)

2. Slow server side rendering

   Some applications are able to make up for slower initial render times by collecting styles on the server first. In the correct stack, collecting styles requires rendering the app twice before we can ship any html to the user.

   benchmarks: in the issues-app experiment, collecting styles on the server contributed to + 20% of rendering time (450ms on top of 1900ms)

3. Style updates are expensive

   The slowest part of the current stack is updating styles based on props or state. Big changes take linearly longer, worse on slower devices.

   Benchmarks:

   i. Lab benchmarks: updating a page with 1000 components, static runtime css vs. dynamic runtime css (thanks @mattcosta7 for these!)

   re-rendering components with fixed styles on runtime: 242ms
   re-rendering components with dynamic styles on runtime: 441ms (55% slower)

   ii. Application benchmarks: opting out of IconButton for PR diff view (>500 files, [gh/gh#243269](https://github.com/github/github/pull/243269))

   dynamic styles with sx prop: 400ms
   dynamic styles with .css files: 165ms (60% faster)

The other reasons for change are to utilise css variables for theming and improve the guardrails of consuming primer/primitives

## Decisions

1. Manually refactor styles to css files + css modules

   Use css variables from primer/primitives for inexpensive theming support, especially with server side rendering

2. Use css modules with hash

   By importing styles in the component, we can create an explicit dependency between the two. This enables applications using primer to have control over bundling and delivery.

   To begin with, we will ship a single css bundle that can be imported in the application. (example: `import '@primer/react/styles.css'`). When needed, we have the option to delegate bundling of css files to the application (they can be split by page or bundled as a common chunk for all react pages to share)

3. Keep styled-components underneath for supporting sx prop.

   Keep backward compatibility, we might change this in the future

Code example:

```jsx
import clsx from 'clsx'
import classNames from './ActionList.module.css'

const Button = ({className, sx, ...props}}) => {
  return (
    <Box
      as="button"
      sx={sx}
      // it's important to pass both internal and props.className to the element
      className={clsx(classNames.ActionList, className)}
      {...props}
    >
    </Box>
  )
}
```

### Out of scope

Methodologies and guidelines on how to author CSS are not part of this ADR/decision. We will define those as we move components to css and find repeating patterns.

&nbsp;

### Other options considered

1. Continue to author styles in typescript, compile them to .css files before shipping

   We benefit from type-safety while authoring components, compiled to .css files with a babel plugin before shipping.

   We are not choosing this option to have more control on the output by keeping the authored and shipped code similar.
