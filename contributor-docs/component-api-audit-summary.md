# Component API audit summary

**Audited source:** 2128032dca65a1bd565fe382c2e91c638c6473a4 from the main snapshot. **Accepted target:** every ADR file present at that SHA regardless of status label, plus the pinned composition gist (revision 0f385c865492b0752f19931cc2ae5c7254ef0ad2; file 0-2026-11-17-base-ui-foundation.md; SHA-256 30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2).

**Rubric weights:** Architecture and parts 20; root and part substitution 20; prop merge behavior 25; state and shared concepts 15; accessibility and evidence 20.

**Status:** All five results are provisional. The exact published package surface is unavailable, so MIG-01 remains unknown; Layer 3 human review is pending for every component. Unknown evidence is retained in score intervals and receives neither zero nor pass credit.

| Component   | Shapes                                     | Public entry / docs maturity                                     | Provisional score / grade range | Check-evidence coverage | BLOCKs | Distinct target gaps / current defects / raw observations | Limited sections |
| :---------- | :----------------------------------------- | :--------------------------------------------------------------- | :-----------------------------: | :---------------------: | :----: | :-------------------------------------------------------: | :--------------- |
| Tooltip V2  | config, interactive leaf trigger, overlay  | Root export and /next entry; docs metadata beta                  |     25.96–30.67 / 100 (F–F)     |         91.84%          |   0    |                        4 / 0 / 13                         | —                |
| ActionMenu  | config, collection, overlay, trigger parts | Root export; docs metadata beta                                  |     60.39–66.67 / 100 (D–D)     |          94.2%          |   0    |                         3 / 0 / 9                         | 3                |
| Dialog      | config, overlay                            | Root export; docs metadata alpha                                 |     25.96–30.67 / 100 (F–F)     |         91.84%          |   0    |                        4 / 0 / 13                         | —                |
| SelectPanel | config, form control, collection, overlay  | Root export; docs metadata alpha; no stability claim established |     36.22–40.67 / 100 (F–F)     |         92.98%          |   0    |                        4 / 0 / 12                         | —                |
| Button      | interactive leaf control with as           | Root export; docs metadata alpha                                 |     72.59–80.00 / 100 (C–B)     |         94.12%          |   0    |                         2 / 0 / 7                         | 3, 4             |

## Most consequential findings

- All five components lack the ADR-003 sx root prop; fixes target the appropriate rendered surface while preserving existing props and refs.
- Tooltip V2, Dialog, and SelectPanel lack a consumer-composable parts surface; ActionMenu exposes parts with gaps in as and render; Button's interactive leaf lacks both render forms.
- Tooltip V2 and Dialog own or report visibility transitions without the required new object callback. ActionMenu and SelectPanel also expose different open control/default models for a shared concept.
- Tooltip V2, Dialog, and SelectPanel have configured merge behavior that differs from ADR-025. New part APIs should follow the gist's consumer-first order; changes to legacy configured surfaces need an additive or versioned migration.

No current-contract defects were established and there are no open BLOCKs. These grades measure accepted-target gaps, with the current API contract retained as separate context.

## Calibration against the earlier audit

The earlier audit baseline was qualitative and covered the former API-contract interpretation. The prior draft's numeric scorecards did not consistently apply the clarified accepted target or evidence rules. The revised runs add the explicit every-part substitution contract, new callback requirements, ADR-025 configured merge checks, complete per-check matrices, and unknown score intervals.

| Component   | Prior draft                                                                                        | Revised result                       | Calibration note                                                                                                                                                                                            |
| :---------- | :------------------------------------------------------------------------------------------------- | :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tooltip V2  | 78.5/100 labeled B in the prior draft; the corrected threshold maps 78.5 to C.                     | 25.96–30.67 / 100 (F–F), PROVISIONAL | The accepted target now requires a parts surface, part substitution, a configured merge policy, and a transition callback. The prior audit did not score these requirements as mandatory target properties. |
| ActionMenu  | 70.5/100, C in the prior draft.                                                                    | 60.39–66.67 / 100 (D–D), PROVISIONAL | The accepted target now requires as and element/function render across the part surface and aligned shared open-state defaults. Existing part docs and boolean callback remain intact.                      |
| Dialog      | 84.5/100, B in the prior draft.                                                                    | 25.96–30.67 / 100 (F–F), PROVISIONAL | The accepted target now requires a direct parts surface and a new transition callback; existing custom renderers and onClose(gesture) remain valid contract evidence.                                       |
| SelectPanel | 70.5/100, C in the prior draft; that draft treated the sample selection as a stability assumption. | 36.22–40.67 / 100 (F–F), PROVISIONAL | The revised audit uses the audited docs metadata (alpha) and the strict accepted parts/render contract. Root export and sample selection do not establish a stable released surface.                        |
| Button      | 100/100, A in the prior draft.                                                                     | 72.59–80.00 / 100 (C–B), PROVISIONAL | The accepted target requires a render-element and render-function API on the interactive leaf. ADR-003 also requires sx; the earlier draft marked render N/A and therefore overstated compliance.           |

Tooltip's prior 78.5 score was labeled B; the rubric threshold makes 78.5 a C. The revised result remains a range, with grade F–F. SelectPanel was selected as a sample; no user confirmation of stability exists. Its audited docs metadata says alpha, and this report makes no stable-release claim.

## Unresolved decisions

Exact part names and default elements; behavior when as and render are supplied together; the skip-method name; overlay-layer coordination; new callback naming and state ownership; and exact released-surface migration compatibility. These remain pending human/maintainer decisions.

## Validation evidence

| Check                    | Result                                                                                                                                                                                                                                                                                                                        |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused component tests  | `npx vitest run --project '@primer/react' packages/react/src/TooltipV2/__tests__/Tooltip.test.tsx packages/react/src/ActionMenu/ActionMenu.test.tsx packages/react/src/Dialog/Dialog.test.tsx packages/react/src/SelectPanel/SelectPanel.test.tsx packages/react/src/Button/__tests__/Button.test.tsx` — 5 files, 390 passed. |
| React type-check         | npm run build --workspace @primer/doc-gen and npm run type-check --workspace @primer/react — both passed.                                                                                                                                                                                                                     |
| Calculator tests         | node --test .agents/skills/component-api-design/references/scorecard-calculator.test.mjs — 11 passed.                                                                                                                                                                                                                         |
| Scorecard validation     | node .agents/skills/component-api-design/references/scorecard-calculator.mjs contributor-docs/component-api-audits/audit-data.json — all five audit records validated.                                                                                                                                                        |
| Published package lookup | npm view @primer/react@38.46.0 version — E404; released-surface checks remain unknown.                                                                                                                                                                                                                                        |

## Artifacts

- Individual scorecards: [Tooltip V2](./component-api-audits/tooltip-v2.md), [ActionMenu](./component-api-audits/action-menu.md), [Dialog](./component-api-audits/dialog.md), [SelectPanel](./component-api-audits/select-panel.md), and [Button](./component-api-audits/button.md)
- Structured data: [audit-data.json](./component-api-audits/audit-data.json)
- Full combined report: [combined-report.md](./component-api-audits/combined-report.md)
