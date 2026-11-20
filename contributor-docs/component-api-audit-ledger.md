# Component API audit ledger

Whole-component scorecards are pinned to the source commit they grade. This ledger records current-main coverage; PR-only reviews are not added. The rubric is proposed guidance, and scores are design-review signals rather than merge gates.

| Component   | Surface / shape                                   | Public status                                      | Audited SHA                                | Date       | Contract | ADR alignment | Overall     | BLOCKs | Scorecard                                             |
| :---------- | :------------------------------------------------ | :------------------------------------------------- | :----------------------------------------- | :--------- | :------- | :------------ | :---------- | :----: | :---------------------------------------------------- |
| Tooltip V2  | Root and `/next` exports; config / overlay        | beta (docs metadata)                               | `2128032dca65a1bd565fe382c2e91c638c6473a4` | 2026-11-20 | 5/5, met | 71.3/100      | 78.5/100, B |   0    | [Tooltip V2](./component-api-audits/tooltip-v2.md)    |
| ActionMenu  | Root export; config / collection / overlay        | beta (docs metadata)                               | `2128032dca65a1bd565fe382c2e91c638c6473a4` | 2026-11-20 | 5/5, met | 60.7/100      | 70.5/100, C |   0    | [ActionMenu](./component-api-audits/action-menu.md)   |
| Dialog      | Root export; config / overlay                     | alpha (docs metadata)                              | `2128032dca65a1bd565fe382c2e91c638c6473a4` | 2026-11-20 | 5/5, met | 79.3/100      | 84.5/100, B |   0    | [Dialog](./component-api-audits/dialog.md)            |
| SelectPanel | Root export; config / form / collection / overlay | alpha (docs metadata); stable per audit assumption | `2128032dca65a1bd565fe382c2e91c638c6473a4` | 2026-11-20 | 5/5, met | 60.7/100      | 70.5/100, C |   0    | [SelectPanel](./component-api-audits/select-panel.md) |
| Button      | Root export; leaf control with `as`               | alpha (docs metadata)                              | `2128032dca65a1bd565fe382c2e91c638c6473a4` | 2026-11-20 | 5/5, met | 100/100       | 100/100, A  |   0    | [Button](./component-api-audits/button.md)            |

## Calibration and assumptions

The earlier audit at this same SHA used qualitative labels rather than section scores. The grades preserve its direction: Tooltip and ActionMenu have constrained child-based composition; Dialog retains a strong configured contract and owned focus lifecycle; SelectPanel is a config API with no independently composed parts; Button is a well-defined leaf with a supported `as` path. Its notes that Button's merge behavior is component-specific did not become a defect because no reachable break of Button's own contract was established.

The ADR's universal wording about parts and `render` does not define whether a leaf with a fixed semantic root or an existing `as` contract needs an additional `render` API. This rubric treats `parts` and `render` as N/A when no independent region or consumer need exists, and records that scope as a maintainer decision rather than penalizing Button. Existing docs metadata labels these components `alpha` or `beta`; root exports and the user's stated stable-surface premise were used for this source audit, but published package version status was not independently queried. No migration finding was scored.

No focused runtime suites were run. Grades are source-, type-, docs-, story-, and test-file-based; cross-component runtime interoperability and visual quality remain unverified.
