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
- Default maximum batch size: five findings.
- Default run size: two sequential batches per invocation.
- Never split one source file across separate batches.

## Validated migration patterns

Use these production examples as prior art:

- `packages/react/src/VisuallyHidden/VisuallyHidden.tsx`: class-name-only
  merging.
- `packages/react/src/Token/TokenBase.tsx`: internal behavior first, optional
  consumer event handler second, and ref composition outside `mergeProps`.
- `packages/react/src/Radio/Radio.tsx`: a component-owned attribute omitted
  from the public type and applied after merged props.

Apply these rules:

1. Pass component-authored props first and consumer-authored props second.
2. Keep the component-authored `className` as a string. Let `mergeProps` use
   `clsx` to combine it with consumer class values.
3. Do not add an optional consumer handler to the second argument when it is
   absent. An explicit `undefined` entry would replace the internal handler
   instead of composing it.
4. Keep refs outside `mergeProps`.
5. Put invariant attributes after the merged spread and omit them from the
   public prop type. Use a discriminated union when ownership depends on the
   rendered element.
6. Preserve intentional consumer `undefined` precedence for ordinary props.
7. Add tests for event order, cancellation, controlled attributes, type
   exclusions, or other behavior that is not already covered.

## Stack contract

Use one linear stack:

1. `copilot/update-style-docs-prop-merging`: ADR, utility, adoption rule, and
   report foundation.
2. `migrate/merge-props-migrator`: validated examples, tooling refinements,
   coordinator skill, and batch agent.
3. `migrate/merge-props-batch-01` through
   `migrate/merge-props-batch-NN`: one bounded migration batch per entry.
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

### 2. Establish the baseline

Run:

```shell
node script/merge-props-migration-status.mts
```

Record the total finding count, affected-file count, exact paths and locations,
findings already assigned to stack entries, and blockers. Do not edit generated
output or exclusions to lower the count.

### 3. Plan non-overlapping batches

Group findings by component family and remediation pattern. Each batch must:

- Contain at most the selected finding limit.
- Own complete files rather than splitting a file between entries.
- Be reviewable as one coherent change.
- Avoid files already assigned to an existing stack entry.
- Include tightly coupled tests and changesets.

Calculate the remaining batch count using the selected limit.

### 4. Ask how much work to run

Use a structured prompt containing:

| Field       | Default | Constraint                               |
| ----------- | ------- | ---------------------------------------- |
| Batch size  | `5`     | Integer greater than or equal to `1`     |
| Run mode    | Limited | Limited batches or all remaining batches |
| Batch count | `2`     | Integer greater than or equal to `1`     |

Show the baseline, calculated remaining batches, and exact assignments before
editing. Prefer a small set of sequential batches over running the full
migration at once.

### 5. Run each selected batch

For each batch:

1. Create `migrate/merge-props-batch-NN` with `gh stack add`.
2. Invoke `migrate-to-merge-props-batch` with the branch, exact paths and
   locations, maximum size, before counts, and targeted validation commands.
3. Review the returned diff and evidence.
4. Add or update changesets for consumer-facing behavior or type changes.
5. Commit only the assigned batch.
6. Regenerate the report.
7. Confirm assigned findings disappeared, no new findings appeared, and counts
   changed by the expected amount.
8. Stop before another entry if validation or report evidence fails.

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
