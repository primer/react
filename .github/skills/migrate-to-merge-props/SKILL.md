---
name: migrate-to-merge-props
description: 'Use when: coordinating ADR-025 adoption through measured mergeProps batches in a stacked migration. Plans batches, invokes migrate-to-merge-props-batch, verifies report progress, and removes temporary migration tooling at completion.'
---

# Migrate to mergeProps

Coordinate the migration to the prop-merging architecture defined by
[`ADR-025: Prop merging conventions`](../../../contributor-docs/adrs/adr-025-prop-merging.md).

ADR-025 is currently **Proposed** with implementation **Pending**. Treat its
Decision section as the intended architecture for this migration, but do not
describe the convention as an accepted repository-wide policy until the ADR
status changes.

## Sources of truth and migration artifacts

| Artifact          | Location                                                                              | Role                                                                         | Lifetime  |
| ----------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------- |
| ADR               | `contributor-docs/adrs/adr-025-prop-merging.md`                                       | Defines prop precedence, event composition, controlled props, and exceptions | Permanent |
| Repository guide  | `contributor-docs/style.md`, "Merge shared props intentionally"                       | Shows the expected component authoring pattern                               | Permanent |
| ESLint rule       | `primer/prefer-merge-props` in `packages/eslint-config/src/rules/preferMergeProps.ts` | Detects unmerged spreads on component root elements                          | Permanent |
| Rule config       | `packages/eslint-config/src/index.ts` and `eslint.config.mjs`                         | Registers the rule disabled by default during incremental migration          | Permanent |
| Migration report  | `node script/merge-props-migration-status.mts`                                        | Measures repository-wide findings and affected files                         | Temporary |
| Coordinator skill | `.github/skills/migrate-to-merge-props/SKILL.md`                                      | Plans stack entries, delegates batches, and verifies aggregate progress      | Temporary |
| Batch agent       | `.github/agents/migrate-to-merge-props-batch.agent.md`                                | Implements and validates exactly one assigned batch                          | Temporary |

The ADR defines correctness. Repository instructions and compliant code define
implementation constraints and conventions. The ESLint rule and report are
detection and measurement tools; silencing them does not justify behavior that
conflicts with the ADR.

## Scope

- Included: component root JSX spreads in
  `packages/react/src/**/*.{ts,tsx}` reported by
  `primer/prefer-merge-props`.
- Excluded by the rule: tests, stories, files under `__tests__` or `__stories__`,
  nested JSX elements that are not component roots, and spreads already
  produced by a direct or namespaced `mergeProps` call or a `const` initialized
  by one.
- Also respect exclusions in `eslint.config.mjs`, including `.agents/**/*`,
  generated output, dependencies, and build artifacts.
- Known out-of-scope cases: ref composition, APIs requiring consumer veto
  before internal behavior, deep style merging, and attributes intentionally
  omitted or gated by the public prop type.
- Default maximum batch size: five findings.

Before changing files under `packages/react/src`, read:

- `.github/instructions/component-review.instructions.md`
- `.github/instructions/typescript-react.instructions.md`
- `.github/instructions/css.instructions.md` when changing CSS

There are no migrated production component examples yet. Until one exists,
inspect all of these initial references:

- The component example in `contributor-docs/style.md`.
- `packages/react/src/utils/mergeProps.ts`.
- `packages/react/src/utils/__tests__/mergeProps.test.ts`.

After production components adopt the convention, inspect at least one nearby
compliant component in addition to these references.

## Stack contract

For this existing stack, treat all entries through
`skils/add-merge-props-migrator` as the migration foundation. Together they add
ADR-025, the deterministic rule and report, this coordinator, and the batch
agent. Migration implementation entries must be added above that foundation.

Use this order:

1. Existing foundation entries through `skils/add-merge-props-migrator`.
2. `migrate/merge-props-batch-01` through
   `migrate/merge-props-batch-NN`, with exactly one bounded batch per entry.
3. `migrate/merge-props-cleanup` as the final entry after no in-scope findings
   remain.

Use non-interactive stack commands:

