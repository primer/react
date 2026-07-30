# ADR Migrator Artifact Templates

Use these templates to create the temporary coordinator skill and batch
sub-agent for an ADR migration. Replace all angle-bracket placeholders and
remove instructions that do not apply.

## Coordinator skill

Create `.github/skills/<migration-name>/SKILL.md`:

````markdown
---
name: <migration-name>
description: 'Use when: coordinating adoption of <ADR topic> through measured batches in a stacked migration. Plans batches, invokes <batch-agent-name>, verifies report progress, and removes temporary migration tooling at completion.'
---

# <Migration title>

Coordinate migration to the architecture defined by
[`<ADR title>`](<ADR path>).

## Sources of truth and migration artifacts

| Artifact           | Location                                     | Role                                        | Lifetime   |
| ------------------ | -------------------------------------------- | ------------------------------------------- | ---------- |
| ADR                | `<ADR path>`                                 | Defines intended architecture and rationale | Permanent  |
| Adoption mechanism | `<rule identifier and path or soft rules>`   | Identifies or explains non-compliance       | <lifetime> |
| Migration report   | `<report command and output>`                | Measures remaining findings                 | <lifetime> |
| Batch agent        | `.github/agents/<batch-agent-name>.agent.md` | Implements one assigned batch               | Temporary  |

The ADR defines correctness. Adoption rules and the report are detection and
measurement tools; satisfying them does not justify behavior that conflicts
with the ADR.

## Scope

- Included: <directories, file types, or finding categories>
- Excluded: <generated code, compatibility layers, or documented exceptions>
- Relevant prior art: `<path to compliant example>`, `<additional example>`
- Default maximum batch size: <default batch size>

## Adoption contract

<Describe deterministic diagnostics and any soft rules the batch agent must
apply. Link to implementations instead of copying them.>

## Stack contract

Use a linear stack in this order:

1. `<foundation branch>`: ADR, adoption mechanism, migration report,
   coordinator skill, and batch agent.
2. `<batch branch prefix>-01` through `<batch branch prefix>-NN`: one bounded
   migration batch per entry.
3. `<cleanup branch>`: remove temporary migration artifacts after the report has
   no in-scope findings.

Use non-interactive `gh stack` commands:

```shell
gh stack init <foundation branch>
gh stack add <batch branch>
gh stack add <cleanup branch>
gh stack submit --auto
gh stack view --json
```

Do not add the cleanup entry while in-scope findings remain. Keep permanent
enforcement such as ESLint rules and tests.

## Coordinator workflow

### 1. Establish or resume the stack

Inspect the current branch and `gh stack view --json`.

- If the foundation entry does not exist, create it and commit all migration
  assistance artifacts there.
- If the migration is already in progress, resume from the top entry.
- Regenerate the report before planning new work.

### 2. Establish the baseline

Run:

```shell
<report command>
```

Record:

- Total and in-scope findings.
- Stable finding IDs or file paths.
- Findings already assigned to existing stack entries.
- Blocked findings.

Never edit generated report output to change the count.

### 3. Plan non-overlapping batches

Group findings that:

- Share a remediation pattern.
- Fit within the selected maximum batch size.
- Do not assign the same file to different batches.
- Can be reviewed and validated as one coherent stack entry.

Calculate the total number of remaining batches.

### 4. Ask how much work to run

Before invoking the batch agent, prompt the user for:

1. Maximum findings per batch, defaulting to <default batch size>.
2. Whether to run all remaining batches or only a specific number.

Show the baseline count, calculated total batches, selected batch count, and
finding IDs or paths that will be assigned. Running only several batches is the
prototype mode; stop after that number and leave the stack resumable.

### 5. Run each selected batch

For each batch, sequentially:

1. Create a stack entry with `gh stack add <batch branch>`.
2. Invoke `<batch-agent-name>` with:
   - The exact finding IDs or paths.
   - The maximum batch size.
   - The current stack branch.
   - Required validation commands.
   - The before count.
