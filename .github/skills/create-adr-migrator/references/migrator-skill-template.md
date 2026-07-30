# ADR Migrator Skill Template

Use this template to create `.github/skills/<migration-name>/SKILL.md`. Replace
all angle-bracket placeholders and remove instructions that do not apply.

````markdown
---
name: <migration-name>
description: 'Use when: fixing or assessing code covered by <ADR topic>. Applies <ESLint rule> in bounded batches and uses <report name> to measure remaining migration work.'
---

# <Migration title>

Migrate code to the architecture defined by [`<ADR title>`](<ADR path>).

## Sources of truth

| Source           | Location                             | Role                                                     |
| ---------------- | ------------------------------------ | -------------------------------------------------------- |
| ADR              | `<ADR path>`                         | Defines the intended architecture and rationale          |
| ESLint rule      | `<rule identifier>` in `<rule path>` | Detects known violations and provides local feedback     |
| Migration report | `<report command>`                   | Measures repository-wide progress and remaining findings |

The ADR defines correctness. The ESLint rule and report are detection and
measurement tools; passing them does not justify behavior that conflicts with
the ADR.

## Scope

- Included: <directories, file types, or finding categories>
- Excluded: <generated code, compatibility layers, or documented exceptions>
- Relevant prior art: `<path to compliant example>`, `<additional example>`

## Workflow

### 1. Establish a baseline

Run:

```shell
<baseline or report command>
```
````

Record:

- Total findings.
- Findings in the requested scope.
- Stable finding IDs, file paths, or categories used to track the batch.

Do not edit report output manually.

### 2. Select a bounded batch

Choose no more than <default batch size> findings that:

- Share the same remediation pattern.
- Are located in non-overlapping files.
- Can be validated with the same targeted commands.

If the user provides an explicit scope or finding list, use that instead.

### 3. Understand the intended architecture

Before editing:

1. Read the relevant ADR sections.
2. Inspect the ESLint diagnostic and rule implementation when its meaning is
   unclear.
3. Inspect at least one compliant implementation from the repository.
4. Identify behavior and public API that must remain unchanged.

Do not mechanically silence the diagnostic when the correct design requires
judgment.

### 4. Implement the migration

- Follow the ADR and existing compliant patterns.
- Preserve consumer-visible behavior unless the ADR explicitly changes it.
- Keep changes limited to the selected batch and tightly coupled tests or
  documentation.
- Reuse existing helpers and abstractions.
- Add or update tests when behavior, contracts, or important structure changes.

Do not:

- Disable the rule globally or add blanket inline suppressions.
- Change the rule or report solely to make findings disappear.
- Introduce broad compatibility fallbacks that conceal an incomplete migration.
- Fix unrelated findings.

If a finding cannot be migrated without an architectural or API decision, leave
it unresolved and report the blocker with evidence.

### 5. Validate the batch

Format changed files:

```shell
<format command>
```

Run the smallest relevant checks:

```shell
<targeted lint command>
<targeted test command>
<targeted type-check or build command>
```

Use existing repository commands. Do not add new validation tooling for the
migration.

### 6. Measure progress

Regenerate the report:

```shell
<report command>
```

Confirm:

- Every selected finding is gone or explicitly documented as blocked.
- No new findings were introduced.
- The total or scoped count changed by the expected amount.
- The generated report was not modified independently of its source data.

Passing tests without resolving the selected report findings is not completion.

## Delegating batches

This workflow may be delegated to sub-agents when batches do not overlap.

- Partition work by explicit files, directories, or stable finding IDs.
- Give each agent the ADR path, rule identifier, report command, validation
  commands, and assigned findings.
- Do not assign the same file to multiple agents.
- Each agent validates its own batch.
- One coordinating agent regenerates the final report and validates the
  combined result.

## Completion report

Return:

| Field      | Content                                                        |
| ---------- | -------------------------------------------------------------- |
| Batch      | Assigned finding IDs, paths, or category                       |
| Resolved   | Findings removed from the regenerated report                   |
| Remaining  | Updated scoped and total counts                                |
| Validation | Commands that failed and relevant error summaries, or `Passed` |
| Blockers   | Findings requiring an ADR, API, or ownership decision          |

Do not claim the whole migration is complete unless the regenerated report has
no in-scope findings.

## Example invocation

> Use the `/<migration-name>` skill. Resolve up to <batch size> related findings
> in `<scope>`. Regenerate the migration report and return the before and after
> counts.

```

```
