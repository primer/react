# ADR 013: Location of experimental react components maintained by Primer

## Status

❌ Not Adopted, `<issue with implementation details goes here>`

&nbsp;

## Context: Experimental components (or drafts) in primer/react

As we work on new components (or rewrites of old components), we often need to start with a "experiment" and not include it in the semantically versioned (semver-ed) main bundle.

[ADR-006](./adr-006-drafts.md) explains our use of "drafts", here are the relevant parts:

- When we are not sure about the API of a component, we put it in a different bundle: "primer/react/drafts". [ADR 010: Merge drafts status into experimental](./adr-010-drafts-are-experimental) recommends changing the name to `experimental`
- The contract with consumers is that you are opting into a component in which we don't have 100% confidence yet, the API and structure can change.

In [ADR 008: Lowering the barrier to entry](./adr-008-experimental-components) (Sep, 2022), we decided to create room to share experimental components between memex and the monolith with a new repository ([github/experimental-react-components](https://github.com/github/experimental-react-components)). Now that [memex is part of the monolith](https://github.com/github/planning-tracking/issues/1755), that [repository has been archived](https://github.com/github/platform-ux/issues/1248) (Feb, 2023).

Which leaves us with: Where should experimental components maintained by Primer live?

&nbsp;

### Problems with publishing experimental components in @primer/react npm package:

**Incompatible with semver**: Because we haven't reached the final API or structure, we need to ship breaking changes to experimental components. In the current setup, these breaking changes are part of minor or patch releases to primer/react.

On the consumer side, this makes every upgrade a potentially breaking upgrade nullifying the benefits of semver.

In the case of multiple teams working on the monolith, this can mean finding breaking changes for a new experimental component in a part of the app that you're not familiar with.

&nbsp;

## Decision

1. Experimental components, as defined by the [component lifecycle](https://primer.style/contribute/component-lifecycle#experimental), should not be part of semantically versioned npm package for `@primer/react`.

2. Each experimental component should be independently published and versioned with semver. Breaking changes should be tagged as major versions. Example: `@primer/react-experimental-underlinenav`.

3. The source code for all experimental components should continue to live in the same repository ([primer/react](https://github.com/primer/react)).

### Tradeoffs / Risks

1. The responsibility of using compatible versions of experimental components and primer/react is shifted to the consumer.
2. This would result in lots of new packages in the `@primer` scope on npm, creating some clutter.
3. When, both primer/react and dotcom include an experimental component in their dependencies, it's easy to end up with 2 major versions of an experimental package. This should be okay as long as they don't conflict. (for example, PageLayout might use an experimental Stack or ActionList might use an experimental implementation of slots)

&nbsp;

### Other options considered

The source code for experimental components can be hosted inside the monolith in [github/github/ui/packages](https://github.com/github/github/tree/master/ui/packages).

Pros:

1. Easier to experiment with production use cases.
2. Eliminates the need for versioning and publishing components.

Cons:

1. Harder to build and test changes that depend on companion changes in primer/react.
2. Breaking changes have to be adopted by all teams & usage using the experimental at the same time.
3. Harder to track and limit usage with controlled collaboration while it's still experimental or not accessible. Failed experiments become tech debt for the application.
