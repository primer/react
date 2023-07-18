# ADR 6: Parallel experimental track & plan for deprecated components

## Status

Superseded by [ADR 010](./adr-010-drafts-are-experimental.md)

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | ✅     |

## Context

As we work on maturity of our components, we will sometimes need to build components in a parallel track/bundle without breaking existing components. Eventually, the new components would replace the old ones in the main bundle.

## Here are the 3 proposed stages:

### Stage 1

Start new component outside the main bundle. Folks who want to try it, need to explicitly import it from the `drafts` bundle.

`import { ActionMenu } from '@primer/react/drafts'`

The contract with consumers is - you are opting into a rewrite of the old component that might not cover all the cases of the old component yet. If you are using both the old and new version of the component in different pages, you are paying some additional bundlesize cost.

Note: If it is a 1:1 replacement, it's useful to keep the component name the same for consumers. Internally, we would want to call the filename `ActionMenu2.tsx` and call it `ActionMenu v2` in the docs.

### Stage 2

After we have the confidence that this component is better than the old version of it, we swap the components and move the old component out of the main bundle.

This is a breaking change! We are now officially recommended that consumers start using the new component, but if they'd like to push that effort to the future, we give them an easy way out -

`import { ActionMenu } from '@primer/react/deprecated'`

The deprecated component does not accept new features requests.

Reason: Because we have a single bundle for all components, you can not pick the components you want to upgrade. This can result in additional unrelated work.

### Stage 3

After 3 months of living in the `deprecated` bundle, a component is retired/deleted from the codebase. This is also a breaking change.

At this point, consumers are expected to plan migration work.

## Suggested changes:

We should detangle "drafts" from component lifecycle.

"Drafts components" should not be collocated with "main bundle" components in the documentation or status page. They should have their own section because they are not recommended as an alternative yet.
