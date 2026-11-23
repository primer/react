---
name: component-api-design
description: Use when designing, reviewing, or grading a Primer React component API that changes consumer composition, configuration, state, callbacks, refs, forms, or compatibility. Do not use for implementation-only changes that leave the public API unchanged.
---

# Primer component API design

Start by documenting the component's own contract, then grade it against the accepted benchmark target. Resolve conflicting ADR requirements by scope and decision text; in particular, ADR-022-styled-react moves legacy `sx` compatibility to `@primer/styled-react`, so its absence from `@primer/react` is not a gap. Keep current-contract defects separate from target gaps; a missing target requirement is an `ADR GAP`, even when the released component never promised it. Preserve existing callback signatures and recommend additive migrations.

For whole-component grading, use the pinned baseline, complete every active and candidate verdict row, distinguish source/execution/judgment evidence, and run the calculator. Rubric 0.6.0 emits one active grade; `PART-RENDER` is visible as an unweighted candidate check with a proposed weight of 8. Candidate checks and findings never affect the score, denominator, section caps, evidence coverage, or status. Do not produce a second score with selected checks removed. Grade existing handler, class, style/attribute, ref, and behavior merges from their current public implementation. Do not mark those checks `COVERED` just because `render` is absent. Keep `NOT MEASURED` and `UNRESOLVED` active evidence unknown; report score ranges and coverage without scoring either as zero or as a pass. `COVERED` related unmet checks remain in the active denominator and score zero, while sharing one distinct finding; only a genuinely inapplicable `N/A` check is excluded. The accepted benchmark requires a parts surface for every interactive component, `as` on every part, and element/function render on every part; rubric 0.6.0 scores render only in the unweighted `PART-RENDER` candidate. Scores from rubric 0.4.1, 0.5.0, and 0.6.0 are not comparable. Promote candidates only through a versioned rubric update and full rerun. For PR review, grade only introduced or changed behavior. Cite each finding with its check ID and `path:line` pinned to the audited commit, and identify a reachable consumer path.

## References

| Name                                                             | Description                                                                                               |
| :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| [Principles](../../../contributor-docs/api-design-principles.md) | Checkable API principles, authority boundaries, and applicability                                         |
| [Target baseline](./references/target-baseline.md)               | Pinned ADR inventory, composition requirements, precedence, mappings, and unresolved decisions            |
| [Rubric](./references/rubric.md)                                 | Grading procedure, checks, scoring, evidence rules, and human review form                                 |
| [Scorecard template](./references/scorecard-template.md)         | Findings-first report card with one active grade, linked area scores, and a separate candidate-check panel |
| [Scorecard calculator](./references/scorecard-calculator.mjs)    | Validate structured audit data and compute section, overall, cap, and sensitivity results                 |
