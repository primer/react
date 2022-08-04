# ADR 008: Lowering the barrier to entry for experimental components

## Status

Proposed

## Context

#### Recap: Drafts

As we work on new components (or rewrites of old components), we often need to start with a "prototype"[^1] and not include them in the semantically versioned (semver-ed) main bundle.

The approach that has served us well since Dec 2021 has been "drafts" (along with causing a lot of confusion).

[ADR-006](./adr-006-drafts.md) explains our use of drafts, but here are the relevant parts:

- When we are not sure about the API of a component, we put it in a different bundle: "primer/react/drafts"
- A draft has experimental API, but follows the development conventions of primer/react
- Components in drafts are companied by a design spec and go through the process of accessibility reviews. A component can check multiple boxes in the component lifecycle.
- The contract with consumers is that you are opting into a component in which we don't have 100% confidence yet.

[^1]: Calling this a prototype and not experimental, because that already means something else in the maturity lifecycle.

---

#### Problems with drafts

1. **Incompatible with semver**: Because the expectation with drafts is that we are not 100% confident about the API or structure of a component, we slip in breaking changes to draft components as minor releases to primer/react. On the consumer side, this makes every upgrade, even a patch, a potentially breaking upgrade. So, you are effectively opting out of your semver.

1. **Confusion about maturity**: Because of the generic name, "drafts" causes a lot of confusion, especially with "experimental". It is an prototype or experiment, but NOT in the way the [component lifecycle]([https://primer.style/contribute/component-lifecycle]) defines "Experimental" maturity.

1. **Need for experimental candidates**: As more teams build React components and look to upstream resuable components, it is natural to look at drafts as the place to put them. However, the barrier to entry into drafts isn't low (because we still follow design reviews, dev conventions, API reviews, etc.)

Upstreaming a component that was built in the context of a product requires re-evaluating the baked-in assumptions and most likely a change in the API to make it useful for other contexts.

## TODO: Decision

1. "Experimental" components, based on the component lifecycle, should not be part of semantically versioned npm package for `@primer/react`.

2. Experimental components should be versioned independently versioned with semver. Breaking changes should be tagged as major versions.

3. We should move them to another repository called `@primer/react-candidates`

(name ideas: primer/react-experimental, primer/react-candidates, primer/react-proposals, primer/react-contrib)

#### Other options considered

TODO: why primer/react-experimental and not github/react-shared?
related: where does the responsibility of maintaining a component while it's a candidate lie?
