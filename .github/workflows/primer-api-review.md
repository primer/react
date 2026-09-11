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
  footer: false
  create-issue:
    deduplicate-by-title: true
    max: 1
  update-issue:
    target: '*'
    required-title-prefix: 'Primer API Review'
  scripts:
    publish-component-findings:
      description: Publish one batch of up to 100 component finding comments and resolve their checklist links
      inputs:
        issue_number:
          type: string
          required: true
          description: Review issue number, or aw_review for the issue created in this run
        comments:
          type: string
          required: true
          description: Base64-encoded UTF-8 JSON array of objects with component (name) and body (complete finding comment), at most 100 unique components
      script: |
        const {matchesWorkflowId, generateWorkflowIdMarker} = require('./generate_footer.cjs')
        const repo = context.repo
        const resolved = resolvedTemporaryIds[item.issue_number]
        const issueNumber = Number(resolved ? resolved.number : item.issue_number)
        const staged = process.env.GH_AW_SAFE_OUTPUTS_STAGED === 'true'
        const pendingStagedIssue = staged && !resolved && item.issue_number === 'aw_review'
        if (resolved && resolved.repo !== `${repo.owner}/${repo.repo}`) {
          throw new Error('Cross-repository review targets are not allowed')
        }
        if ((!pendingStagedIssue && (!Number.isSafeInteger(issueNumber) || issueNumber <= 0)) ||
            typeof item.comments !== 'string' || item.comments.length > 500000) {
          throw new Error('Invalid component review payload')
        }
        const decoded = Buffer.from(item.comments, 'base64')
        if (decoded.toString('base64') !== item.comments) {
          throw new Error('Invalid base64 component review payload')
        }
        const entries = JSON.parse(decoded.toString('utf8'))
        if (!Array.isArray(entries) || entries.length === 0 || entries.length > 100) {
          throw new Error('Batch must contain between 1 and 100 component comments')
        }
        const components = new Set()
        const batch = entries.map(entry => {
          if (!entry || typeof entry.component !== 'string' ||
              !/^[A-Za-z][A-Za-z0-9.]*$/.test(entry.component) || components.has(entry.component) ||
              typeof entry.body !== 'string' || entry.body.length < 20 || entry.body.length > 60000) {
            throw new Error('Invalid or duplicate component review entry')
          }
          components.add(entry.component)
          return {component: entry.component, body: sanitizeContent(entry.body)}
        })
        if (staged) {
          core.info(`Would publish ${batch.length} component comments on issue ${item.issue_number}`)
          return {success: true, staged: true}
        }
        const {data: issue} = await github.rest.issues.get({...repo, issue_number: issueNumber})
        if (issue.pull_request || issue.title !== 'Primer API Review') {
          throw new Error('Target must be the Primer API Review issue')
        }
        const comments = await github.paginate(github.rest.issues.listComments, {
          ...repo, issue_number: issueNumber, per_page: 100,
        })
        let updatedBody = issue.body || ''
        for (const entry of batch) {
          const marker = `<!-- primer-api-review-component: ${entry.component} -->`
          const previous = comments.find(comment =>
            comment.user?.login === 'github-actions[bot]' &&
            matchesWorkflowId(comment.body || '', 'primer-api-review') &&
            (comment.body || '').includes(marker),
          )
          const body = `${entry.body}\n\n${marker}\n${generateWorkflowIdMarker('primer-api-review')}`
          let comment = previous
          if (!previous || previous.body !== body) {
            const result = previous
              ? await github.rest.issues.updateComment({...repo, comment_id: previous.id, body})
              : await github.rest.issues.createComment({...repo, issue_number: issueNumber, body})
            comment = result.data
          }
          updatedBody = updatedBody.replaceAll(
            `(#api-review-comment-${entry.component})`, `(${comment.html_url})`,
          )
        }
        if (updatedBody !== issue.body) {
          await github.rest.issues.update({...repo, issue_number: issueNumber, body: updatedBody})
        }
        return {success: true, url: issue.html_url}
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
6. Read `/tmp/gh-aw/data/existing-review.json` and all comments on that issue,
   paginating if needed. Findings may be in the legacy issue body or in managed
   component comments. When a prior finding appears, inspect the other issue
   comments for a clear, substantive
   explanation of why that API intentionally exists. If a comment is tied to
   that finding and provides a reason, omit the finding entirely. Do not treat
   an acknowledgement, question, unrelated comment, or the workflow's own
   finding/recommendation text as a reason.
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

Build the issue body as an overview, not a dump of findings. Use GitHub-flavored
Markdown and start sections at `###`:

