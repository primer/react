# Component API audit summary

The five whole-component audits use rubric 0.3.0 against source SHA `2128032dca65a1bd565fe382c2e91c638c6473a4`. The accepted benchmark includes every ADR file at that snapshot regardless of status label, plus composition gist revision `0f385c865492b0752f19931cc2ae5c7254ef0ad2` (`0-2026-11-17-base-ui-foundation.md`, SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2`).

**Section weights:** Architecture and parts 20; root and part substitution 20; prop merge behavior 25; state and shared concepts 15; accessibility and evidence 20.

All results are provisional while Layer 3 human review is pending. Tooltip V2, ActionMenu, and Dialog also have required Storybook interaction evidence that could not be completed because Darwin-specific baseline snapshots are unavailable. Button and SelectPanel focused Playwright interaction tests passed. Each component has zero open BLOCKs and zero established current-contract defects. MIG-01 is N/A for all five because the recommendations are additive and do not depend on a released-surface change; package publication metadata was not assessed.

| Component   | Shape                                      | Provisional score / grade | BLOCKs | Target gaps / current-contract defects / raw observations | Applicable weight / check-evidence coverage |
| :---------- | :----------------------------------------- | :------------------------ | :----: | :-------------------------------------------------------: | :-----------------------------------------: |
| Tooltip V2  | config, interactive leaf trigger, overlay  | 47.73–48.64 / 100 (F)     |   0    |                        4 / 0 / 13                         |           44/100; 43/44 (97.73%)            |
| ActionMenu  | config, collection, overlay, trigger parts | 75.00–75.63 / 100 (C)     |   0    |                         3 / 0 / 9                         |           64/100; 63/64 (98.44%)            |
| Dialog      | config, overlay                            | 47.73–48.64 / 100 (F)     |   0    |                        4 / 0 / 13                         |           44/100; 43/44 (97.73%)            |
| SelectPanel | config, form control, collection, overlay  | 61.92 / 100 (D)           |   0    |                        4 / 0 / 12                         |           52/100; 52/52 (100.00%)           |
| Button      | interactive leaf control with `as`         | 82.86 / 100 (B)           |   0    |                         2 / 0 / 7                         |           63/100; 63/63 (100.00%)           |

## Calibration against the earlier draft

| Component   | Earlier draft | Corrected score / grade | Main correction                                                                                                                                            |
| :---------- | :------------ | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tooltip V2  | 78.5 / B      | 47.73–48.64 / F         | The corrected score applies the accepted parts, substitution, merge, callback, and evidence requirements; 78.5 maps to C under the rubric thresholds.      |
| ActionMenu  | 70.5 / C      | 75.00–75.63 / C         | The corrected score removes the superseded requirement and includes accepted part-substitution, shared naming, and CSS-layer targets.                      |
| Dialog      | 84.5 / B      | 47.73–48.64 / F         | The corrected score includes the required parts surface, transition callback, configured merge, CSS-layer, and evidence requirements.                      |
| SelectPanel | 70.5 / C      | 61.92 / D               | The corrected score applies the accepted parts, naming, merge, and CSS-layer targets; no stability claim is inferred from sample selection or root export. |
| Button      | 100 / A       | 82.86 / B               | The corrected score applies both render forms to the interactive leaf part and includes the CSS-layer target.                                              |

## Material target gaps

- Every interactive component needs a parts surface, and each part needs both `as` and element/function `render` forms. Tooltip V2, Dialog, and SelectPanel lack a compliant parts surface; ActionMenu has an incomplete part-substitution contract; Button lacks both render forms on its leaf part.
- Tooltip V2 and Dialog lack the target transition callback contract. ActionMenu and SelectPanel need shared open-state naming/default alignment.
- Tooltip V2, Dialog, and SelectPanel have configured merge gaps under ADR-025. All five authored component CSS modules lack the required component cascade-layer declaration.

## Evidence and limitations

- Focused component tests: `npx vitest run --project '@primer/react' packages/react/src/TooltipV2/__tests__/Tooltip.test.tsx packages/react/src/ActionMenu/ActionMenu.test.tsx packages/react/src/Dialog/Dialog.test.tsx packages/react/src/SelectPanel/SelectPanel.test.tsx packages/react/src/Button/__tests__/Button.test.tsx` — 5 files, 390 tests passed.
- Build and React type-check: `npm run build --workspace @primer/doc-gen` and `npm run type-check --workspace @primer/react` — both passed.
- Calculator tests: `node --test .agents/skills/component-api-design/references/scorecard-calculator.test.mjs` — 16/16 passed.
- Scorecard validation: `node .agents/skills/component-api-design/references/scorecard-calculator.mjs contributor-docs/component-api-audits/audit-data.json` — all five audit records validated.
- Focused Playwright interactions: `STORYBOOK_URL=http://127.0.0.1:6006 npx playwright test e2e/components/Button.test.ts e2e/components/SelectPanel.test.ts --grep 'Button link variant limits|SelectPanel Filter input anchored legacy contrast false @aat light' --workers=1` — 3 Button/SelectPanel interaction tests passed.
- Remaining Storybook evidence: `STORYBOOK_URL=http://127.0.0.1:6006 npx playwright test e2e/components/TooltipV2.test.ts e2e/components/ActionMenu.test.ts e2e/components/Dialog.test.ts e2e/components/SelectPanel.test.ts e2e/components/Button.test.ts --grep 'TooltipV2 Default light default @vrt|ActionMenu Default light default @vrt|Dialog Default light default @vrt|SelectPanel Default @vrt light|Button Default light default @vrt' --workers=1` — selected visual tests could not complete because Darwin-specific baselines are absent; interaction evidence for Tooltip V2, ActionMenu, and Dialog remains unmeasured.
- Citation verification: 53 finding citations across 20 files were checked against source SHA `2128032dca65a1bd565fe382c2e91c638c6473a4`.

## Artifacts

- Individual scorecards: [Tooltip V2](./component-api-audits/tooltip-v2.md), [ActionMenu](./component-api-audits/action-menu.md), [Dialog](./component-api-audits/dialog.md), [SelectPanel](./component-api-audits/select-panel.md), and [Button](./component-api-audits/button.md).
- [Combined scorecards report](./component-api-audits/combined-report.md), [structured audit data](./component-api-audits/audit-data.json), and [audit ledger](./component-api-audit-ledger.md).
