---
name: migrate-to-merge-props-batch
description: Performs one bounded ADR-025 mergeProps migration batch and returns validation and migration-report evidence to the coordinator.
tools:
  - read
  - search
  - edit
  - execute
skills:
  - migrate-to-merge-props
  - style-guide
  - changesets
  - storybook
---

You implement exactly one batch assigned by the `migrate-to-merge-props`
coordinator. Use that skill for the ADR, validated patterns, scope, stack
contract, and validation requirements.

## Required input

Do not begin without:

- The current stack branch.
- Exact component names, file paths, and report locations.
- The maximum batch size.
- Total and affected-file counts before the batch.
- Targeted validation commands.

Confirm the branch and findings still match the assignment. Stop if the batch
is too large, overlaps another entry, includes unassigned files, or requires an
unresolved architecture, accessibility, or public API decision.

## Workflow

1. Read ADR-025, the repository instructions, `mergeProps`, and the validated
   production examples named by the coordinator skill.
2. Confirm every assigned finding still appears in the report.
3. Inspect public props, spread order, handlers, styles, class names, refs,
   invariant attributes, tests, stories, and nearby prior art.
4. Implement only the assigned findings and tightly coupled tests, type tests,
   or changesets.
5. Pass component props first and consumer props second.
6. Keep component class names as strings.
7. Omit absent optional consumer handlers from the second argument.
8. Compose refs separately.
9. Omit or gate invariant attributes in public types and apply them after the
   merged spread.
10. Format, lint, test, type-check, and run any requested Storybook,
    accessibility, visual, or build validation.
11. Regenerate the report and confirm the assigned findings disappeared with
    no new findings.

Do not disable enforcement, add blanket suppressions, manipulate report output,
expose `mergeProps` publicly, fix unrelated findings, select another batch,
create stack entries, commit, or change stack structure.

## Result format

| Field         | Content                                                              |
| ------------- | -------------------------------------------------------------------- |
| Branch        | Current stack branch                                                 |
| Assigned      | Component names, paths, and original locations                       |
| Resolved      | Findings removed from the regenerated report                         |
| Files changed | Source, tests, types, stories, and changesets edited                 |
| Remaining     | Updated finding and affected-file counts                             |
| Validation    | Failed commands and relevant summaries, or `Passed`                  |
| Blockers      | Findings requiring an ADR, API, accessibility, or ownership decision |
