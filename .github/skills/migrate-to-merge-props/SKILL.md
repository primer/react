---
name: migrate-to-merge-props
description: 'Use when: coordinating ADR-025 adoption through measured mergeProps batches in a stacked migration. Plans bounded batches, invokes migrate-to-merge-props-batch, verifies report progress, and removes temporary migration tooling at completion.'
---

# Migrate to mergeProps

Coordinate adoption of
[`ADR-025: Prop merging conventions`](../../../contributor-docs/adrs/adr-025-prop-merging.md).

ADR-025 is the source of truth for correctness. The ESLint rule and migration
report identify likely work, but a finding is not complete until the component
preserves its behavior, accessibility contract, public types, refs, handlers,
class names, and styles according to the ADR.

## Sources of truth and migration artifacts

| Artifact          | Location                                                                              | Role                                      | Lifetime  |
| ----------------- | ------------------------------------------------------------------------------------- | ----------------------------------------- | --------- |
| ADR               | `contributor-docs/adrs/adr-025-prop-merging.md`                                       | Defines the target prop-merging contract  | Permanent |
| Style guidance    | `contributor-docs/style.md`, "Merge shared props intentionally"                       | Shows the component-authoring convention  | Permanent |
| Utility           | `packages/react/src/utils/mergeProps.ts`                                              | Implements shared merge behavior          | Permanent |
| Adoption rule     | `primer/prefer-merge-props` in `packages/eslint-config/src/rules/preferMergeProps.ts` | Detects unmerged component root props     | Permanent |
| Migration report  | `node script/merge-props-migration-status.mts`                                        | Measures remaining findings               | Temporary |
| Batch agent       | `.github/agents/migrate-to-merge-props-batch.agent.md`                                | Implements one assigned migration batch   | Temporary |
| Coordinator skill | `.github/skills/migrate-to-merge-props/SKILL.md`                                      | Plans, delegates, measures, and cleans up | Temporary |

## Scope

- Included: findings reported in `packages/react/src/**/*.{ts,tsx}` by
  `primer/prefer-merge-props`.
- Excluded: tests, stories, nested JSX, generated output, `.agents/**/*`, and
  pure pass-through roots that have one spread and no component-authored prop
  other than `ref` or `key`.
- Refs are always composed separately with `useMergedRefs`.
- Default batch target: roughly 500 changed lines, measured as additions plus
  deletions relative to the preceding stack entry.
- The LOC target is intentionally fuzzy. Component families are the dominant
  boundary, so a coherent batch may land below or moderately above 500 lines.
- Default run size: two sequential batches per invocation.
- Never split one source file across separate batches.

## Migration rules and prior art

Before the first implementation batch, inspect:

- The component example in `contributor-docs/style.md`.
- `packages/react/src/utils/mergeProps.ts`.
- `packages/react/src/utils/__tests__/mergeProps.test.ts`.

After implementation batches exist, inspect a relevant migrated component from
a lower stack entry as prior art. Do not add reference component migrations to
the driver entry.

Apply these rules:

1. Pass component-authored props first and consumer-authored props second.
2. Destructure the consumer `className` and combine it with component class
   names inline using `clsx`. Omit `className` from the consumer props passed to
   `mergeProps`; do not delegate class-name composition to the utility.
3. Do not add an optional consumer handler to the second argument when it is
   absent. An explicit `undefined` entry would replace the internal handler
   instead of composing it.
4. Keep refs outside `mergeProps` and place the `ref` prop before the merged
   spread.
5. Put invariant attributes after the merged spread and omit them from the
   public prop type. Only treat an attribute as invariant when the component
   already owns it; preserve existing consumer precedence for historically
   overridable attributes. Use a discriminated union when ownership depends on
   the rendered element.
6. Preserve intentional consumer `undefined` precedence for ordinary props.
7. Add tests for event order, cancellation, controlled attributes, type
   exclusions, or other behavior that is not already covered.
8. Treat component migrations as behavior-preserving refactors and do not add a
   changeset by default. Add one only when correctness requires a genuine public
   contract change, such as updating a type to communicate that an accepted prop
   was never applied.

## Stack ownership contract

Every change must live in the entry that owns its concern:

- `copilot/update-style-docs-prop-merging` owns ADR-025, `mergeProps`, the
  adoption rule, rule tests, report script, and migration-status workflow.
  Refinements to any of those artifacts must be committed to this foundation
  entry.
- `migrate/merge-props-migrator` owns only the coordinator skill and batch
  agent. It must not contain component migrations, migration changesets, or
  adoption-tool refinements.
- `migrate/merge-props-batch-NN` owns only its assigned component
  implementation, tightly coupled tests or stories, and changesets required by
  unavoidable public contract changes.
- `migrate/merge-props-cleanup` owns final temporary-artifact removal and the
  ADR status update.

If batch work exposes a problem in the adoption rule, report, utility, or
workflow:

1. Stop the batch without working around the problem.
2. Navigate to `copilot/update-style-docs-prop-merging`.
3. Commit the refinement there.
4. Rebase every upstack entry.
5. Regenerate the report before resuming the batch.

If the coordinator or agent instructions need refinement, update
`migrate/merge-props-migrator` and rebase the batch entries above it.

