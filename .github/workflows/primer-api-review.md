---
emoji: 🔎
description: |
  Runs a manual review of Primer React component APIs against the repository
  style guide and maintains one ongoing issue with unresolved findings.
on:
  workflow_dispatch:
permissions:
  contents: read
  issues: read
concurrency: primer-api-review
timeout-minutes: 60
network: defaults
tools:
  github:
    mode: gh-proxy
    toolsets: [issues]
steps:
  - name: Gather API review context
    env:
      GH_TOKEN: ${{ github.token }}
    run: |
      mkdir -p /tmp/gh-aw/data

      find packages/react/src -name '*.docs.json' -print \
        | sed 's#/[^/]*$##' \
        | sort -u \
        | jq -Rsc 'split("\n") | map(select(length > 0))' \
        > /tmp/gh-aw/data/components.json

      gh issue list \
        --repo "$GITHUB_REPOSITORY" \
        --state all \
        --search '"Primer API Review" in:title' \
        --limit 20 \
        --json number,title,state,body,comments,updatedAt,url \
        | jq '
            ([.[] | select(.title == "Primer API Review" and .state == "OPEN")]
              | sort_by(.updatedAt) | last)
            //
            ([.[] | select(.title == "Primer API Review")]
              | sort_by(.updatedAt) | last)
          ' \
        > /tmp/gh-aw/data/existing-review.json
skills:
  - .github/skills/style-guide
safe-outputs:
  mentions: false
  create-issue:
    deduplicate-by-title: true
    max: 1
  update-issue:
    required-title-prefix: 'Primer API Review'
---

# Primer API Review

Maintain one issue titled exactly **Primer API Review** containing the current
unresolved component API deviations from the Primer React style guide.

## Review process

1. Read and apply the installed `style-guide` skill, including
   `contributor-docs/style.md` and its component prop-naming guidance.
2. Read `/tmp/gh-aw/data/components.json`. Review every listed component
   directory. Cross-check the package's public exports and add any exported
   component that is missing from the inventory. Partition the complete list
   into batches of no more than 10 directories and delegate each batch to the
   `component-api-auditor` agent. Do not skip a component because it is
   deprecated, experimental, or complex.
3. Require evidence for every finding:
   - identify the component and public API
   - cite the exact style-guide principle
   - cite repository file paths and line numbers
   - describe the smallest consumer-facing API change that would resolve it
4. Read `/tmp/gh-aw/data/existing-review.json`. When a prior finding appears in
   the existing issue, inspect the issue comments for a clear, substantive
   explanation of why that API intentionally exists. If a comment is tied to
   that finding and provides a reason, omit the finding entirely. Do not treat
   an acknowledgement, question, or unrelated comment as a reason.
5. Merge duplicate findings and discard anything speculative, stylistic but not
   covered by the guide, or unsupported by source evidence.

## Issue output

Build a complete replacement body using GitHub-flavored Markdown:

- Start sections at `###`.
- Include a short summary with the review date and number of components reviewed.
- Group findings by style-guide principle.
- For each finding, include the component/API, evidence, impact, and recommended
  change.
- If there are no unresolved findings, state that the full review found no
  unexplained deviations.
- Include the workflow run as
  `[§${{ github.run_id }}](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})`.
- Do not include findings that have a documented rationale in issue comments.
- Do not append an unbounded run history or copy comment discussions into the
  issue body.

If `/tmp/gh-aw/data/existing-review.json` contains an issue:

- update that issue's body with `update_issue`
- keep the title exactly `Primer API Review`
- reopen it if it is closed

Otherwise, create one issue with `create_issue`, the exact title
`Primer API Review`, and the generated body.

Perform exactly one visible issue action per run. Never create a second review
issue when an exact-title issue exists. Use `noop` with a short reason only when
the review cannot be completed well enough to produce a trustworthy issue body.

## agent: `component-api-auditor`

---

description: Audits a bounded batch of Primer React component APIs against the style guide
model: small

---

Review only the assigned component directories. Read the installed `style-guide`
skill, `contributor-docs/style.md`, and relevant public types, exports, tests,
stories, and documentation for each component.

Return compact structured findings. Each finding must contain:

- component and public API
- violated style-guide principle
- file path and line-number evidence
- consumer impact
- smallest recommended API change

Report `none` for a component when no evidence-backed deviation exists. Do not
infer requirements that are absent from the style guide, and do not propose code
changes.
