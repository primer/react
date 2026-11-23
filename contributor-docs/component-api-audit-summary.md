# Component API audit summary

The five whole-component audits use rubric 0.4.1 against source SHA `2128032dca65a1bd565fe382c2e91c638c6473a4`. The accepted benchmark includes every ADR file at that snapshot regardless of status label, plus composition gist revision `0f385c865492b0752f19931cc2ae5c7254ef0ad2` (`0-2026-11-17-base-ui-foundation.md`, SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2`).

Rubric 0.4.1 scores `COVERED` unmet target checks at zero while keeping their weight in the denominator. The related checks remain grouped under one distinct finding. `PART-RENDER` remains a target requirement but is temporarily `DEFERRED` from scoring; all other checks, including covered merge checks, remain scored.

**Section weights:** Architecture and parts 20; root and part substitution 20; prop merge behavior 25; state and shared concepts 15; accessibility and evidence 20.

All results are provisional while Layer 3 human review is pending. Tooltip V2, ActionMenu, and Dialog also have required Storybook interaction evidence that could not be completed because Darwin-specific baseline snapshots are unavailable. Button and SelectPanel focused Playwright interaction tests passed. Each component has zero open BLOCKs and zero established current-contract defects. MIG-01 is N/A for all five because the recommendations are additive and do not depend on a released-surface change; package publication metadata was not assessed.

| Component   | Shape                                      | Provisional score / grade | BLOCKs | Target gaps / current-contract defects / raw observations | Deferred checks / findings | Applicable weight / check-evidence coverage |
| :---------- | :----------------------------------------- | :------------------------ | :----: | :-------------------------------------------------------: | :------------------------: | :-----------------------------------------: |
| Tooltip V2  | config, interactive leaf trigger, overlay  | 25.61–26.10 / 100 (F)     |   0    |                        4 / 0 / 12                         |           1 / 0            |           82/100; 81/82 (98.78%)            |
| ActionMenu  | config, collection, overlay, trigger parts | 57.14–57.62 / 100 (F)     |   0    |                         3 / 0 / 8                         |           1 / 0            |           84/100; 83/84 (98.81%)            |
| Dialog      | config, overlay                            | 25.61–26.10 / 100 (F)     |   0    |                        4 / 0 / 12                         |           1 / 0            |           82/100; 81/82 (98.78%)            |
| SelectPanel | config, form control, collection, overlay  | 37.88 / 100 (F)           |   0    |                        4 / 0 / 11                         |           1 / 0            |           85/100; 85/85 (100.00%)           |
| Button      | interactive leaf control with `as`         | 69.60 / 100 (D)           |   0    |                         1 / 0 / 6                         |           1 / 1            |           75/100; 75/75 (100.00%)           |

## Calibration against the earlier draft

| Component   | Earlier draft | Rubric 0.4.1 score / grade | Main correction                                                                                                        |
| :---------- | :------------ | :------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| Tooltip V2  | 78.5 / B      | 25.61–26.10 / F            | Scores missing structure, state, merge, and evidence checks; defers only PART-RENDER.                                  |
| ActionMenu  | 70.5 / C      | 57.14–57.62 / F            | Removes the superseded requirement, scores incomplete part substitution and merge obligations, and defers PART-RENDER. |
| Dialog      | 84.5 / B      | 25.61–26.10 / F            | Scores parts, transition callback, configured merge, CSS-layer, and evidence requirements; defers PART-RENDER.         |
| SelectPanel | 70.5 / C      | 37.88 / F                  | Scores absent parts requirements and configured merge, naming, and CSS-layer gaps; defers PART-RENDER.                 |
| Button      | 100 / A       | 69.60 / D                  | Scores part merge obligations and CSS-layer target; defers the leaf render requirement.                                |

## Material target gaps

- Every interactive component needs a parts surface and each part needs both `as` and element/function `render` forms. `PART-RENDER` remains a target requirement but is deferred from scoring in rubric 0.4.1; the score still includes every other applicable check. Tooltip V2, Dialog, and SelectPanel lack a compliant parts surface; ActionMenu has an incomplete part-substitution contract; Button’s missing render forms remain visible as a deferred target gap.
- Tooltip V2 and Dialog lack the target transition callback contract. ActionMenu and SelectPanel need shared open-state naming/default alignment.
- Tooltip V2, Dialog, and SelectPanel have configured merge gaps under ADR-025. All five authored component CSS modules lack the required component cascade-layer declaration.

## Evidence and limitations

- Focused component tests: `npx vitest run --project '@primer/react' packages/react/src/TooltipV2/__tests__/Tooltip.test.tsx packages/react/src/ActionMenu/ActionMenu.test.tsx packages/react/src/Dialog/Dialog.test.tsx packages/react/src/SelectPanel/SelectPanel.test.tsx packages/react/src/Button/__tests__/Button.test.tsx` — 5 files, 390 tests passed.
- Build and React type-check: `npm run build --workspace @primer/doc-gen` and `npm run type-check --workspace @primer/react` — both passed.
- Calculator tests: `node --test .agents/skills/component-api-design/references/scorecard-calculator.test.mjs` — 19/19 passed.
- Scorecard validation: `node .agents/skills/component-api-design/references/scorecard-calculator.mjs contributor-docs/component-api-audits/audit-data.json` and `node .agents/skills/component-api-design/references/scorecard-calculator.mjs contributor-docs/component-api-audits/select-panel-before-after.audit-data.json` — all seven audit records validated.
- Focused Playwright interactions: `STORYBOOK_URL=http://127.0.0.1:6006 npx playwright test e2e/components/Button.test.ts e2e/components/SelectPanel.test.ts --grep 'Button link variant limits|SelectPanel Filter input anchored legacy contrast false @aat light' --workers=1` — 3 Button/SelectPanel interaction tests passed.
- Remaining Storybook evidence: `STORYBOOK_URL=http://127.0.0.1:6006 npx playwright test e2e/components/TooltipV2.test.ts e2e/components/ActionMenu.test.ts e2e/components/Dialog.test.ts e2e/components/SelectPanel.test.ts e2e/components/Button.test.ts --grep 'TooltipV2 Default light default @vrt|ActionMenu Default light default @vrt|Dialog Default light default @vrt|SelectPanel Default @vrt light|Button Default light default @vrt' --workers=1` — selected visual tests could not complete because Darwin-specific baselines are absent; interaction evidence for Tooltip V2, ActionMenu, and Dialog remains unmeasured.
- Citation verification: 53 finding citations across 20 files were checked against source SHA `2128032dca65a1bd565fe382c2e91c638c6473a4`.

## Artifacts

- Individual scorecards: [Tooltip V2](./component-api-audits/tooltip-v2.md), [ActionMenu](./component-api-audits/action-menu.md), [Dialog](./component-api-audits/dialog.md), [SelectPanel](./component-api-audits/select-panel.md), and [Button](./component-api-audits/button.md).
- [Combined scorecards report](./component-api-audits/combined-report.md), [structured audit data](./component-api-audits/audit-data.json), and [audit ledger](./component-api-audit-ledger.md).
