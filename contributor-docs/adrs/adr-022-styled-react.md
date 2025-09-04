# [ADR] Add supporting package for styled components

📆 Date: 2025-09-04

## Status

| Stage          | State                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------- |
| Status         | Accepted ✅ <!-- Proposed ❓ OR Accepted ✅ OR Superseded by [LINK](https://) ⚠️ OR Deprecated ⛔ --> |
| Implementation | Adopted ✅ <!-- Not planned ⛔ OR Adoption awaiting in [LINK](https://) ⏸️ OR Adopted ✅ -->         |

## Context

<!-- Provide background information and the reasons for this decision. What are the business, technical, or other drivers that motivated this decision? -->

We would like to remove support for styled-components from Primer React in order to [advance CSS Modules](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-016-css.md#decisions) as a performant styling architecture for the library.
However, there is still existing usage of styled-components downstream that is
unlikely for us to be able to migrate. As a result, we would like to explore
adding a supporting package to Primer React that will allow components to work
with styled-components while providing the ability for us to remove it from
`@primer/react` directly in favor of CSS Modules. This should encourage Primer React consumers to [fall into the "pit of success"](https://blog.codinghorror.com/falling-into-the-pit-of-success/) while allowing a reasonable migration period.

## Decision

<!-- Clearly state the architectural decision that has been made. This includes details about the chosen solution. -->

We will create a new package called `@primer/styled-react` to mirror the
existing `@primer/styled-octicons` package. This package will re-export
components from `@primer/react` that still have `sx` usage downstream in order
to provide compatibility with `styled-components` and the latest version of
`@primer/react`. This package will allow teams to use the latest version of
`@primer/react` without having to fully migrate from `sx`.

This package will stay at a pre-1.0 version. Over time, we will remove
components from `@primer/styled-react` when their `sx` usage across key GitHub repos goes to zero.

This package and the components within will be deprecated by default to
encourage migrating to using CSS Modules over `styled-components`.

## Consequences

<!-- What are the consequences of this decision? Include both positive and negative outcomes. What trade-offs come with this decision? -->

With this decision, we will end up publishing two packages from `primer/react`
and associated workflows will need to be updated to accommodate this change. In
addition, we are expanding the scope of packages from Primer that teams may
interact with. Finally, providing support in this way may lead to prolonged
usage of `styled-components` since we are not forcing anyone to migrate to use
the latest version of `@primer/react`.

## Alternatives

<!-- Describe other options that were considered and why they were not chosen. This helps provide context and justification for the decision. -->

One alternative to this path is to attempt to migrate teams off of
`styled-components` and `sx` usage before making this change. However, with our
recent attempts to do this CSS Modules refactor, it would be helpful to decouple
migration efforts from the library as they can take a while to land.
