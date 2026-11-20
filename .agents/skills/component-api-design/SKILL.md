---
name: component-api-design
description: Use when designing, reviewing, or grading a Primer React component API that changes consumer composition, configuration, state, callbacks, refs, forms, or compatibility. Do not use for implementation-only changes that leave the public API unchanged.
---

# Primer component API design

Start with the component's released contract and current Primer guarantees. Apply the proposed principles to concrete consumer needs, then assess proposed ADR alignment separately. Never label an unimplemented proposed feature a shipped defect. Preserve existing callback signatures and give recommendations an additive migration path.

For grading, use the whole-component mode in the rubric; for PR review, grade only introduced or changed behavior. Cite every finding with its check ID and `path:line` at the audited commit. A finding needs a reachable consumer path.

## References

| Name | Description |
| :--- | :--- |
| [Principles](../../../contributor-docs/api-design-principles.md) | Checkable API principles, authority boundaries, and applicability |
| [Rubric](./references/rubric.md) | Grading procedure, checks, scoring, and review form |
| [Scorecard template](./references/scorecard-template.md) | Copy for recording a component or PR grade |
