# Component API audit ledger

Whole-component scorecards are pinned to one source SHA. The accepted-target score is the headline; current-contract defects are recorded separately. Provisional results do not act as merge gates.

| Component   | Surface / shape                            | Public status                                                    | Audited SHA                              | Result                              | BLOCKs | Target gaps / defects / raw observations | Scorecard                                             |
| :---------- | :----------------------------------------- | :--------------------------------------------------------------- | :--------------------------------------- | :---------------------------------- | :----: | :--------------------------------------- | :---------------------------------------------------- |
| Tooltip V2  | config, interactive leaf trigger, overlay  | Root export and /next entry; docs metadata beta                  | 2128032dca65a1bd565fe382c2e91c638c6473a4 | 25.96–30.67 / 100, F–F, PROVISIONAL |   0    | 4 / 0 / 13                               | [Tooltip V2](./component-api-audits/tooltip-v2.md)    |
| ActionMenu  | config, collection, overlay, trigger parts | Root export; docs metadata beta                                  | 2128032dca65a1bd565fe382c2e91c638c6473a4 | 60.39–66.67 / 100, D–D, PROVISIONAL |   0    | 3 / 0 / 9                                | [ActionMenu](./component-api-audits/action-menu.md)   |
| Dialog      | config, overlay                            | Root export; docs metadata alpha                                 | 2128032dca65a1bd565fe382c2e91c638c6473a4 | 25.96–30.67 / 100, F–F, PROVISIONAL |   0    | 4 / 0 / 13                               | [Dialog](./component-api-audits/dialog.md)            |
| SelectPanel | config, form control, collection, overlay  | Root export; docs metadata alpha; no stability claim established | 2128032dca65a1bd565fe382c2e91c638c6473a4 | 36.22–40.67 / 100, F–F, PROVISIONAL |   0    | 4 / 0 / 12                               | [SelectPanel](./component-api-audits/select-panel.md) |
| Button      | interactive leaf control with as           | Root export; docs metadata alpha                                 | 2128032dca65a1bd565fe382c2e91c638c6473a4 | 72.59–80.00 / 100, C–B, PROVISIONAL |   0    | 2 / 0 / 7                                | [Button](./component-api-audits/button.md)            |

## Recording and calibration

The scorecards live in contributor-docs/component-api-audits/; the structured per-check inputs live in contributor-docs/component-api-audits/audit-data.json; this ledger is updated by one aggregator after validation. Parallel component graders emit scorecards and data to the caller rather than writing this shared ledger.

Every result uses ADR files present at 2128032dca65a1bd565fe382c2e91c638c6473a4 regardless of status labels, plus revision 0f385c865492b0752f19931cc2ae5c7254ef0ad2; file 0-2026-11-17-base-ui-foundation.md; SHA-256 30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2. The five earlier draft scores were Tooltip V2 78.5/B (correct threshold: C), ActionMenu 70.5/C, Dialog 84.5/B, SelectPanel 70.5/C, and Button 100/A. Those draft scores used the prior accepted-target interpretation; the current values are provisional ranges because the target now requires every interactive part's as/render forms and unresolved evidence remains unknown.

SelectPanel was chosen as a sample; the audit does not claim that the user confirmed it stable. Its docs metadata at the audited SHA is alpha. No current-contract defects or open BLOCKs were established in this set.
