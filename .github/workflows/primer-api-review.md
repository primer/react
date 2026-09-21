---
emoji: 🔎
description: |
  Runs a weekly review of Primer React component APIs against the repository
  style guide and maintains one ongoing issue with unresolved findings.
on:
  schedule:
    - cron: '0 9 * * 1'
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  copilot-requests: write
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
    target: '*'
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
   into non-overlapping batches of no more than 10 directories and delegate
   each batch once to the `component-api-auditor` agent, with at most three
   batches running at a time. Only the main agent may delegate; auditors must
   not launch other agents. Track completed and blocked components, and do not
   re-audit completed batches. Do not skip a component because it is deprecated,
   experimental, or complex. If an auditor fails with a model, authentication,
   or budget error, stop dispatching batches and use `noop`; do not retry with
   other models or repeat the audit in the main agent.
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
   covered by the guide, or unsupported by source evidence. Use the auditors'
   evidence for synthesis rather than repeating their investigations. Publish a
   replacement issue body only after every component has been reviewed; use
   `noop` if any component is blocked or incomplete.

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
model: claude-sonnet-5

---

Review only the assigned component directories in one pass. Do not invoke
`task`, launch another agent, or delegate through shell commands. Read the
installed `style-guide` skill and `contributor-docs/style.md` once. Start with
public types and exports, then read only the implementation, test, story, or
documentation ranges needed to verify an API finding. Do not audit unrelated
implementation or styling details, dump entire files, or narrate exploration.

Return one compact result for the batch, with at most 100 words per finding.
Each finding must contain:

- component and public API
- violated style-guide principle
- file path and line-number evidence
- consumer impact
- smallest recommended API change

Report `none` for a component when no evidence-backed deviation exists, or
`blocked` with a short reason when its review could not be completed. Do not
include passing-check tables, repeated summaries, or source excerpts. Do not
infer requirements that are absent from the style guide, and do not propose
code changes.
