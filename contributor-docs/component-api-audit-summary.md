# Component API audit summary

Current grades use rubric 0.6.0 and remain provisional pending Layer 3 human review. Historical 0.4.1 scores are retained for traceability and are not comparable. Rubric 0.5.0 also used a render-scored/deferred pair; its scores are not comparable to the single active 0.6.0 grade.

The active rubric has 92 points, normalized to a 100-point score. `PART-RENDER` is visible as a candidate with proposed weight 8 and does not affect the active score, denominator, evidence coverage, caps, or status. The accepted benchmark remains ADR snapshot `2128032dca65a1bd565fe382c2e91c638c6473a4` plus composition gist `0f385c865492b0752f19931cc2ae5c7254ef0ad2`, `0-2026-11-17-base-ui-foundation.md`, SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2`.

## Current component grades

| Component                                             | Shape                                                              | Historical 0.4.1 | Current 0.6.0 active grade | Area 3 | Active gaps / defects | Candidate gaps |
| :---------------------------------------------------- | :----------------------------------------------------------------- | :--------------- | :------------------------- | :----: | :-------------------: | :------------: |
| [Tooltip V2](./component-api-audits/tooltip-v2.md)    | config, interactive leaf trigger, overlay                          | 25.61–26.10 / F  | 42.68–43.17 / 100 · F      | 2.80/5 |         5 / 0         |  1 unweighted  |
| [ActionMenu](./component-api-audits/action-menu.md)   | config, collection, overlay, trigger parts                         | 57.14–57.62 / F  | 75.00–75.48 / 100 · C      | 4.00/5 |         4 / 0         |  1 unweighted  |
| [Dialog](./component-api-audits/dialog.md)            | config, overlay                                                    | 25.61–26.10 / F  | 46.76–47.30 / 100 · F      | 4.00/5 |         4 / 0         |  1 unweighted  |
| [SelectPanel](./component-api-audits/select-panel.md) | config, form control, collection, overlay                          | 37.88 / F        | 59.48 / 100 · F            | 4.00/5 |         4 / 0         |  1 unweighted  |
| [Button](./component-api-audits/button.md)            | interactive leaf control                                           | 69.60 / D        | 96.27 / 100 · A            | 5.00/5 |         1 / 0         |  1 unweighted  |
| [ActionList](./component-api-audits/action-list.md)   | presentational, collection, interactive item, form/listbox-capable | 40.00–41.18 / F  | 54.12–55.29 / 100 · F      | 2.40/5 |         7 / 0         |  1 unweighted  |
| [Tabs](./component-api-audits/tabs.md)                | see component scorecard                                            | 29.87–36.36 / F  | 43.33–51.67 / 100 · F      | 5.00/5 |         6 / 1         |  1 unweighted  |
| [TreeView](./component-api-audits/tree-view.md)       | see component scorecard                                            | 21.75 / F        | 35.20 / 100 · F            | 2.25/5 |         8 / 0         |  1 unweighted  |

Button scores 96.27/A with 75/92 applicable active weight. Its Area 3 passes all merge checks: `MERGE-CONFIG` 5/5 + `MERGE-HANDLER` 8/8 + `MERGE-CLASS` 3/3 + `MERGE-STYLE-ATTR` 4/4 + `MERGE-REF` 3/3 + `MERGE-BEHAVIOR` 2/2 = 25/25 = 5.00/5.

## SelectPanel decomposition

The [current baseline vs. Tyler's composable SelectPanel](./component-api-audits/select-panel-before-after.md) reports one whole-component grade for the after surface. Architecture improves from 2.00/5 to 3.75/5 (+1.75); `PART-01` changes from GAP to PASS. The same report lists remaining contract and interaction gaps and keeps candidate render support outside the active grade.

## Evidence and limitations

Individual scorecards retain one active row per scored check, a separate candidate inventory, pinned findings, exact test execution evidence, and separate ADR-011 snapshot / ADR-017 Storybook Playwright evidence. Active `NOT MEASURED` checks remain score ranges; N/A entries are excluded with written reasons. Every component remains provisional while human review is pending. SelectPanel after #7287 has unmeasured type-check evidence and seven reproduced component-test failures.

## Artifacts

- [Combined component report](./component-api-audits/combined-report.md)
- [Core audit data](./component-api-audits/audit-data.json)
- [Candidate audit data](./component-api-audits/candidate-audit-data.json)
- [Component API compliance rubric 0.6.0](../.agents/skills/component-api-design/references/rubric.md)
- [Audit ledger pointer](./component-api-audit-ledger.md)
