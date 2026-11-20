# Component API scorecard template

## Table of contents

- [Identity and result](#identity-and-result), L:13
- [Section scores](#section-scores), L:33
- [Findings](#findings), L:43
- [Human review](#human-review), L:51
- [Evidence and calibration](#evidence-and-calibration), L:62

Copy this file for each whole-component grade. For PR reviews, use only the identity and findings sections and omit whole-component scores and ledger metadata.

## Identity and result

| Field | Value |
| :--- | :--- |
| Component / shape | |
| Package entry point / public status | |
| Mode | Whole component / PR review |
| Audited commit SHA | |
| Rubric | Component API compliance rubric 0.1 |
| Contract result | Met / defects found / not measured |
| Contract score | _ / 5 |
| ADR alignment score / grade | _ / 100 / _ |
| Overall score / grade | _ / 100 / _ |
| Open BLOCKs | _ |
| Distinct defects / raw findings | _ / _ |
| Sensitivity | Fix the _ open BLOCKs, change nothing else → projected _ / grade _ |
| Unverified | |
| N/A and limited sections | |
| Top three fixes | 1. 2. 3. |

## Section scores

| Section | Weight | Score / 5 | State (scored / limited / N/A / not measured) | Why / N/A reason |
| :--- | :---: | :---: | :--- | :--- |
| 1. Shipped contract fidelity | 25 | | | |
| 2. Abstraction and composition | 20 | | | |
| 3. Element substitution and merging | 20 | | | |
| 4. State, callbacks, and lifecycle | 20 | | | |
| 5. Semantics, documentation, and compatibility | 15 | | | |

## Findings

For each finding, include a primary check, severity, owning section, a reachable consumer path, an additive API fix, and citations to the audited SHA.

| ID | Classification (`DEFECT` / `ADR GAP`) | Severity | Check / section | Reachable consumer and observed behavior | Additive fix | Pinned evidence (`path:line` @ SHA) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| F1 | | | | | | |

## Human review

| Judgment | Result and rationale |
| :--- | :--- |
| Meaningful part boundaries | |
| Default elements and semantics | |
| Consumer flexibility and default path | |
| Context, ordering, collection, and accessible-name ownership | |
| Provider/imperative API justification | |
| Maintainer decisions | |

## Evidence and calibration

| Evidence | Path or result |
| :--- | :--- |
| Public exports, types, docs, stories, tests read | |
| Scripts/tests run (exact command and outcome) | |
| Claims not runtime-verified | |
| Baseline comparison and grade differences | |
