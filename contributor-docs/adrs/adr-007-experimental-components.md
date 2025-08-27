# Lowering the barrier to entry for experimental components

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | ❌ [Abandoned](https://github.com/github/primer/issues/2534#issuecomment-3227363552) |

&nbsp;

## Context

### Recap: Drafts

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

1. npm package: "Experimental" components, as defined by the component lifecycle, should not be part of semantically versioned npm package for `@primer/react`.

2. npm package: Each experimental component should be independently published and versioned with semver. Breaking changes should be tagged as major versions. Example: `@github/experimental-react-commentbox`

3. The code for experimental components should live in a new repository, example: [github/react-experimental](https://github.com/github/react-experimental) and published as individual packages as suggested in point 2.

This will help in sharing experimental components between the monolith and projects outside of monolith. The ownership and responsibility of maintenance will be shared by multiple teams (including primer).

### Risks:

This will require improvements in the development and publishing workflow for experimental components. Without making that investment, we could create more friction and make contributions more difficult.

&nbsp;

#### Other options considered

1. The code for experimental components should live in a new repository code `github.com/primer/react-candidates` to support different conventions and processes for experimental components and convey shared ownership between primer and product teams.

   Keeping experimental components in primer _org_ suggests that the primer _team_ would take up maintenance of these components while they are still candidates (bugs, a11y remedial, etc.). This will be a new parallel workstream for the team and with our current team size, we might not be able to give it the required attention.

2. The code for experimental components should live inside the monolith in [github/github/modules/react-shared](https://github.com/github/github/tree/master/app/assets/modules/react-shared) instead of a new repository.

   This option has the lowest barrier to entry for developers working in the monolith, however this would be significantly more difficult for non-monolith projects (example: memex). The difference in how the same component is consumed in the monolith (relative import) and non-monolith projects (published package) would create additional challenges that we haven't explored yet.

3. The code for experimental components should live in [github.com/primer/react](http://github.com/primer/react), but published to multiple npm packages, which would result in less maintenance overhead by keeping all components in one repository. However, this might make it harder to enforce different dev conventions/processes and code ownership for experimental vs non-experimental components.