3. Require the agent to implement only its assigned batch.
4. Review the agent result and changed files.
5. Commit the batch on its stack entry.
6. Regenerate the report.
7. Confirm the assigned findings disappeared, no new findings appeared, and the
   count changed by the expected amount.
8. Stop before creating another entry if validation or report evidence fails.

Run code-editing batch agents sequentially because every stack entry depends on
the previous entry. Analysis may be parallelized only when it cannot create
overlapping edits or stale batch assignments.

### 6. Finish or pause

If prototype mode was selected, stop after the requested number of entries and
report the remaining batch plan.

If no in-scope findings remain:

1. Add `<cleanup branch>` as the final stack entry.
2. Remove:
   - `.github/skills/<migration-name>/`
   - `.github/agents/<batch-agent-name>.agent.md`
   - Migration-only reports and scripts.
3. Keep the ADR and enforcement artifacts needed to prevent regressions.
4. Run final aggregate validation and confirm the report remains clear.

### 7. Submit and report

Submit or update the stack with:

```shell
gh stack submit --auto
gh stack view --json
```

Return:

| Field         | Content                                                        |
| ------------- | -------------------------------------------------------------- |
| Stack entries | Foundation, batch entries created this run, and cleanup status |
| Batches       | Requested, completed, and remaining batch counts               |
| Resolved      | Finding IDs or paths removed from the regenerated report       |
| Remaining     | Updated scoped and total counts                                |
| Validation    | Failed commands and summaries, or `Passed`                     |
| Blockers      | Findings requiring an ADR, API, or ownership decision          |

Do not claim the migration is complete unless the regenerated report has no
in-scope findings and the cleanup entry is present.

## Example invocation

> Use the `/<migration-name>` skill. Use at most <batch size> findings per stack
> entry and run <all remaining batches | number of batches> in this pass.
> Delegate each batch to `<batch-agent-name>`, regenerate the report after every
> entry, and stop on unexpected results.
````

## Batch sub-agent

Create `.github/agents/<batch-agent-name>.agent.md`:

```markdown
---
name: <batch-agent-name>
description: Performs one bounded batch for <migration title> and returns validation and migration-report evidence to the coordinator.
tools:
  - read
  - search
  - edit
  - execute
skills:
  - <migration-name>
---

You implement exactly one batch assigned by the `<migration-name>` coordinator.
Use that skill for the ADR, adoption contract, report command, scope, and
validation requirements.

## Required input

Do not begin without:

- The current stack branch.
- Stable finding IDs or exact file paths.
- The maximum batch size.
- The report count before the batch.
- Targeted validation commands.

If the assignment exceeds the maximum size, overlaps unassigned files, or
requires an unresolved architecture decision, stop and return a blocker.

## Workflow

1. Read the ADR sections and inspect compliant prior art.
2. Confirm the assigned findings still exist in the report.
3. Implement only the assigned findings and tightly coupled tests or
   documentation.
4. Preserve public behavior unless the ADR explicitly requires a change.
5. Run formatting and the smallest targeted lint, test, type-check, or build
   commands supplied by the coordinator.
6. Regenerate or query the report and confirm:
   - Every assigned finding is gone or explicitly blocked.
   - No new findings were introduced.
   - The count changed by the expected amount.
7. Return the result to the coordinator. Do not select another batch, create a
   cleanup entry, or change stack structure.

Do not disable enforcement, add blanket suppressions, manipulate report output,
or fix unrelated findings.

## Result format

| Field         | Content                                               |
| ------------- | ----------------------------------------------------- |
| Branch        | Current stack branch                                  |
| Assigned      | Finding IDs or paths received                         |
| Resolved      | Findings removed from the regenerated report          |
| Files changed | Files edited for the assigned batch                   |
| Remaining     | Updated scoped and total counts                       |
| Validation    | Failed commands and summaries, or `Passed`            |
| Blockers      | Findings requiring an ADR, API, or ownership decision |
```
