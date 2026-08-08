# Component review guidance

The files in this directory are the structured source for generated Copilot code
review instructions.

- `policy.json` records public rules derived from accepted ADRs and maintained
  contributor documentation.
- `internal-policy.json` is the public-safe import boundary for architectural
  outcomes produced outside this repository. It must never contain private
  rationale, links, identifiers, titles, filenames, or quoted source text.

Run `npm run build:review-guidance` after changing either policy. Generated
instructions live in `.github/instructions/generated/`, and the complete
reviewer reference lives in
`.github/skills/primer-component-review/references/generated-policy.md`.

## Updating an ADR or contributor guide

When a source changes an actionable component-development decision:

1. Update, add, supersede, or remove the corresponding rule in `policy.json`.
2. Run `npm run accept:review-guidance-sources` after reviewing every rule mapped
   to the changed source.
3. Run `npm run build:review-guidance`.
4. Run `npm run check:review-guidance`.

If the source does not affect component review, no policy rule is needed.

## Public-safe imported rules

Imported rules use a strict outcome-only schema and omit all source fields. They
must contain only the outcome needed to review public code. The generator rejects
unknown fields, URLs, and known private-source markers in
`internal-policy.json`.

The sanitizer is defense in depth, not a substitute for producing the import
from explicitly public-safe fields in the private source repository.
