---
name: migrate-to-merge-props
description: 'Use when: fixing or assessing Primer React component root prop spreads covered by ADR-025. Applies primer/prefer-merge-props in bounded batches and uses the mergeProps migration report to measure remaining work.'
---

# Migrate to mergeProps

Migrate Primer React components to the prop-merging architecture defined by
[`ADR-025: Prop merging conventions`](../../../contributor-docs/adrs/adr-025-prop-merging.md).

ADR-025 is currently **Proposed** with implementation **Pending**. Treat its
Decision section as the intended architecture for this migration, but do not
describe the convention as an accepted repository-wide policy until the ADR
status changes.

## Sources of truth

| Source           | Location                                                                              | Role                                                                         |
| ---------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ADR              | `contributor-docs/adrs/adr-025-prop-merging.md`                                       | Defines prop precedence, event composition, controlled props, and exceptions |
| Repository guide | `contributor-docs/style.md`, "Merge shared props intentionally"                       | Shows the expected component authoring pattern                               |
| ESLint rule      | `primer/prefer-merge-props` in `packages/eslint-config/src/rules/preferMergeProps.ts` | Detects unmerged spreads on component root elements                          |
| Rule config      | `packages/eslint-config/src/index.ts` and `eslint.config.mjs`                         | Registers the rule disabled by default for incremental migration             |
| Migration report | `node script/merge-props-migration-status.mts`                                        | Measures repository-wide findings and affected files                         |

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

## Workflow

### 1. Establish a baseline

Ensure workspace dependencies are installed, then run:

```shell
node script/merge-props-migration-status.mts
```

Record:

- Total component root prop spreads to migrate.
- Total affected files.
- Findings in the requested scope.
- The file paths and line locations used to track the selected batch.

The report identifies findings by file and current line rather than persistent
IDs. Reconcile moved lines by file and component name when comparing results.
Do not edit or post-process report output to reduce its counts.

### 2. Select a bounded batch

Choose no more than five findings that:

- Share the same remediation pattern.
- Are internally related, such as one component family or one directory.
- Are located in non-overlapping files.
- Can be validated with the same targeted commands.

If the user provides an explicit scope or finding list, use that instead.

### 3. Understand the intended architecture

Before editing:

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

Do not mechanically wrap spreads in `mergeProps`. Component-authored props must
be the first argument and consumer-authored props the second, and refs must be
composed separately with `useMergedRefs` when both parties need them.

### 4. Implement the migration

- Follow ADR-025 and existing compliant patterns.
- Preserve consumer-visible behavior unless ADR-025 explicitly requires a
  behavior change.
- Import the internal `mergeProps` utility from the repository-relative
  location used by the component.
- Keep changes limited to the selected batch and tightly coupled tests,
  stories, types, or documentation.
- Preserve component handler ordering and cancellation semantics.
- Preserve class name order and consumer style precedence.
- Reuse existing prop objects, helpers, and abstractions where that keeps the
  merge explicit.
- Add or update tests when behavior, public types, or important structure
  changes.

Do not:

- Enable or disable the rule globally as part of a component batch.
- Add blanket inline suppressions.
- Change the rule or report solely to make findings disappear.
- Rearrange report inputs, exclusions, or output to lower the count.
- Expose `mergeProps` as public `@primer/react` API.
- Fold ref composition into `mergeProps`.
- Introduce broad compatibility fallbacks that conceal an incomplete migration.
- Fix unrelated findings.

If a finding cannot be migrated without an architectural, accessibility, or
public API decision, leave it unresolved and report the blocker with evidence.

### 5. Validate the batch

Format every changed file. For example, a batch touching ActionBar would run:

```shell
npx prettier --write packages/react/src/ActionBar/ActionBar.tsx packages/react/src/ActionBar/ActionBar.test.tsx
```

Run the merge-props rule against the changed source files. For that example:

```shell
npx eslint packages/react/src/ActionBar/ActionBar.tsx --max-warnings=0 --rule 'primer/prefer-merge-props:error'
```

Run the smallest relevant component tests together. For that example:

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

Use the repository's component-specific accessibility, visual, or Storybook
checks when the migrated behavior or rendered output requires them. Do not add
new validation tooling for this migration.

### 6. Measure progress

Regenerate the report:

```shell
node script/merge-props-migration-status.mts
```

Confirm:

- Every selected finding is gone or explicitly documented as blocked.
- No new findings were introduced.
- The scoped and total counts changed by the expected amount.
- Unrelated affected files remain represented.
- The report script, rule configuration, and exclusions were not manipulated to
  produce the reduction.

Passing tests without resolving the selected report findings is not completion.

## Delegating batches

This workflow may be delegated to sub-agents when batches do not overlap.

- Partition work by explicit files, component directories, or report findings.
- Give each agent the ADR path, rule identifier, report command, validation
  commands, and assigned findings.
- Do not assign the same file to multiple agents.
- Each agent validates its own batch and reports before and after scoped counts.
- One coordinating agent regenerates the final report, reconciles moved line
  locations and overlaps, and validates the combined result.

## Completion report

Return:

| Field      | Content                                                              |
| ---------- | -------------------------------------------------------------------- |
| Batch      | Assigned component names, file paths, and original line locations    |
| Resolved   | Findings removed from the regenerated report                         |
| Remaining  | Updated scoped and total finding and affected-file counts            |
| Validation | Commands that failed and relevant error summaries, or `Passed`       |
| Blockers   | Findings requiring an ADR, API, accessibility, or ownership decision |

Do not claim the whole migration is complete unless the regenerated report has
no in-scope findings.

## Example invocation

> Use the `/migrate-to-merge-props` skill. Resolve up to five related findings
> in `packages/react/src/Button`. Regenerate the migration report and return the
> before and after counts.
