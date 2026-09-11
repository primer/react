---
name: primer-component-review
description: 'Use when: reviewing Primer React component changes for repository architectural decisions and maintained component guidance. Covers component APIs, implementation structure, accessibility, stories, testing, CSS, deprecations, versioning, and changesets.'
---

# Primer component review

Use this skill for code review of Primer React components and their supporting
files.

## Sources

Read `references/generated-policy.md` and apply only the policy sets relevant to
the changed files. Path-specific generated instructions under
`.github/instructions/generated/` contain the same rules scoped for Copilot code
review.

Public ADRs and maintained contributor guides are authoritative. Rules labeled
`Primer architecture policy` contain only public-safe outcomes imported from a
private decision source. Do not seek, infer, mention, or disclose the private
source or rationale.

## Review procedure

1. Determine which public contracts and behaviors the change adds, removes, or
   modifies.
2. Select the relevant policy sets from the generated reference.
3. Compare changed code and directly related tests, stories, docs, exports, and
   changesets with enforced rules.
4. Apply advisory rules only when the change is designing or expanding the
   affected contract and the mismatch has concrete consumer impact.
5. Report only findings introduced or made worse by the change.

For each finding:

- cite the changed file and line;
- cite the policy rule ID;
- describe the concrete consumer, accessibility, maintenance, or compatibility
  impact;
- suggest the smallest design-level correction.

Do not report formatting issues, preferences without policy support, or
pre-existing migration debt. If two active rules conflict, report the policy
conflict instead of choosing one.
