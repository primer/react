# Component API scorecard

## Table of contents

- [Report card](#report-card), L:16
- [Area 1 Architecture and parts](#area-1-architecture-and-parts), L:32
- [Area 2 Root and part substitution](#area-2-root-and-part-substitution), L:52
- [Area 3 Prop merge behavior](#area-3-prop-merge-behavior), L:58
- [Area 4 State and shared concepts](#area-4-state-and-shared-concepts), L:64
- [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence), L:70
- [Current-contract defects](#current-contract-defects), L:76
- [Audit details](#audit-details), L:92

Copy this layout for each whole-component grade. For PR reviews, record only changed-surface findings and omit a whole-component grade.

## Report card

**Component:** Component name · **Overall:** score / 100 · grade · **Status:** CONCLUSIVE / PROVISIONAL / UNKNOWN

**Open BLOCKs:** N · **Scored findings:** N · **Deferred checks/findings:** N / N · **Applicable weight:** N/100 · **Evidence coverage:** N/N

| Area | Score / 5 + signal | Open findings | Finding links | Issue links |
| :--- | :---: | :---: | :--- | :--- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts) | `5.00/5 · █████` | | | |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) | `5.00/5 · █████` | | | |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior) | `5.00/5 · █████` | | | |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts) | `5.00/5 · █████` | | | |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) | `5.00/5 · █████` | | | |

Use the score interval when a result is provisional. The bar is a visual aid; the numeric score is authoritative. Count distinct open findings owned by the area. List covered checks under their shared finding rather than counting them as extra findings. Mark deferred findings separately. An area with no open findings says `No open gaps`. Add GitHub issue links only for issues that exist; keep deferred items and untriaged findings in the scorecard without opening issues.

## Area 1 Architecture and parts

**Score:** _ / 5 · **Open findings:** _ · **Issue links:** _

Write `No open gaps` when there are no open findings owned by this area.

### F1

**Title:** Finding title

**Classification / severity / owner:** `ADR GAP` · FIX · `CHECK-ID`; covered checks: `CHECK-ID`.

**Reachable consumer:** Describe the valid consumer invocation or documented user state that reaches the gap.

**Observed gap:** Describe the target property that is absent or not met.

**Additive fix:** Preserve the existing props and callback signatures; name any versioned migration if required.

**Pinned citations:** `path:line @ full-sha`.

## Area 2 Root and part substitution

**Score:** _ / 5 · **Open findings:** _ · **Issue links:** _

Write `No open gaps` when there are no open findings owned by this area. Use a stable finding-ID heading for every finding.

## Area 3 Prop merge behavior

**Score:** _ / 5 · **Open findings:** _ · **Issue links:** _

Write `No open gaps` when there are no open findings owned by this area. Link covered rows to their owning finding, including when that finding is deferred.

## Area 4 State and shared concepts

**Score:** _ / 5 · **Open findings:** _ · **Issue links:** _

Write `No open gaps` when there are no open findings owned by this area. Use a stable finding-ID heading for every finding.

## Area 5 Accessibility and evidence

**Score:** _ / 5 · **Open findings:** _ · **Issue links:** _

Write `No open gaps` when there are no open findings owned by this area. Keep NOT MEASURED and UNRESOLVED evidence visible as provisional score ranges.

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

Use one row per check. `GAP` rows point to one owning target finding. Related unmet rows use `COVERED` and that finding ID; they remain in the denominator and score zero without adding distinct findings. Only `N/A` and rubric-authorized `DEFERRED` checks are excluded; provide a reason for either. `NOT MEASURED` and `UNRESOLVED` include their reason.

| Check | Verdict | Evidence class | Evidence at audited SHA / command result | Finding ID or reason |
| :--- | :--- | :--- | :--- | :--- |
| `CHECK-ID` | | | | |

### Audit identity

| Field | Value |
| :--- | :--- |
| Component / shape | |
| Public entry point / docs maturity | |
| Repository package version | |
| Published-package metadata (only if relevant to a release-changing recommendation) | |
| Mode | Whole component / PR review |
| Audited source SHA | |
| Rubric | Component API compliance rubric 0.4.1 |
| Accepted target | All ADR files at the audited SHA + pinned composition gist |
| Gist revision / file / content SHA-256 | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity | Fix the _ open BLOCKs, change nothing else → projected _ / grade _ |
| Structured audit data | |

### Layer 3 human review

Keep the result `PENDING HUMAN` until a human reviewer supplies the judgment and rationale. Agent judgments do not count as sign-off.

| Judgment item | Result, rationale, reachable use case, reviewer |
| :--- | :--- |
| Meaningful part boundaries | |
| Default elements and semantics | |
| Context, semantic order, collection ownership, and accessible naming | |
| Shared names/defaults for shared concepts | |
| Unresolved maintainer decisions | |
| Release-dependent migration decisions, if any | |

### Evidence, calibration, and decisions

| Evidence item | Path or result |
| :--- | :--- |
| Public exports, types, docs, stories, and implementation read | |
| Focused unit/integration test execution (exact command and result) | |
| ADR-011 snapshot-policy evidence | |
| ADR-017 Storybook Playwright interaction evidence and test result | |
| Type-check command and result | |
| Calculator and validator test commands and results | |
| Claims not runtime-verified | |
| Published-package lookup and limitations | |
| Prior audit score / new provisional score / reason for change | |
| Citation review result | |
| Assumptions | |

## Anchor rules

Use headings made from letters, numbers, spaces, and the hyphens in component and finding IDs so GitHub's automatic slug is predictable. Individual scorecards use headings such as `## Area 1 Architecture and parts` and `### T-F1`; a combined report prefixes each area and finding with the component name, such as `### ActionList Area 1 Architecture and parts` and `#### ActionList A-F1`. Link each area row directly to its area heading and each finding link directly to its finding heading. Verify every generated fragment against the heading slug before publishing.