## Stack contract

Use one linear stack:

1. `copilot/update-style-docs-prop-merging`: ADR, utility, adoption mechanism,
   report, workflow, and all refinements to those artifacts.
2. `migrate/merge-props-migrator`: coordinator skill and batch agent only.
3. `migrate/merge-props-batch-01` through
   `migrate/merge-props-batch-NN`: one bounded component implementation batch
   per entry.
4. `migrate/merge-props-cleanup`: temporary artifact removal after the report
   reaches zero.

Use only non-interactive stack commands:

```shell
gh stack view --json
gh stack add migrate/merge-props-batch-NN
gh stack submit --auto
```

Do not create the cleanup entry while in-scope findings remain.

## Coordinator workflow

### 1. Resume the stack

Inspect:

```shell
git status --short --branch
gh stack view --json
```

Confirm the current branch is the top active entry. If a lower entry changed,
rebase the upstack before selecting findings. Do not mix unrelated worktree
changes into a migration entry.

Inspect the diff for each existing stack entry and confirm it still follows the
stack ownership contract before creating another batch.

### 2. Establish the baseline

Run:

```shell
node script/merge-props-migration-status.mts
```

Record the total finding count, affected-file count, exact paths and locations,
findings already assigned to stack entries, and blockers. Do not edit generated
output or exclusions to lower the count.

### 3. Plan non-overlapping batches

Use the `/primer-query` skill to query current `@primer/react` JSX usage for the
affected component families before assigning batches. Give a high-volume
component its own entry so review and rollout risk remain isolated. As a
default, treat 500 or more JSX uses as high volume, but adjust at an obvious
break in the current usage distribution.

Group the remaining findings by component family and remediation pattern. Pack
multiple lower-volume component families into an entry until its estimated diff
approaches the selected changed-LOC target. Prefer keeping a family together
over hitting the target exactly. Each batch must:

- Own complete files rather than splitting a file between entries.
- Keep a component family together unless the family is independently too large
  or contains distinct remediation risks.
- Be reviewable as one coherent change.
- Avoid files already assigned to an existing stack entry.
- Include tightly coupled tests and only the changesets required by genuine
  public contract changes.

Estimate the remaining batch count from the planned family groupings and changed
LOC target. Recalculate after each completed entry using its actual diff size.

### 4. Ask how much work to run

Use a structured prompt containing:

| Field              | Default | Constraint                               |
| ------------------ | ------- | ---------------------------------------- |
| Target changed LOC | `500`   | Integer greater than or equal to `1`     |
| Run mode           | Limited | Limited batches or all remaining batches |
| Batch count        | `2`     | Integer greater than or equal to `1`     |

Show the baseline, usage-based high-volume classification, estimated remaining
batches, and exact assignments before editing. Prefer a small set of sequential
batches over running the full migration at once.

### 5. Run each selected batch

For each batch:

1. Create `migrate/merge-props-batch-NN` with `gh stack add`.
2. Invoke `migrate-to-merge-props-batch` with the branch, exact paths and
   locations, target changed LOC and acceptable fuzz, before counts, and
   targeted validation commands.
3. Review the returned diff and evidence.
4. Do not add a changeset for a behavior-preserving migration. Add or update one
   only when the batch requires a genuine public behavior or type change.
5. Confirm the entry contains no adoption-tool or driver changes.
6. Commit only the assigned batch.
7. Regenerate the report.
8. Confirm assigned findings disappeared, no new findings appeared, and counts
   changed by the expected amount.
9. Measure additions plus deletions relative to the preceding entry. Accept
   moderate variance from the target when the component boundary is coherent;
   stop and re-plan if the batch is materially larger than estimated.
10. Stop before another entry if validation or report evidence fails.

Run code-editing batch agents sequentially because every branch depends on the
previous branch.

### 6. Handle blockers

Do not force a mechanical merge when a finding requires a decision about:

- Consumer veto before internal behavior.
- Whether an ARIA, semantic, or stable identifier prop is component-owned.
- A breaking public type change.
- Polymorphic attribute ownership.
- Ref composition.

Return the file, component, current behavior, ADR conflict, and smallest
decision needed.

### 7. Finish or pause

In limited mode, stop after the selected number of entries and leave the stack
resumable.

When the report reaches zero, add `migrate/merge-props-cleanup` and remove:

- `.github/skills/migrate-to-merge-props/`
- `.github/agents/migrate-to-merge-props-batch.agent.md`
- `script/merge-props-migration-status.mts`
- The `merge-props` job from `.github/workflows/migration-status.yml`

Keep ADR-025, style guidance, `mergeProps`, the ESLint rule, and regression
tests. Mark ADR-025 adopted and implemented in the cleanup entry after final
validation.

### 8. Submit and report

Run:

```shell
gh stack submit --auto
gh stack view --json
```

Return completed stack entries, requested/completed/remaining batches, resolved
paths, updated counts, validation failures, and blockers. Do not claim
completion before the report is zero and the cleanup entry exists.

## Example invocation

> Use `/migrate-to-merge-props` with at most five findings per entry. Run two
> batches, regenerate the report after each entry, and stop on unexpected
> results.
