# Component API scorecard

## Table of contents

- [Identity and result](#identity-and-result), L:15
- [Section scores](#section-scores), L:42
- [Per-check evidence matrix](#per-check-evidence-matrix), L:52
- [Target gaps](#target-gaps), L:89
- [Current-contract defects](#current-contract-defects), L:105
- [Layer 3 human review](#layer-3-human-review), L:119
- [Evidence, calibration, and decisions](#evidence-calibration-and-decisions), L:132

Copy this template for each whole-component grade. For PR reviews, record only changed-surface findings and omit whole-component scores and ledger metadata.

## Identity and result

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
| Result status | CONCLUSIVE / PROVISIONAL / UNKNOWN |
| Accepted-target score / grade | Exact: _ / 100 / _; provisional range: _–_ / 100 / _–_ |
| BLOCK cap | _ |
| Current-contract context | No defects / list below |
| Open BLOCK count | _ |
| Target ADR gaps / current-contract defects / raw observations | _ / _ / _ |
| Deferred target checks / findings | |
| Applicable/scored check weight / check-evidence coverage | _ / 100; _ / _ applicable check weight |
| BLOCK sensitivity | Fix the _ open BLOCKs, change nothing else → projected _ / grade _ |
| Unverified / unresolved | |
| N/A / limited sections | |
| Top three fixes | 1. 2. 3. |
| Structured audit data | |

## Section scores

| Section | Weight | Applicable / earned / unknown check weight | Exact score or provisional range / 5 | Cap | State / N/A reason |
| :--- | :---: | :---: | :---: | :---: | :--- |
| 1. Architecture and parts | 20 | | | | |
| 2. Root and part substitution | 20 | | | | |
| 3. Prop merge behavior | 25 | | | | |
| 4. State and shared concepts | 15 | | | | |
| 5. Accessibility and evidence | 20 | | | | |

## Per-check evidence matrix

Use one row per check. `GAP` rows point to one owning target finding. Related unmet rows use `COVERED` and that finding ID; they remain in the denominator and score zero without adding distinct findings. Only `N/A` and rubric-authorized `DEFERRED` checks are excluded; provide a reason for either. In rubric 0.4.1, `DEFERRED` is reserved for `PART-RENDER`. `NOT MEASURED` and `UNRESOLVED` include their reason.

| Check | Verdict | Evidence class | Evidence at audited SHA / command result | Finding ID or reason |
| :--- | :--- | :--- | :--- | :--- |
| `MOD-01` | | | | |
| `CHILD-01` | | | | |
| `STRUCTURE-01` | | | | |
| `CUSTOM-ELEMENT-01` | | | | |
| `PART-01` | | | | |
| `PART-DOCS` | | | | |
| `API-01` | | | | |
| `PART-AS` | | | | |
| `PART-RENDER` | | | | |
| `MERGE-CONFIG` | | | | |
| `MERGE-HANDLER` | | | | |
| `MERGE-CLASS` | | | | |
| `MERGE-STYLE-ATTR` | | | | |
| `MERGE-REF` | | | | |
| `MERGE-BEHAVIOR` | | | | |
| `STATE-CALLBACK` | | | | |
| `NAMES-DEFAULTS` | | | | |
| `STATE-OWNER` | | | | |
| `ACCESS-01` | | | | |
| `LIVE-01` | | | | |
| `WARN-01` | | | | |
| `SELECTOR-01` | | | | |
| `STYLE-01` | | | | |
| `RESP-01` | | | | |
| `TYPE-01` | | | | |
| `EXPORT-01` | | | | |
| `TEST-01` | | | | |
| `SNAPSHOT-01` | | | | |
| `INTERACTION-01` | | | | |
| `MIG-01` | | | | |

## Target gaps

List scored target findings here. Each finding includes one primary check and owning section, a reachable consumer path, an additive fix, and citations to the full audited SHA. Retain any deferred target findings at the end of this section, label them `DEFERRED`, and state that they do not affect the score.

### F1 — Finding title

**Classification / severity / owner:** `ADR GAP` · FIX · `CHECK-ID`, section N; covered checks: `CHECK-ID`.

**Reachable consumer:** Describe the valid consumer invocation or documented user state that reaches the gap.

**Observed gap:** Describe the target property that is absent or not met.

**Additive fix:** Preserve the existing props and callback signatures; name any versioned migration if required.

**Pinned citations:** `path:line @ full-sha`.

## Current-contract defects

These findings are context separate from the accepted-target gap list. `BLOCK` requires a reachable violation of the component's own contract or an objective accessibility/native-platform requirement. Repeat this block for each defect; write “None established” when empty.

### C1 — Finding title

**Severity / owner:** BLOCK · `CHECK-ID`, section N.

**Reachable consumer and observed defect:** Describe the violated current contract.

**Compatible fix:** Preserve the public surface or name a safe migration.

**Pinned citations:** `path:line @ full-sha`.

## Layer 3 human review

Keep the result `PENDING HUMAN` until a human reviewer supplies the judgment and rationale. Agent judgments do not count as sign-off.

| Judgment item | Result, rationale, reachable use case, reviewer |
| :--- | :--- |
| Meaningful part boundaries | |
| Default elements and semantics | |
| Context, semantic order, collection ownership, and accessible naming | |
| Shared names/defaults for shared concepts | |
| Unresolved maintainer decisions | |
| Release-dependent migration decisions, if any | |

## Evidence, calibration, and decisions

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
