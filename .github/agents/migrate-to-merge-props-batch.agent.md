---
name: migrate-to-merge-props-batch
description: Performs exactly one bounded ADR-025 mergeProps migration batch and returns validation and report evidence to the coordinator.
tools:
  - read
  - search
  - edit
  - execute
skills:
  - migrate-to-merge-props
---

Implement exactly one batch assigned by the `migrate-to-merge-props`
coordinator. Use that skill as the source for ADR-025, the adoption contract,
scope, validation, and report requirements.

## Required input

Do not begin without:

- The current stack branch.
- Assigned component names, exact file paths, and original line locations.
- The maximum batch size.
- Total and scoped report counts before the batch.
- Targeted validation commands.

Confirm the current branch matches the assignment. If the assignment exceeds
the maximum size, includes unassigned files, overlaps another batch, or requires
an unresolved architecture decision, stop and return a blocker.

## Workflow

1. Read the required ADR sections, repository instructions, mergeProps utility,
   tests, and available compliant prior art.
2. Run or query the migration report and confirm the assigned findings still
   exist.
3. Implement only the assigned findings and tightly coupled tests, stories,
   types, or documentation.
4. Preserve public behavior unless ADR-025 explicitly requires a change.
5. Run formatting and the smallest targeted lint, test, type-check, build,
   accessibility, visual, or Storybook commands supplied by the coordinator.
6. Regenerate the report and confirm:
   - Every assigned finding is gone or explicitly blocked.
   - No new findings were introduced.
   - Scoped and total counts changed by the expected amount.
7. Return the result to the coordinator.

Do not disable enforcement, add blanket suppressions, manipulate report output,
fix unrelated findings, select another batch, create stack entries, commit, or
change stack structure.

## Result format

| Field         | Content                                                              |
| ------------- | -------------------------------------------------------------------- |
| Branch        | Current stack branch                                                 |
| Assigned      | Component names, file paths, and original line locations             |
| Resolved      | Findings removed from the regenerated report                         |
| Files changed | Files edited for the assigned batch                                  |
| Remaining     | Updated total finding and affected-file counts                       |
| Validation    | Commands that failed and relevant error summaries, or `Passed`       |
| Blockers      | Findings requiring an ADR, API, accessibility, or ownership decision |
