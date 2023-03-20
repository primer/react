# ADR 12: File structure

## Status

TODO

## Context

Reasons for change: Performance, utilise css variables

The main reason for rethinking the architecture is performance issues for applications:

Initial page loads take longer

Because styles are injected during runtime, we can not parallelize this work. The page is un-styled till the javascript bundle is
downloaded and processed. The processing time is longer on slower devices.

Benchmarks:

i. Lab benchmarks: rendering a page with 1000 components
runtime injection of css: 242ms
static .css files: 96ms (60% faster)

ii. Application benchmarks: render times for repo directory (>1000 files, gh/gh#241090)
with primer/react Box: 3800ms
with custom css: 3076ms (20% faster)

Slow server side rendering

Some applications are able to make up for slower initial render times by collecting styles on the server first. In the correct stack, collecting styles requires rendering the app twice before we can ship any html to the user.

benchmarks: in the issues-app experiment, collecting styles on the server contributed to + 20% of rendering time (450ms on top of 1900ms)

Style updates are expensive

The slowest part of the current stack is updating styles based on props or state. Big changes take linearly longer, worse on slower devices.

Benchmarks:

i. Lab benchmarks: updating a page with 1000 components, static runtime css vs. dynamic runtime css (thanks @mattcosta7 for these!)

re-rendering components with fixed styles on runtime: 242ms
  re-rendering components with dynamic styles on runtime: 441ms (55% slower)

ii. Application benchmarks: opting out of IconButton for PR diff view (>500 files) gh/gh#243269

dynamic styles with sx prop: 400ms
  dynamic styles with .css files: 165ms (60% faster)

The other reasons for change are to utilise css variables for theming and improve the guardrails of consuming primer/primitives

Here's a longer explainer for more context (7 mins)

Discussion link: https://github.com/github/primer/discussions/1928#reasons

## Decision

Manually refactor to .css

Keep styled-components underneath for supporting sx prop. We might re-consider this in the future

1. ship static .css files for each component
   Each component would bring it’s related css with it. This is a good fit for the library (styles bundled along with javascript) and gives applications more control over bundling: they can be split by page or bundled as a common chunk for all react pages to share
   important: merge classnames

   css modules + no hash

   ```jsx
   import * as classNames from './ActionList.css'

   const ActionList = ({className,...props}}) => {
      return <Box className={classnames(classNames.ActionList, className)} {...props}></Box>
   }
   ```

}

2. keep styled-components with sx under the hood

3. Utilise css variables
   Use css variables from primer/primitives for inexpensive theming support, especially with server side rendering

4. Question: Should we use primer/css as an internal dependency and then override use cases where we have to

5. data-variants or nah?

### Other options considered

1. Continue to author styles in typescript, compile them to .css files before shipping

We benefit from type-safety while authoring components, compiled to .css files with a babel plugin before shipping.

We're not doing this to have more control on the output + maintain one less tool
