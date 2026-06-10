---
applyTo: '**'
---

# Keeping changesets accurate

When you change source code in a package during a task, re-evaluate any existing
changeset files in `.changeset/` so they stay accurate and necessary.

## Re-evaluate after every change

After adding, editing, or reverting changes in this PR, check the following:

- **Does a changeset still need to exist?** If your latest changes removed the
  only consumer-facing impact (the work is now docs-only, test-only, or
  CI/infra-only), delete the now-unnecessary changeset and add the
  `skip changeset` label instead.
- **Is a changeset now required?** If you introduced new consumer-facing
  behavior that no existing changeset covers, add one.
- **Is the bump type still correct?** If the scope grew (e.g. a `patch` became a
  breaking change) or shrank, update the semver bump in the changeset frontmatter.
- **Is the description still accurate and terse?** Update the description to
  match the final change, and keep it to one or two high-level, consumer-facing
  sentences with no implementation detail.

## Guidance

For changeset format, semver bump selection, when a changeset is not needed, and
how to write terse descriptions, follow the `changesets` skill at
`.github/skills/changesets/SKILL.md`.