- Limit the summary to at most two sentences, including the review date, fully
  reviewed component count out of the inventory, and whether the audit is partial
  or complete.
- Under `### Proposed API changes`, include an unchecked task-list item for each
  proposed API change, naming the component/API and linking to its finding
  comment. Use the finding heading as the link text when a component has multiple
  findings. Do not check a proposal merely because it was reviewed.
- Keep evidence, impact, and recommendation details in the component comments,
  not in the overview checklist.
- Put run details and the coverage table inside
  `<details><summary>Run details and coverage</summary>`. Include counts of `pass`, `finding`,
  `not-applicable`, and `not-reviewed` components for this run. Each row must
  account for the entire inventory; retained historical findings do not count
  as reviewed cells.
  State whether sub-agents, direct inspection, or both supplied the evidence,
  including any failed batches and recovery performed.
- For a partial audit, put the remaining-coverage list inside
  `<details><summary>Remaining coverage</summary>`, grouped by principle
  with component names and the next bounded batch to inspect. Prioritize gaps
  from the previous run that remain unreviewed before newly introduced gaps.
- Put retained findings not rechecked in this run behind
  `<details><summary>Past findings not rechecked</summary>`, preserving their
  comment links and unresolved status rather than silently dropping them.
- State that the full review found no unexplained deviations only when coverage
  is complete and there are no unresolved findings. When a partial audit has no
  new findings, state that no new deviations were found in the inspected subset
  without implying the unreviewed APIs passed.
- Inside the run-details disclosure, include the workflow run as
  `[§${{ github.run_id }}](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})`.
- Do not include findings that have a documented rationale in issue comments.
- Close every disclosure with `</details>` and leave blank lines around its
  Markdown content so GitHub renders tables and lists correctly.
- Do not append an unbounded run history or copy comment discussions into the
  issue body or component comments.

### Component finding comments

Maintain one managed comment per component with findings, grouping its findings
under separate `####` headings below `### ComponentName`. Every finding must
belong to that component, identify its public API and style-guide principle, and
use a table with `Evidence`, `Impact`, and `Recommendation` columns. Evidence
must link to the source file and line range and the exact style-guide principle;
recommendations must describe the proposed consumer-facing API change.

Keep active findings visible. Place retained findings not rechecked this run in
a `<details><summary>Past findings not rechecked</summary>` block within the
component comment. When source inspection resolves a previously published
finding, move a brief status and its evidence into
`<details><summary>Resolved findings</summary>` rather than presenting it as an
active recommendation. Omit findings with a documented rationale as described
above. Never modify human comments or publish comments for components with no
current or previously published findings.

Use one `publish_component_findings` call with `comments` containing a
base64-encoded UTF-8 JSON array of objects, each containing `component` and its
complete comment `body`. Use
`Buffer.from(JSON.stringify(comments), 'utf8').toString('base64')` or an equivalent
encoder; do not hand-escape Markdown. This keeps ingestion's Markdown sanitizer
from corrupting the JSON transport; each decoded comment is still sanitized
before publication. Keep the encoded batch under 500,000 characters.
The safe-output
handler maintains the component marker, reuses the managed
comment, skips unchanged content, and inserts its real URL into the checklist.
Do not supply comment IDs or invent comment URLs. For a new or updated component
comment, use `(#api-review-comment-ComponentName)` as the checklist link target.
Use actual existing comment URLs for unchanged comments. Multiple findings for
one component may link to the same comment, with distinct finding labels.

If `/tmp/gh-aw/data/existing-review.json` contains an issue:

- first queue that issue's complete replacement overview body with `update_issue`
  and `operation: replace` (never append a second checklist)
- keep the title exactly `Primer API Review`
- reopen it if it is closed

Otherwise, first queue one issue with `create_issue`, the exact title
`Primer API Review`, `temporary_id: aw_review`, and the overview body.

Then queue exactly one `publish_component_findings` call containing all new or
changed component comments (at most one entry per component and 100 per batch),
using the existing issue number as a string or `aw_review` for the newly created
issue. Include any component whose checklist links use placeholders, even if
its comment is unchanged. Skip the call when there are no comments to publish.
The ingestion layer allows only one publishing output per run: never emit one
call per component or split the array across calls. Safe outputs execute after
the agent finishes, so do not try to read back newly queued comments during this
run. Queue the overview before the batch publisher; do not queue another overview update afterward that would
overwrite resolved links. If the publication cap is reached, retain existing
links and list unpublished components in the collapsed remaining-coverage block
without emitting dangling placeholders.

Never create a second review issue when an exact-title issue exists. Use `noop`
with a short reason only when
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