```shell
gh stack view --json
gh stack add migrate/merge-props-batch-NN
gh stack add migrate/merge-props-cleanup
gh stack submit --auto
```

The coordinator owns stack structure, branch creation, commits, aggregate
report checks, and cleanup. The batch agent owns implementation and validation
for one explicitly assigned batch. Run code-editing batch agents sequentially
because every stack entry depends on the previous entry.

## Adoption contract

The ESLint rule is the deterministic adoption mechanism. A compliant component
must also satisfy these ADR requirements that need human judgment:

- Component-authored props are the first `mergeProps` argument and
  consumer-authored props are the second.
- Event handlers preserve the required ordering and cancellation semantics.
- Class names preserve component-first ordering.
- Consumer styles retain shallow precedence.
- Refs are composed separately with `useMergedRefs` when both parties need
  them.
- Component-owned attributes are omitted or gated in public prop types when
  consumer overrides are not supported.

Do not mechanically wrap spreads in `mergeProps` when these requirements are
unresolved.

## Coordinator workflow

### 1. Establish or resume the stack

Inspect:

```shell
gh stack view --json
```

- Confirm the current branch is the top of the merge-props migration stack.
- Resume above the latest completed batch entry.
- If a lower entry changed, rebase the upstack before assigning new work.
- Do not create the cleanup entry while in-scope findings remain.

### 2. Establish the baseline

Ensure workspace dependencies are installed, then run:

```shell
node script/merge-props-migration-status.mts
```

Record:

- Total component root prop spreads to migrate.
- Total affected files.
- Findings in the requested scope.
- Findings already assigned to existing stack entries.
- File paths, component names, and line locations for remaining findings.

The report identifies findings by file and current line rather than persistent
IDs. Reconcile moved lines by file and component name when comparing results.
Do not edit or post-process report output to reduce its counts.

### 3. Plan non-overlapping batches

Group findings that:

- Share the same remediation pattern.
- Are internally related, such as one component family or directory.
- Fit within the selected maximum batch size.
- Do not assign the same file to different batches.
- Can be reviewed and validated as one coherent stack entry.

Calculate the total number of remaining batches before asking how much work to
run.

### 4. Ask how many batches to run

Use a structured user prompt with:

| Field       | Type    | Default | Choices or constraint                        |
| ----------- | ------- | ------- | -------------------------------------------- |
| Batch size  | Integer | `5`     | At least `1`                                 |
| Run mode    | Enum    | Limited | `All remaining batches` or `Limited batches` |
| Batch count | Integer | `1`     | At least `1`; ignored when run mode is all   |

Before implementation, show:

- Baseline finding and affected-file counts.
- Calculated total remaining batches.
- Selected batch size and number of batches for this pass.
- Component names, paths, and line locations assigned to each selected batch.

Limited mode is the prototype path. Stop after the requested number of entries
and leave the stack resumable.

### 5. Create and delegate each selected batch

For each selected batch, sequentially:

1. Create the next entry:

   ```shell
   gh stack add migrate/merge-props-batch-NN
   ```

2. Invoke `migrate-to-merge-props-batch` with:
   - The current stack branch.
   - Exact component names, file paths, and original line locations.
   - The selected maximum batch size.
   - The total and scoped report counts before the batch.
   - The targeted validation commands.
3. Require the agent to implement only the assigned findings and tightly
   coupled tests, stories, types, or documentation.
4. Review the returned changed files and report evidence.
5. Commit the batch on its stack entry.
6. Regenerate the report.
7. Confirm the assigned findings disappeared, no new findings appeared, and the
   total changed by the expected amount.
8. Stop before creating another entry if validation or report evidence fails.

Do not invoke multiple code-editing batch agents concurrently. Parallel
analysis is allowed only when it cannot create overlapping edits or stale
assignments.

## Batch implementation contract

Each batch agent must:

1. Read the ADR Decision, Scenarios requiring separate handling, and
   Consequences sections.
2. Inspect the rule implementation when a diagnostic's scope or accepted shape
   is unclear.
3. Inspect the reference material and a compliant production component when
   one is available.
4. Identify existing behavior, public props, event ordering, styles, class
   names, refs, and controlled attributes that must remain unchanged.
