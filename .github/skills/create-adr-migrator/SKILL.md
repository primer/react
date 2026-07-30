---
name: create-adr-migrator
description: 'Use when: turning an ADR, an ESLint rule, and a migration report into a repeatable agent workflow. Creates a repository skill for fixing bounded batches, validating them, measuring report progress, and safely delegating non-overlapping work.'
---

# Create an ADR Migrator

Create a repository-specific skill that guides agents through an architecture
migration. The generated skill must connect three existing sources without
duplicating them:

- The **ADR** defines the intended architecture and rationale.
- The **ESLint rule** identifies violations and provides fast local feedback.
- The **migration report** measures total progress and remaining work.

The generated skill is the operational workflow that tells an agent how to use
those sources together.

## When to use this skill

Use this skill when a pull request or repository already contains:

1. An ADR or equivalent architecture guidance.
2. An ESLint rule that detects code that does not follow the ADR.
3. A command, script, or artifact that reports migration progress.

Do not use this skill to invent the architecture, detection rule, or report. If
one of those pieces is missing, identify the gap instead of hiding it in the
generated workflow.

## Gather the inputs

Inspect the current pull request and repository before writing the migrator.
Find:

| Input            | What to record                                                                 |
| ---------------- | ------------------------------------------------------------------------------ |
| ADR              | Exact path, relevant sections, and whether it is authoritative or proposed     |
| ESLint rule      | Rule identifier, implementation path, configuration, and lint command          |
| Migration report | Generation command, output location or format, and how findings are identified |
| Migration scope  | Directories, file types, exclusions, and known out-of-scope cases              |
| Validation       | Existing targeted test, type-check, build, lint, and formatting commands       |
| Prior art        | Compliant implementations that demonstrate the intended result                 |

Prefer information already present in the pull request, package scripts,
contributor documentation, and nearby code. Do not guess commands that can be
read from the repository.

If multiple ADRs, rules, or reports are plausible and choosing incorrectly
would produce a misleading skill, ask the user which set belongs to the
migration.

## Choose the generated skill

Create the skill at:

```text
.github/skills/<migration-name>/SKILL.md
```

Use a lowercase, hyphenated name that describes the destination architecture,
not a temporary pull request or report filename. For example:

- `migrate-to-behavior-hooks`
- `migrate-dialog-composition`
- `adopt-css-modules`

Use the template in
[`references/migrator-skill-template.md`](references/migrator-skill-template.md)
as a starting point. Replace every placeholder and remove sections that do not
apply.

## Requirements for the generated skill

The generated migrator must:

1. Reference the ADR, rule, and report by exact path, identifier, or command.
2. Explain the distinct role of each source.
3. Establish a baseline before editing.
4. Select a bounded, internally related batch of findings.
5. Require inspection of compliant prior art before implementation.
6. Preserve behavior unless the ADR explicitly requires a behavior change.
7. Prohibit blanket rule suppression, report manipulation, and unrelated fixes.
8. Run the smallest validation commands that cover the changed code.
9. Regenerate the report and compare before and after results.
10. Define completion using both code validation and report evidence.
11. Specify how work may be partitioned among sub-agents without overlapping
    files.
12. Give a concise result format that includes resolved findings, remaining
    findings, validation failures, and blockers.

The report is the migration acceptance criterion, not merely informational
output. Passing tests without reducing the selected report findings is not
completion.

## Keep sources of truth separate

Do not copy the full ADR or ESLint implementation into the skill. Summarize only
the information needed to execute the workflow, then link to the source.

Use this precedence when the sources appear to disagree:

1. The accepted ADR defines architectural intent.
2. Explicit repository instructions define implementation constraints.
3. Compliant code demonstrates repository conventions.
4. The ESLint rule detects known violations.
5. The migration report measures coverage.

The rule and report may be incomplete proxies for the ADR. A change must satisfy
the ADR, not merely silence the rule.

## Delegation model

The generated skill should be usable by either a main agent or a sub-agent.
When parallel work is appropriate:

- Partition by non-overlapping directories, files, or stable finding IDs.
- Give each sub-agent a bounded batch and the same completion contract.
- Do not allow two agents to edit the same file.
- Assign one coordinator to regenerate the final report, reconcile overlaps,
  and validate the aggregate result.

Do not create a custom agent profile by default. A skill carries the reusable
workflow and can be invoked by existing agents. Create
`.github/agents/<name>.agent.md` only when the user explicitly wants a selectable
specialist with dedicated tools, model guidance, or delegation behavior. Keep
that profile thin and have it invoke the generated skill rather than duplicate
the workflow.

## Validate the result

Before finishing:

1. Confirm the generated `SKILL.md` has valid `name` and `description`
   frontmatter.
2. Confirm all referenced paths and commands exist.
3. Confirm no template placeholders remain.
4. Format every created or changed Markdown file with Prettier.
5. Explain how to invoke the generated skill with one concrete prompt.
