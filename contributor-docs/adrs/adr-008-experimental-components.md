# ADR 008: Lowering the barrier to entry for experimental components

## Status

Proposed

&nbsp;

## Context

#### Recap: Drafts

As we work on new components (or rewrites of old components), we often need to start with a "prototype"[^1] and not include them in the semantically versioned (semver-ed) main bundle.

The approach that has served us well since Dec 2021 has been "drafts" (along with causing a lot of confusion).

[ADR-006](./adr-006-drafts.md) explains our use of drafts, but here are the relevant parts:

- When we are not sure about the API of a component, we put it in a different bundle: "primer/react/drafts"
- A draft has experimental API, but follows the development conventions of primer/react
- Components in drafts are accompanied by a design spec and go through the process of accessibility reviews. A component can check multiple boxes in the component lifecycle.
- The contract with consumers is that you are opting into a component in which we don't have 100% confidence yet.

[^1]: Calling this a prototype and not experimental, because that already means something else in the maturity lifecycle.

&nbsp;

#### Problems with drafts

1. **Incompatible with semver**: Because the expectation with drafts is that we are not 100% confident about the API or structure of a component, we slip in breaking changes to draft components as minor releases to primer/react. On the consumer side, this makes every upgrade, even a patch, a potentially breaking upgrade. So, you are effectively opting out of your semver.

   Upstreaming a component that was built in the context of a product requires re-evaluating the baked-in assumptions and most likely a change in the API to make it useful for other contexts.

1. **Confusion about maturity**: Because of the generic name, "drafts" causes a lot of confusion, especially with "experimental". It is a prototype or experiment, but NOT in the way the [component lifecycle]([https://primer.style/contribute/component-lifecycle]) defines "Experimental" maturity.

1. **Need for experimental candidates**: As more teams build React components and look to upstream reusable components, it is natural to look at drafts as the place to put them. However, the barrier to entry into drafts isn't low (because we still follow design reviews, dev conventions, API reviews, etc.)

Feature teams using Primer may not be intimately familiar with Primer component lifecycle criteria or have the time and/or knowledge to meet it. Often, feature teams create their own components outside of Primer if they find it too difficult to contribute. This leads to lower Primer adoption and conflicting versions of similar functionality throughout GitHub products.

We want to enable feature teams to contribute to Primer. We also want to make it clear which contributions haven't been evaluated by our high standards for Primer components.



&nbsp;

## Decision

1. "Experimental" components, as defined by the component lifecycle, should not be part of semantically versioned npm package for `@primer/react`.

2. Each experimental component should be independently versioned with semver. Breaking changes should be tagged as major versions.

3. To support different conventions and processes for experimental components, we should keep them in a new repository `primer/react-candidates`

(other name ideas: primer/react-experimental, primer/react-candidates, primer/react-proposals, primer/react-contrib)

&nbsp;

#### Risks:

The maintenance of components while they are still candidates (bugs, a11y remedial, etc.) will be a new parallel workstream for the primer team. With our current team size, we might not be able to give it the required attention.

&nbsp;

#### Other options considered

1. Experimental components should live in [github/github/modules/react-shared](https://github.com/github/github/tree/master/app/assets/modules/react-shared)

   The monolith already has a place where reusable react components live, however these cannot be shared by react projects outside the monolith.

   We can publish "react-shared" as a npm package but that would introduce additional work for non-monolith projects and components built within the context of the monolith might not work in other projects without making them more flexible.

2. Experimental components should live in a new repository `github/react-shared` or `github/primer-react-candidates` instead of `primer/react-candidates`

   This is not a bad option, it helps in sharing components between projects outside of monolith as well and the ownership and responsibility of maintenance is shared by multiple teams.

   While primer would be one of the teams maintaining this repository, the lack of a primary "owner" might mean that this repository only gets additions and the maintenance of components gets neglected.
