---
name: create-adr-migrator
description: 'Use when: planning an ADR-driven migration from adoption tooling through stacked batch implementation and cleanup. Creates the coordinator skill, batch sub-agent, progress measurement, and stack strategy.'
---

# Create an ADR Migrator

Create the temporary repository infrastructure needed to carry an ADR-driven
migration from proposal through adoption, bounded implementation batches, and
cleanup.

## Overall strategy

Use this lifecycle:

1. Add the ADR.
2. Add a way to adopt the ADR:
   - Prefer deterministic enforcement such as an ESLint rule when violations
     can be detected mechanically.
   - Use explicit soft rules in the migrator skill when adoption requires
     architectural judgment that cannot be encoded reliably.
3. Add a migration report or inventory that establishes the baseline and
   measures remaining work.
4. Add a coordinator skill that plans the migration and delegates bounded
   batches.
5. Add a batch sub-agent that performs exactly one assigned batch.
6. Put the ADR and migration assistance infrastructure in the base entry of a
   stack.
7. Add one stack entry per migration batch.
8. Make the final stack entry remove temporary migrator skills, agents, reports,
   and scripts. Keep enforcement artifacts such as ESLint rules and tests when
   they are still needed after adoption.

The stack should tell the migration story in dependency order:

```text
trunk
└── migration-foundation
    ├── ADR
    ├── adoption rule or documented soft rules
    ├── migration report
    ├── coordinator skill
    └── batch sub-agent
    └── migration-batch-01
        └── migration-batch-02
            └── ...
                └── migration-cleanup
```

## When to use this skill

Use this skill when an architecture change should be adopted incrementally
across a repository. The ADR may already exist or may be part of the work being
planned.

Do not invent architectural intent on behalf of the user. If the ADR is missing
or unresolved, create or finish it before generating migration machinery.

## Gather the inputs

Inspect the current pull request and repository before writing the migrator.
Find:

| Input              | What to record                                                                   |
| ------------------ | -------------------------------------------------------------------------------- |
| ADR                | Exact path, relevant sections, status, and unresolved decisions                  |
| Adoption mechanism | Existing or proposed ESLint rule, test, codemod, or soft rules                   |
| Migration report   | Generation command, output format, and stable finding identifiers                |
| Migration scope    | Directories, file types, exclusions, dependencies, and ownership boundaries      |
| Batch strategy     | Default batch size and how findings can be grouped into reviewable stack entries |
| Validation         | Existing targeted test, type-check, build, lint, and formatting commands         |
| Prior art          | Compliant implementations that demonstrate the intended result                   |
| Cleanup            | Temporary artifacts to remove and permanent enforcement artifacts to retain      |

Prefer information already present in the pull request, package scripts,
contributor documentation, and nearby code. Do not guess commands that can be
read from the repository.

If multiple ADRs or adoption strategies are plausible and choosing incorrectly
would change the architecture, ask the user. Make routine implementation choices
for reporting, naming, and batching from repository conventions.

## Choose the adoption mechanism

Use deterministic enforcement when the ADR can be expressed as a reliable rule.
An ESLint rule is appropriate when syntax, imports, component usage, or another
machine-detectable pattern identifies the violation without excessive false
positives.

Use soft rules in the coordinator skill when compliance depends on context,
design judgment, or a destination pattern that cannot be detected safely. Soft
rules must be concrete enough for the batch agent to evaluate and must point to
compliant prior art.

Deterministic and soft rules may be combined. The ADR remains authoritative;
enforcement and reporting are proxies for adoption.

## Generate the migration artifacts

Create or identify all applicable artifacts:

| Artifact           | Default location                                      | Lifetime  | Purpose                                                |
| ------------------ | ----------------------------------------------------- | --------- | ------------------------------------------------------ |
| ADR                | Repository ADR location                               | Permanent | Defines intent, constraints, and rationale             |
| Adoption mechanism | Existing lint/test locations or the coordinator skill | Varies    | Detects or explains how to recognize compliance        |
| Migration report   | Repository script/report convention                   | Varies    | Produces stable findings and before/after counts       |
| Coordinator skill  | `.github/skills/<migration-name>/SKILL.md`            | Temporary | Plans batches, manages the stack, and delegates work   |
| Batch sub-agent    | `.github/agents/<migration-name>-batch.agent.md`      | Temporary | Implements and validates one explicitly assigned batch |

