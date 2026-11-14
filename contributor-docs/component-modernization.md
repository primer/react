# Component modernization experiment

This document records the ongoing work to bring GitHub App's newer visual treatment into Primer React. It describes this experiment, not a blanket requirement to migrate every component.

## Goal

Match the reference's typography, spacing, sizing, alignment, and interaction styling while keeping Primer's public APIs and behavior. Port the visual treatment, not the component implementation or its entire stylesheet.

Use the reference Storybook and app source as evidence. Do not claim that the running app was verified unless it was actually checked.

## Implementation boundaries

- Prefer the smallest complete change. Reuse existing Primer styles and override only the measured differences; do not duplicate styles that already work.
- Keep modernization styles component-scoped. Shared wrappers must not accidentally modernize unrelated consumers. For example, `TextInputWrapper` also serves Select, Textarea, and TextInputWithTokens.
- Put styles with the component that owns the surface: ActionMenu owns its trigger, while ActionList owns menu-row styling. Apply contextual changes only in the intended context.
- Preserve APIs, refs, keyboard behavior, controlled state, and accessibility. New behavior such as tokenization is a separate scope decision.
- Keep Primer's icons and theme tokens unless a change is explicitly agreed. Document intentional differences, including accessible opaque placeholders rather than faint reference placeholders and Primer's own high-contrast palettes.

## Required comparison artifact

Produce a standalone page using **live Storybook iframes**, not recreated controls or screenshots.

1. Put **GitHub App on the left** and **Primer React on the right**, with equal iframe viewport widths.
2. **Stack every example pair vertically** so they can be reviewed together. Do not use an example picker.
3. Match example content: labels, placeholders, initial values, descriptions, item order, sizes, and visual roles. Match image fixtures where relevant; different icon artwork is an intentional exception.
4. Keep one **theme picker controlling all examples**, plus a reset action that restores every example's initial state. Both sides remain interactive.
5. Label intentional differences on the page. On narrow screens, preserve equal-width side-by-side previews with horizontal scrolling rather than shrinking one side differently.

Keep comparison HTML separate from package runtime code and make it available as a review artifact. The page should link to its underlying stories.

Do not invent reference counterparts for unsupported patterns. The current TextInput page compares default, sizes with leading visuals, search with a clear action, and password inputs. Tokenized input is outside the current modernization scope; Primer-only success/loading states are checked separately.

## Working and verification loop

1. Read the reference implementation and stories alongside Primer's existing styles and shared consumers.
2. Align the stories' content before judging the visual result. Keep the same starting coordinates and control widths so layout differences are meaningful.
3. Measure the result rather than relying only on appearance: font size/weight/line-height, dimensions, padding, gaps, icon bounds, borders, colors, and focus outlines.
4. Check supported sizes and themes, LTR/RTL, narrow layouts, validation, disabled/read-only states, and interaction behavior. For custom search clear actions, check that there is no duplicate native clear control, clearing restores focus, and empty-state visibility preserves layout. Normal-size placeholder text must meet the 4.5:1 contrast requirement.
5. Before committing, format changed files and run the smallest relevant build, type-check, lint, component, and accessibility checks. Build before tests because package builds clear outputs that other workspaces import. Explain unrelated baseline failures; do not silently treat them as passing. Use the repository's Linux snapshot workflow for canonical visual baselines.

Keep the changeset accurate when runtime or public API changes are introduced or removed. See [testing](./testing.md), [CSS authoring](./authoring-css.md), and [versioning](./versioning.md) for the repository's standard guidance.

## Existing implementation examples

| Surface                      | Modernization styles                                                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Button                       | [ButtonBase.modernize.module.css](../packages/react/src/Button/ButtonBase.modernize.module.css)                 |
| ActionMenu trigger           | [ActionMenu.modernize.module.css](../packages/react/src/ActionMenu/ActionMenu.modernize.module.css)             |
| ActionMenu's ActionList rows | [ActionList.modernize.module.css](../packages/react/src/ActionList/ActionList.modernize.module.css)             |
| Plain TextInput              | [TextInput.modernize.module.css](../packages/react/src/TextInput/TextInput.modernize.module.css)                |
| Dialog                       | [Dialog.modernize.module.css](../packages/react/src/Dialog/Dialog.modernize.module.css)                         |
| Main-export SelectPanel      | [SelectPanel.modernize.module.css](../packages/react/src/SelectPanel/SelectPanel.modernize.module.css)          |
| ToggleSwitch                 | [ToggleSwitch.modernize.module.css](../packages/react/src/ToggleSwitch/ToggleSwitch.modernize.module.css)       |
| Experimental KeybindingHint  | [KeybindingHint.modernize.module.css](../packages/react/src/KeybindingHint/KeybindingHint.modernize.module.css) |

## Current batch boundaries

Modernize the main-export SelectPanel, not deprecated SelectPanel2, and the current Dialog, not DialogV1. Use the existing experimental KeybindingHint for Kbd/KbdChord comparisons; do not introduce replacement keyboard exports.

The approved visual additions are compact ToggleSwitch sizing, small Dialog density, and a visually hidden SelectPanel title that retains its accessible name. Keep existing defaults and state contracts. SelectPanel reuses ActionList's modernized surface and row styles; contextual keycap colors remain owned by Button and ActionList.

Primer deliberately retains visible switch labels and indicators, its modal radio/Cancel/Save semantics, spinner-only loading presentation, and its existing modifier ordering. App switch fixtures enable its differentiate-without-color preference; App modal fixtures use its public footer to match Cancel/Save content and commit behavior. Grouped virtualization and the App's global keyboard-shortcut visibility feature have no current Primer counterpart and are not fabricated.

## Local review setup

These addresses describe the current review environment, not the repository's default Storybook port:

| Resource                       | Address                                           |
| ------------------------------ | ------------------------------------------------- |
| GitHub App reference Storybook | <http://localhost:6008>                           |
| Primer React Storybook         | <http://localhost:6007>                           |
| TextInput stacked comparison   | <http://localhost:6009/compare-text-inputs.html>  |
| ActionMenu overlay comparison  | <http://localhost:6009/compare-menus.html>        |
| Dialog stacked comparison      | <http://localhost:6009/compare-dialog.html>       |
| SelectPanel stacked comparison | <http://localhost:6009/compare-select-panel.html> |
| Switch stacked comparison      | <http://localhost:6009/compare-switch.html>       |
| Keyboard stacked comparison    | <http://localhost:6009/compare-kbd.html>          |

Both Storybooks and the comparison-page server must be running. Port 6006 serves an unrelated Storybook in this setup; a missing entry in its MCP index does not mean a story is missing from Primer React. Verify the actual live story URLs.

The stacked side-by-side page is the default review format. An overlay can supplement it when investigating fine alignment differences.

The batch pages share a local comparison script and use lazy iframe loading to avoid mounting every story at once. SelectPanel previews retain desktop-width columns; narrower windows scroll horizontally rather than accidentally switching only one side into its responsive layout. Comparison fixtures in the reference worktree remain local and are not committed to that repository.
