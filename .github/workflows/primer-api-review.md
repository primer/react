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
   `contributor-docs/style.md` and its component prop-naming guidance. Build a
   checklist of every principle from both documents, using their headings as
   stable identifiers. Include rest-parameter placement, intentional shared-prop
   merging (`mergeProps`), hooks accepting instead of returning refs, hide/show
   naming and durable defaults, and mutually exclusive booleans, as well as
   callback signatures, boolean state names, and variant/size semantics. These
   examples are not the complete checklist.
2. Read `/tmp/gh-aw/data/components.json`. Review every listed component
   directory. Cross-check the package's public exports and add any exported
   component that is missing from the inventory. Include compound subcomponents,
   re-exported types, and relevant hooks, even when their implementation lives
   outside the component directory. Do not skip a component because it is
   deprecated, experimental, or complex.
3. Track a coverage matrix for every component and checklist principle. Each cell
   starts as `not-reviewed`; change it to `pass`, `finding`, or `not-applicable`
   only after inspection.
   Record inspected file paths and line ranges for passes and findings, and a
   source-backed reason for each not-applicable judgment. A component is fully
   reviewed only when no cell remains `not-reviewed`. Read the existing issue's
   remaining-coverage list and prioritize those pairs so successive runs do not
   repeat only the same callback, boolean-name, and variant/size checks. Prior
   coverage is historical context, not proof of a pass against current source.
4. Partition the inventory into batches of no more than five directories.
   Delegate one pilot batch to `component-api-auditor` with the exact component
   list, principle checklist, and coverage contract below. Validate its returned
   coverage before dispatching the remaining batches: wait for the pilot result,
   not just an agent ID or idle status. Keep delegation one level deep and at
   most two batches in flight.
   - Treat empty, malformed, errored, or findings-only responses as missing
     coverage, not as evidence of no deviations. A bare `none` is insufficient.
   - Accept only source-backed cells for assigned components and principles;
     retain valid partial results and leave omitted or unsupported cells
     `not-reviewed`.
   - Retry missing coverage once per batch with a smaller assignment (one
     component). Inspect the rest of that batch directly. After two consecutive
     unusable responses, stop dispatching sub-agents for this run and switch to
     direct review of all remaining cells. Do not repeat the same failed fan-out.
     For a model/pricing or authentication error, skip the retry and switch to
     direct inspection immediately; a smaller assignment cannot fix that error.
   - On any unresolved delegation failure, inspect the missing coverage directly
     using the same checklist and evidence requirements. Read the relevant
     source, types, render paths, and hooks for every component/principle pair.
     Grep-based sweeps are navigation aids, not proof of full coverage or of the
     absence of a deviation.
   - Continue direct inspection in bounded batches while time and context allow,
     reserving time to publish the verified results and remaining coverage. Do
     not stop solely because the entire inventory is too large for one run.
5. Require evidence for every finding:
   - identify the component and public API
   - cite the exact style-guide principle
   - cite repository file paths and line numbers
   - describe the smallest consumer-facing API change that would resolve it
6. Read `/tmp/gh-aw/data/existing-review.json`. When a prior finding appears in
   the existing issue, inspect the issue comments for a clear, substantive
   explanation of why that API intentionally exists. If a comment is tied to
   that finding and provides a reason, omit the finding entirely. Do not treat
   an acknowledgement, question, or unrelated comment as a reason.
7. Merge duplicate findings and discard anything speculative, stylistic but not
   covered by the guide, or unsupported by source evidence.
8. Reconcile the coverage matrix against the complete inventory and checklist
   before writing the issue. Publish useful, evidence-backed progress even if
   some cells remain `not-reviewed`; label the audit partial and list the
   remaining component/principle pairs. Merge verified findings with the existing
   issue, retaining prior findings not rechecked and labeling them as such. Remove
   a prior finding only when current source disproves it or an issue comment
   supplies the documented rationale described above. Never claim full coverage
   based on the number of dispatched batches.

## Issue output

Build a complete replacement body using GitHub-flavored Markdown:

- Start sections at `###`.
- Include a short summary with the review date and fully reviewed component count
  out of the total inventory. Distinguish a full audit from a partial audit.
- Include a compact coverage table by principle with counts of `pass`, `finding`,
  `not-applicable`, and `not-reviewed` components for this run. Each row must
  account for the entire inventory; retained historical findings do not count
  as reviewed cells.
  State whether sub-agents, direct inspection, or both supplied the evidence,
  including any failed batches and recovery performed.
- For a partial audit, include a remaining-coverage list grouped by principle
  with component names and the next bounded batch to inspect. Prioritize gaps
  from the previous run that remain unreviewed before newly introduced gaps.
- Group findings by style-guide principle.
- For each finding, include the component/API, evidence, impact, and recommended
  change.
- State that the full review found no unexplained deviations only when coverage
  is complete and there are no unresolved findings. When a partial audit has no
  new findings, state that no new deviations were found in the inspected subset
  without implying the unreviewed APIs passed.
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
no trustworthy progress can be published (for example, source or prior issue
data is unavailable and no safe update is possible). Incomplete coverage or
failed delegation alone is not a reason to use `noop`: verified existing
findings, new findings, or newly completed coverage can support a partial update.

## agent: `component-api-auditor`

---

description: Audits a bounded batch of Primer React component APIs against the style guide
model: claude-sonnet-5

---

Review only the assigned components and principles, following their relevant
hooks, compound subcomponents, and re-exported types outside the assigned
directories as needed. Read the installed `style-guide` skill,
`contributor-docs/style.md`, its component prop-naming guidance, and relevant
source, public types, exports, tests, stories, and documentation for each
component. Do not delegate further.

Return a compact structured report with `coverage` and `findings` sections, even
when no deviations are found. For every assigned component/principle pair,
include a coverage entry with:

- component and principle heading
- status: `pass`, `finding`, `not-applicable`, or `not-reviewed`
- inspected file paths and line ranges, plus a brief explanation supporting the
  status (including why a principle is not applicable)
- a blocker when the status is `not-reviewed`

Mark a pair `not-reviewed` when source inspection is incomplete; never infer a
pass from a search with no matches. Each finding must contain:

- component and public API
- violated style-guide principle
- file path and line-number evidence
- consumer impact
- smallest recommended API change

Return an empty `findings` list when no evidence-backed deviation exists, but
still return the coverage entries. Do not infer requirements that are absent
from the style guide, and do not propose code changes.