Use a lowercase, hyphenated migration name that describes the destination
architecture, not a temporary pull request or report filename. For example:

- `migrate-to-behavior-hooks`
- `migrate-dialog-composition`
- `adopt-css-modules`

Use
[`references/migrator-skill-template.md`](references/migrator-skill-template.md)
for both generated files. Replace every placeholder and remove sections that do
not apply.

## Requirements for the coordinator skill

The generated coordinator must:

1. Reference the ADR, adoption mechanism, report, and batch agent by exact path,
   identifier, or command.
2. Explain the distinct role and lifetime of each artifact.
3. Establish a baseline before editing.
4. Turn report findings into internally related, non-overlapping batches with a
   default maximum batch size.
5. Prompt the user for:
   - The number of findings per batch.
   - Whether to run all remaining batches or only a specific number as a
     prototype.
6. Show the total findings, planned batch count, and work selected by the user's
   answer before implementation.
7. Require inspection of the ADR and compliant prior art.
8. Create or use a linear stack whose base entry contains the ADR and migration
   assistance tools.
9. Create one stack entry per batch and invoke the batch sub-agent once for that
   entry.
10. Run batch agents sequentially in stack order when they edit code. A linear
    stack has dependent branches, so concurrent editing is unsafe unless work is
    isolated and later integrated in order.
11. Prevent overlapping files or finding IDs across batches.
12. Regenerate the report after every batch and stop when results diverge from
    the expected reduction.
13. Create a final cleanup entry after the last migration batch.
14. Give a concise result format with stack entry, resolved findings, remaining
    findings, validation failures, and blockers.

The report is the migration acceptance criterion, not merely informational
output. Passing tests without reducing the selected report findings is not
completion.

## Requirements for the batch sub-agent

The generated custom agent must:

1. Invoke the coordinator skill for the migration contract and sources of truth.
2. Accept an explicit batch containing stable finding IDs or file paths and a
   maximum size.
3. Perform only that batch and tightly coupled tests or documentation.
4. Preserve behavior unless the ADR explicitly requires a change.
5. Prohibit blanket rule suppression, report manipulation, and unrelated fixes.
6. Run the smallest validation commands covering the changed code.
7. Regenerate or query the report to prove its assigned findings were resolved
   without introducing new findings.
8. Return evidence to the coordinator and never select a second batch on its
   own.

## Keep sources of truth separate

Do not copy the full ADR or deterministic rule implementation into the skill or
agent. Summarize only the information needed to execute the workflow, then link
to the source.

Use this precedence when the sources appear to disagree:

1. The accepted ADR defines architectural intent.
2. Explicit repository instructions define implementation constraints.
3. Compliant code demonstrates repository conventions.
4. Deterministic and soft adoption rules identify known violations.
5. The migration report measures coverage.

The adoption mechanism and report may be incomplete proxies for the ADR. A
change must satisfy the ADR, not merely silence a diagnostic.

## Stack and delegation model

Use `gh stack` for the linear migration history when it is available. All
commands must be non-interactive: provide branch names to `init` and `add`, use
`gh stack submit --auto`, and inspect state with `gh stack view --json`.

The base entry must contain everything required to understand and execute the
migration. Each higher entry contains one bounded batch. The coordinator owns
branch creation, batch ordering, aggregate report checks, and cleanup. The
sub-agent owns implementation and validation for one assigned batch.

If the user chooses only several batches for prototyping, stop after that many
batch entries and report the remaining plan. Do not add the cleanup entry until
all in-scope findings are resolved. A later invocation should resume from the
top of the existing stack and regenerate the report before planning more work.

The cleanup entry must remove the coordinator skill, batch agent, migration-only
reports, and temporary scripts. Keep the ADR and any lint rules, tests, or other
tools that remain necessary for enforcement.

## Validate the result

Before finishing:

1. Confirm the coordinator skill and batch agent have valid frontmatter.
2. Confirm all referenced paths, commands, and agent names exist.
3. Confirm the report produces stable findings suitable for batching.
4. Confirm the planned base, batch, and cleanup entries form a valid dependency
   order.
5. Confirm no template placeholders remain.
6. Format every created or changed Markdown file with Prettier.
7. Explain how to invoke the coordinator with one concrete prompt that chooses
   a batch size and either all or a limited number of batches.
