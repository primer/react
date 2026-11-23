# Component API scorecard

## Table of Contents

- [Report card](#report-card), L:18
- [Area 1 Architecture and parts](#area-1-architecture-and-parts), L:34
- [Area 2 Root and part substitution](#area-2-root-and-part-substitution), L:54
- [Area 3 Prop merge behavior](#area-3-prop-merge-behavior), L:60
- [Area 4 State and shared concepts](#area-4-state-and-shared-concepts), L:67
- [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence), L:73
- [Candidate checks](#candidate-checks), L:79
- [Current-contract defects](#current-contract-defects), L:99
- [Audit details](#audit-details), L:115
- [Anchor rules](#anchor-rules), L:181

Copy this layout for each whole-component grade. For PR reviews, record only changed-surface findings and omit a whole-component grade.

## Report card

**Component:** Component name · **Active grade:** score / 100 · letter grade · **Status:** CONCLUSIVE / PROVISIONAL / UNKNOWN

**Open BLOCKs:** N · **Active findings:** N · **Candidate checks:** N (N gaps) · **Applicable active weight:** N/92 · **Active evidence coverage:** N/N

| Area                                                                    | Active score | Active gaps | Finding links | Issue links |
| :---------------------------------------------------------------------- | :----------: | :---------: | :------------ | :---------- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts)         | `5.00/5`     |             |               |             |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) | `5.00/5`     |             |               |             |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior)               | `5.00/5`     |             |               |             |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts)   | `5.00/5`     |             |               |             |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) | `5.00/5`     |             |               |             |

The active grade uses active rubric checks only. Candidate checks are visible in their own section and never create a second grade. Use score intervals when active evidence is incomplete. Count distinct open findings owned by the area; list covered checks under their shared finding. An area with no open findings says `No open gaps`. Add issue links only for issues that exist.

## Area 1 Architecture and parts

**Active score:** _ / 5 · **Open findings:** _ · **Applicable active weight:** _

Write `No open gaps` when there are no open findings owned by this area.

### F1

**Title:** Finding title

**Classification / severity / owner:** `ADR GAP` · FIX · `CHECK-ID`; covered checks: `CHECK-ID`.

**Reachable consumer:** Describe the valid consumer invocation or documented user state that reaches the gap.

**Observed gap:** Describe the target property that is absent or not met.

**Additive fix:** Preserve the existing props and callback signatures; name any versioned migration if required.

**Pinned citations:** `path:line @ full-sha`.

## Area 2 Root and part substitution

**Active score:** _ / 5 · **Open findings:** _ · **Applicable active weight:** _

Write `No open gaps` when there are no active findings owned by this area. Candidate checks and findings appear in the separate Candidate checks section.

## Area 3 Prop merge behavior

**Active score:** _ / 5 · **Open findings:** _ · **Applicable active weight:** _

Write `No open gaps` when there are no open findings owned by this area. Link covered rows to their owning active finding.
Show the earned and applicable active weight for each merge check so the area total is reproducible. `PART-RENDER` is listed as a candidate and has no active weight.

## Area 4 State and shared concepts

**Active score:** _ / 5 · **Open findings:** _ · **Applicable active weight:** _

Write `No open gaps` when there are no open findings owned by this area. Use a stable finding-ID heading for every finding.

## Area 5 Accessibility and evidence

**Active score:** _ / 5 · **Open findings:** _ · **Applicable active weight:** _

Write `No open gaps` when there are no open findings owned by this area. Keep NOT MEASURED and UNRESOLVED evidence visible as provisional score ranges.

## Candidate checks

Candidate results do not affect the active grade, its denominator, evidence coverage, section caps, or status. Show every candidate's verdict, proposed weight (if assigned), reason for remaining outside the active rubric, and evidence. Candidate GAPs link to their findings.

| Candidate | Verdict | Proposed weight | Reason / evidence | Finding |
| :--------- | :------ | :-------------: | :---------------- | :------ |
| `PART-RENDER` | GAP | 8 (unweighted) | | [Candidate F1](#candidate-f1) |

### Candidate F1

**Title:** Candidate finding title

**Reachable consumer:** Describe the consumer path.

**Observed gap:** Describe the candidate requirement that is absent.

**Proposed path:** Describe the additive fix.

**Pinned citations:** `path:line @ full-sha`.

## Current-contract defects

These findings are context separate from accepted-target gaps. `BLOCK` requires a reachable violation of the component's own contract or an objective accessibility/native-platform requirement. Write `No current-contract defects established` when empty.

### C1

**Title:** Finding title

**Severity / owner:** BLOCK · `CHECK-ID`.

**Reachable consumer and observed defect:** Describe the violated current contract.

**Compatible fix:** Preserve the public surface or name a safe migration.

**Pinned citations:** `path:line @ full-sha`.

## Audit details

Keep the evidence matrix, audit identity, human review, calibration, and test evidence after the findings. These sections may be collapsed with GitHub-supported `<details>` blocks.

### Per-check evidence matrix

Use one row per active check. `GAP` rows point to one owning target finding. Related unmet rows use `COVERED` and that finding ID; they remain in the active denominator and score zero without adding distinct findings. Only `N/A` is excluded from active weight; provide a reason. `NOT MEASURED` and `UNRESOLVED` include their reason.

| Check      | Verdict | Evidence class | Evidence at audited SHA / command result | Finding ID or reason |
| :--------- | :------ | :------------- | :--------------------------------------- | :------------------- |
| `CHECK-ID` |         |                |                                          |                      |

### Candidate check inventory

Candidate checks are visible and unweighted. They do not affect the active score or provisional status.

| Candidate | Verdict | Evidence class | Evidence / reason | Candidate finding |
| :--------- | :------ | :------------- | :---------------- | :---------------- |
| `PART-RENDER` | GAP | | | |

### Audit identity

| Field                                                                              | Value                                                                                                                                                  |
| :--------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape                                                                  |                                                                                                                                                        |
| Public entry point / docs maturity                                                 |                                                                                                                                                        |
| Repository package version                                                         |                                                                                                                                                        |
| Published-package metadata (only if relevant to a release-changing recommendation) |                                                                                                                                                        |
| Mode                                                                               | Whole component / PR review                                                                                                                            |
| Audited source SHA                                                                 |                                                                                                                                                        |
| Rubric                                                                             | Component API compliance rubric 0.6.0                                                                                                                  |
| Accepted target                                                                    | All ADR files at the audited SHA + pinned composition gist                                                                                             |
| Gist revision / file / content SHA-256                                             | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity                                                                  | Fix the _ open BLOCKs, change nothing else → projected _ / grade \_                                                                                    |
| Candidate checks                                                                   | N listed; N gaps; proposed weights excluded from the active 92-point rubric                                                                           |
| Structured audit data                                                              |                                                                                                                                                        |

### Layer 3 human review

Keep the result `PENDING HUMAN` until a human reviewer supplies the judgment and rationale. Agent judgments do not count as sign-off.

| Judgment item                                                        | Result, rationale, reachable use case, reviewer |
| :------------------------------------------------------------------- | :---------------------------------------------- |
| Meaningful part boundaries                                           |                                                 |
| Default elements and semantics                                       |                                                 |
| Context, semantic order, collection ownership, and accessible naming |                                                 |
| Shared names/defaults for shared concepts                            |                                                 |
| Unresolved maintainer decisions                                      |                                                 |
| Release-dependent migration decisions, if any                        |                                                 |

### Evidence, calibration, and decisions

| Evidence item                                                      | Path or result |
| :----------------------------------------------------------------- | :------------- |
| Public exports, types, docs, stories, and implementation read      |                |
| Focused unit/integration test execution (exact command and result) |                |
| ADR-011 snapshot-policy evidence                                   |                |
| ADR-017 Storybook Playwright interaction evidence and test result  |                |
| Type-check command and result                                      |                |
| Calculator and validator test commands and results                 |                |
| Claims not runtime-verified                                        |                |
| Published-package lookup and limitations                           |                |
| Prior audit score / new provisional score / reason for change      |                |
| Citation review result                                             |                |
| Assumptions                                                        |                |

## Anchor rules

Use headings made from letters, numbers, spaces, and the hyphens in component and finding IDs so GitHub's automatic slug is predictable. Individual scorecards use headings such as `## Area 1 Architecture and parts` and `### T-F1`; a combined report prefixes each area and finding with the component name, such as `### ActionList Area 1 Architecture and parts` and `#### ActionList A-F1`. Link each area row directly to its area heading and each finding link directly to its finding heading. Verify every generated fragment against the heading slug before publishing.
