# Before deprecating components

## Status

| Stage    | Status      |
| -------- | ----------- |
| Approved | <!-- ✅ --> |
| Adopted  | <!-- 🚧 --> |

## Context

As Primer evolves we need to deprecate components that have low adoption, have been replaced, or no longer align with GitHub's needs. This document outlines the process for alignment, decision making, and communication of component deprecation.

## Decision

Components must go through a structured process for deprecation. To deprecate a component, we need to first make a decision to start deprecating a component where we set a components status to `Phase out` which will then be followed by `Deprecation`. 

The purpose of `Phase out` is to ensure that we start to communicate that a component is on its way out, before  the deprecation work is done in an upcoming release.

There is a template checklist that can be followed to document the deprecation of each component. 


### Steps to phase out and deprecate

1. **Identify the component and check usage**:
- Establish a case for deprecation — low usage, replacement available, alternate pattern available, recipe available. 
- Conduct an analysis to determine the extent of the component's usage across the codebase using Primer Query.
- Do a risk evaluation to understand what impacts this component might have.
- Add to the upcoming Primer release proposals issue.

2. **Team consensus**: 
- Obtain agreement from the team that deprecating the component is the best course of action. 
- Bring a component to Primer Patterns and present to get consensus.

3. **Documentation updates**:
- Remove the component from Storybook components and move it to Phase out section by modfying its Story file.
- Update Primer.style documentation to reflect the `Phase out` status by adding a status label to the docs and a caution Banner. If possible, link to a new component or other pattern.
    
4. **Start deprecation**
Follow the guidance listed in [Deprecating components guide](https://github.com/primer/react/blob/main/contributor-docs/deprecating-components.md)
