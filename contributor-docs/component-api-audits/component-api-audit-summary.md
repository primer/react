# Component API audit summary

The audits target all ADR files present at `2128032dca65a1bd565fe382c2e91c638c6473a4` regardless of status label, plus gist revision `0f385c865492b0752f19931cc2ae5c7254ef0ad2` (SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2`). Rubric version 0.3.0.

| Component   | Shape                                      | Status      | Accepted-target score / grade | BLOCKs | Target gaps / defects / raw observations | Applicable weight / evidence coverage |
| :---------- | :----------------------------------------- | :---------- | :---------------------------- | :----: | :--------------------------------------: | :------------------------------------ |
| Tooltip V2  | config, interactive leaf trigger, overlay  | PROVISIONAL | 47.73–48.64 / 100 (F)         |   0    |                4 / 0 / 13                | 44/100; 43/44 (97.73%)                |
| ActionMenu  | config, collection, overlay, trigger parts | PROVISIONAL | 75.00–75.63 / 100 (C)         |   0    |                3 / 0 / 9                 | 64/100; 63/64 (98.44%)                |
| Dialog      | config, overlay                            | PROVISIONAL | 47.73–48.64 / 100 (F)         |   0    |                4 / 0 / 13                | 44/100; 43/44 (97.73%)                |
| SelectPanel | config, form control, collection, overlay  | PROVISIONAL | 61.92 / 100 (D)               |   0    |                4 / 0 / 12                | 52/100; 52/52 (100.00%)               |
| Button      | interactive leaf control with as           | PROVISIONAL | 82.86 / 100 (B)               |   0    |                2 / 0 / 7                 | 63/100; 63/63 (100.00%)               |

All results are provisional because Layer 3 human review is pending; Tooltip V2, ActionMenu, and Dialog also lack completed required Storybook interaction evidence because Darwin screenshot baselines are absent. Button and SelectPanel focused Playwright interaction tests passed. No current-contract defects or open BLOCKs were established. SelectPanel was chosen as a sample; the audit does not claim that its maturity or stability was user-confirmed.

## Calibration against the earlier draft

| Component   | Earlier draft | Corrected score / grade | Main correction                                                                                                                                                          |
| :---------- | :------------ | :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tooltip V2  | 78.5 / B      | 47.73–48.64 / F         | The earlier draft treated the older sx clause as an unconditional @primer/react requirement and did not fully score the accepted parts, callback, and CSS-layer targets. |
| ActionMenu  | 70.5 / C      | 75.00–75.63 / C         | The regrade removes the superseded sx requirement and scores the accepted part substitution, shared naming, and CSS-layer targets.                                       |
| Dialog      | 84.5 / B      | 47.73–48.64 / F         | The accepted target requires a consumer-composable parts surface and transition callback; CSS-layer and configured merge rules are also scored.                          |
| SelectPanel | 70.5 / C      | 61.92 / D               | The regrade does not infer stability from root export or sample selection; it scores the accepted parts, naming, merge, and CSS-layer targets.                           |
| Button      | 100 / A       | 82.86 / B               | The accepted target requires both render forms on every interactive part and the component CSS cascade layer.                                                            |

## Material target gaps

- Every interactive component needs a parts surface, including interactive leaves, and each part needs both as and element/function render forms; Tooltip V2, Dialog, and SelectPanel lack a compliant parts surface; ActionMenu has an incomplete part substitution contract; Button lacks both render forms on its leaf part.
- Tooltip V2 and Dialog lack the proposed transition callback contract; ActionMenu and SelectPanel need shared open-state naming/default alignment.
- Tooltip V2, Dialog, and SelectPanel have configured merge gaps under ADR-025; all five authored component CSS modules lack the required component cascade-layer declaration.

## Evidence and limitations

- `npx vitest run --project '@primer/react' packages/react/src/TooltipV2/__tests__/Tooltip.test.tsx packages/react/src/ActionMenu/ActionMenu.test.tsx packages/react/src/Dialog/Dialog.test.tsx packages/react/src/SelectPanel/SelectPanel.test.tsx packages/react/src/Button/__tests__/Button.test.tsx` — 5 focused files, 390 tests passed.
- `npm run build --workspace @primer/doc-gen && npm run type-check --workspace @primer/react` — passed.
- `node --test .agents/skills/component-api-design/references/scorecard-calculator.test.mjs` — 16/16 passed; the calculator validator command checks all five structured records.
- `STORYBOOK_URL=http://127.0.0.1:6006 npx playwright test e2e/components/Button.test.ts e2e/components/SelectPanel.test.ts --grep 'Button link variant limits|SelectPanel Filter input anchored legacy contrast false @aat light' --workers=1` — 3 Button/SelectPanel Playwright interaction tests passed.
- `STORYBOOK_URL=http://127.0.0.1:6006 npx playwright test e2e/components/TooltipV2.test.ts e2e/components/ActionMenu.test.ts e2e/components/Dialog.test.ts e2e/components/SelectPanel.test.ts e2e/components/Button.test.ts --grep 'TooltipV2 Default light default @vrt|ActionMenu Default light default @vrt|Dialog Default light default @vrt|SelectPanel Default @vrt light|Button Default light default @vrt' --workers=1` — selected visual tests could not complete because Darwin-specific baselines are absent; interaction evidence for Tooltip V2, ActionMenu, and Dialog remains NOT MEASURED.
- 53 finding citations across 20 files were checked against source SHA `2128032dca65a1bd565fe382c2e91c638c6473a4`. All reports retain the exact citation SHA.
