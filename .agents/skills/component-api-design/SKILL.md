---
name: component-api-design
description: Use when designing a Primer React component API, reviewing an API-changing PR, or grading a component against the API benchmark. Do not use for implementation-only changes.
---

# Primer component API design

## Choose a path

- **Design:** Read the API principles. Load the modular design spectrum or slots guidance when those topics affect the decision. Do not load audit references unless benchmark compliance is requested.
- **PR review:** Pin the base and head. Load the target baseline and rubric, and report only API behavior changed by the diff.
- **Whole-component grade:** Pin the source commit. Load the target baseline, rubric, scorecard template, and calculator; return one active grade with candidate checks separate.

For any path, establish the component's public contract before judging it. Keep current-contract defects separate from accepted-target gaps, preserve existing callback signatures, and prefer additive migrations.

The rubric defines audit mechanics and scoring. The template defines the report shape. Do not reproduce either in findings or guidance.

## References

| Reference | Load when |
| :--- | :--- |
| [API principles](../../../contributor-docs/api-design-principles.md) | Designing or reviewing component composition, ownership, or compatibility. |
| [Target baseline](./references/target-baseline.md) | Evaluating an API against the pinned ADR and composition requirements. |
| [Rubric](./references/rubric.md) | Grading any component or API-changing diff. |
| [Scorecard template](./references/scorecard-template.md) | Producing a whole-component scorecard. |
| [Calculator](./references/scorecard-calculator.mjs) | Validating and scoring structured whole-component audit data. |