5. Decide whether component-owned attributes should be omitted or gated in the
   public type rather than silently overriding consumer values.
6. Import the internal `mergeProps` utility from the repository-relative
   location used by the component.
7. Preserve component handler ordering, cancellation semantics, class name
   order, and consumer style precedence.
8. Reuse existing prop objects, helpers, and abstractions where that keeps the
   merge explicit.
9. Add or update tests when behavior, public types, or important structure
   changes.

The batch agent must not:

- Enable or disable the rule globally as part of a component batch.
- Add blanket inline suppressions.
- Change the rule or report solely to make findings disappear.
- Rearrange report inputs, exclusions, or output to lower the count.
- Expose `mergeProps` as public `@primer/react` API.
- Fold ref composition into `mergeProps`.
- Introduce broad compatibility fallbacks that conceal an incomplete migration.
- Fix unrelated findings.
- Select another batch, create stack entries, commit, or change stack structure.

If a finding cannot be migrated without an architectural, accessibility, or
public API decision, leave it unresolved and report the blocker with evidence.

## Batch validation

Format every changed file. For example, a batch touching ActionBar would run:

```shell
npx prettier --write packages/react/src/ActionBar/ActionBar.tsx packages/react/src/ActionBar/ActionBar.test.tsx
```

Run the merge-props rule against the changed source files:

```shell
npx eslint packages/react/src/ActionBar/ActionBar.tsx --max-warnings=0 --rule 'primer/prefer-merge-props:error'
```

Run the smallest relevant component tests together:

```shell
npx vitest run packages/react/src/ActionBar/ActionBar.test.tsx
```

Run the package type-check when source or public types changed:

```shell
npm run type-check -w @primer/react
```

Run the package build when exports, build inputs, or package-wide integration
could be affected:

```shell
npm run build -w @primer/react
```

Use component-specific accessibility, visual, or Storybook checks when the
migrated behavior or rendered output requires them. Do not add new validation
tooling for this migration.

## Measure each batch

Regenerate the report:

```shell
node script/merge-props-migration-status.mts
```

Confirm:

- Every assigned finding is gone or explicitly documented as blocked.
- No new findings were introduced.
- Scoped and total counts changed by the expected amount.
- Unrelated affected files remain represented.
- The report script, rule configuration, and exclusions were not manipulated to
  produce the reduction.

Passing tests without resolving the assigned report findings is not completion.

## Pause or clean up

If limited mode was selected, stop after the requested number of entries and
report the remaining batch plan.

When the regenerated report has no in-scope findings, add
`migrate/merge-props-cleanup` as the final stack entry and remove:

- `.github/skills/migrate-to-merge-props/`
- `.github/agents/migrate-to-merge-props-batch.agent.md`
- `script/merge-props-migration-status.mts`
- `.github/workflows/migration-status.yml` if it has no remaining migrations

Keep:

- ADR-025 and the repository style guidance.
- `primer/prefer-merge-props`, its tests, and its configuration.
- Tests or type constraints needed to prevent regressions.

Run final aggregate validation after cleanup and confirm deterministic
enforcement still passes.

## Submit and report

Submit or update the stack:

```shell
gh stack submit --auto
gh stack view --json
```

Return:

| Field         | Content                                                                  |
| ------------- | ------------------------------------------------------------------------ |
| Stack entries | Foundation, batch entries created this run, and cleanup status           |
| Batches       | Requested, completed, and remaining batch counts                         |
| Resolved      | Component names, paths, and findings removed from the regenerated report |
| Remaining     | Updated total finding and affected-file counts                           |
| Validation    | Commands that failed and relevant error summaries, or `Passed`           |
| Blockers      | Findings requiring an ADR, API, accessibility, or ownership decision     |

Do not claim the migration is complete unless the regenerated report has no
in-scope findings and the cleanup entry is present.

## Example invocation

> Use the `/migrate-to-merge-props` skill. Use at most five findings per stack
> entry and run two batches as a prototype. Delegate each batch to
> `migrate-to-merge-props-batch`, regenerate the migration report after every
> entry, and stop on unexpected results.
