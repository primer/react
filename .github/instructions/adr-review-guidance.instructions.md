---
applyTo: 'contributor-docs/adrs/**/*.md,contributor-docs/CONTRIBUTING.md,contributor-docs/style.md,contributor-docs/testing.md,contributor-docs/authoring-css.md,contributor-docs/behaviors.md,contributor-docs/component-contents-api-patterns.md,contributor-docs/deprecating-components.md,contributor-docs/versioning.md'
---

# Maintaining component review guidance

When an ADR or maintained contributor guide changes an actionable decision about
component APIs, implementation, accessibility, stories, testing, CSS,
deprecations, documentation, or versioning:

1. Update, add, supersede, or remove the corresponding rule in
   `contributor-docs/review-guidance/policy.json`.
2. Keep each rule outcome-focused and suitable for public review comments. Do not
   copy private rationale or implementation history into a rule.
3. Use `enforce` only for accepted, current expectations. Use `advisory` for
   guidance that should apply only while a related contract is being designed or
   expanded.
4. Ensure each affected rule cites the exact changed source in its `source`
   field.
5. Run `npm run accept:review-guidance-sources` only after reviewing all rules
   mapped to the changed source.
6. Run `npm run build:review-guidance`.
7. Run `npm run check:review-guidance` and
   `npm run test:review-guidance`.

If the source change has no component-review impact, do not add a rule.
