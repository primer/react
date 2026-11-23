# Component API audit summary

Current grades use rubric 0.5.0 and are provisional pending Layer 3 human review. The historical 0.4.1 column is retained for traceability; scores across versions are not comparable. The accepted benchmark remains ADR snapshot `2128032dca65a1bd565fe382c2e91c638c6473a4` (all ADR files present regardless of status label, with later explicit decisions taking precedence) plus composition gist 0f385c865492b0752f19931cc2ae5c7254ef0ad2, `0-2026-11-17-base-ui-foundation.md`, SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2`.

## Current component grades

| Component                                             | Shape                                                                   | Historical 0.4.1 (not comparable) | 0.5.0 render scored   | 0.5.0 render deferred | Area 3 scored / deferred | Scored gaps / current-contract defects |
| :---------------------------------------------------- | :---------------------------------------------------------------------- | :-------------------------------- | :-------------------- | :-------------------- | :----------------------: | :------------------------------------: |
| [Tooltip V2](./component-api-audits/tooltip-v2.md)    | config, interactive leaf trigger, overlay                               | 25.61–26.10 / F                   | 38.89–39.33 / 100 · F | 42.68–43.17 / 100 · F |     2.80/5 · 2.80/5      |                 6 / 0                  |
| [ActionMenu](./component-api-audits/action-menu.md)   | config, collection, overlay, trigger parts                              | 57.14–57.62 / F                   | 68.48–68.91 / 100 · D | 75.00–75.48 / 100 · C |     4.00/5 · 4.00/5      |                 5 / 0                  |
| [Dialog](./component-api-audits/dialog.md)            | config, overlay                                                         | 25.61–26.10 / F                   | 42.20–42.68 / 100 · F | 46.76–47.30 / 100 · F |     4.00/5 · 4.00/5      |                 5 / 0                  |
| [SelectPanel](./component-api-audits/select-panel.md) | config, form control, collection, overlay                               | 37.88 / F                         | 53.88 / 100 · F       | 59.48 / 100 · F       |     4.00/5 · 4.00/5      |                 5 / 0                  |
| [Button](./component-api-audits/button.md)            | interactive leaf control                                                | 69.60 / D                         | 86.99 / 100 · B       | 96.27 / 100 · A       |     5.00/5 · 5.00/5      |                 2 / 0                  |
| [ActionList](./component-api-audits/action-list.md)   | presentational, collection, leaf interactive item, form/listbox-capable | 40.00–41.18 / F                   | 49.46–50.54 / 100 · F | 54.12–55.29 / 100 · F |     2.40/5 · 2.40/5      |                 8 / 0                  |
| [Tabs](./component-api-audits/tabs.md)                | see component scorecard                                                 | 29.87–36.36 / F                   | 38.24–45.59 / 100 · F | 43.33–51.67 / 100 · F |     5.00/5 · 5.00/5      |                 7 / 1                  |
| [TreeView](./component-api-audits/tree-view.md)       | see component scorecard                                                 | 21.75 / F                         | 31.81 / 100 · F       | 35.20 / 100 · F       |     2.25/5 · 2.25/5      |                 9 / 0                  |

The render-scored grade is the default. Render-deferred is a comparison view that excludes only `PART-RENDER` and its own finding. The effective missing-render penalty changed from 28 points in rubric 0.4.1 (8 render points plus 20 merge points wrongly tied to render) to 8 points in 0.5.0. Existing prop merges are now graded from current public roots and parts. Section weights remain 20 / 20 / 25 / 15 / 20. Button's Area 3 is 25/25 = 5.00/5.

## SelectPanel decomposition

[Current baseline vs. Tyler's composable SelectPanel](./component-api-audits/select-panel-before-after.md) grades one whole after component with both configured and composable APIs. It reports scored and render-deferred scores, section deltas, and verdict changes.

## Evidence and limitations

The individual scorecards retain one row per check, finding citations pinned to each audited SHA, exact test execution evidence, and separate ADR-011 snapshot / ADR-017 Storybook Playwright evidence. `NOT MEASURED` checks remain score ranges; N/A entries are excluded with written reasons. Every component remains provisional while human review is pending. SelectPanel after #7287 has unmeasured type-check evidence and seven reproduced component-test failures; the detailed report records these separately.

## Artifacts

- [Combined area matrix](./component-api-audits/combined-report.md)
- [Core audit data](./component-api-audits/audit-data.json)
- [Candidate audit data](./component-api-audits/candidate-audit-data.json)
- [Component API compliance rubric 0.5.0](../.agents/skills/component-api-design/references/rubric.md)
- [Audit ledger pointer](./component-api-audit-ledger.md)
