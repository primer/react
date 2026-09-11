# Primer React agent guidance

## Component review

For changes to Primer React components, hooks, stories, tests, CSS, docs metadata,
exports, or changesets:

- Apply the path-specific instructions in
  `.github/instructions/generated/*.instructions.md`.
- Use the `primer-component-review` skill for the review procedure and complete
  generated policy catalog.
- Treat accepted public ADRs and maintained contributor guides as authoritative.
  Treat imported Primer architecture policy as outcome-only guidance; never
  attempt to discover, infer, or disclose its private rationale or source.
- Report only actionable mismatches introduced or expanded by the change.
- Cite the policy rule ID in each finding.
- Do not report pre-existing migration debt unless the change makes it worse.
- Advisory rules apply only while the affected API or contract is being designed
  or expanded.

When guidance conflicts, stop rather than guessing. Identify the conflicting
public rule IDs or source files so maintainers can resolve the policy.
