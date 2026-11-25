# Internal SelectPanel demos

These files are Storybook examples, not a new supported SelectPanel API. The
playground and repository ref selector depend directly on the compositional
capabilities core. They do not depend on the virtualization experiment,
native-dialog flags, invokers, or a configured adapter.

## Abstraction and extension

The demos compose the existing presentational SelectPanel parts and shared Primer
components. Search, committed/draft selection, recipe configuration, and tab state
belong to the examples. The core's generic state hook remains internal. There are
no new public components, hooks, base primitives, config adapters, entrypoints, or
barrel changes. Extend an example by changing ordinary children or its local
configuration, without forking SelectPanel or adding options to its public API.

The approved preserved integration at
`66b5f424d07e1a4d152799c408fa3d5f76ada9d9` is the visual reference for the six
appearance presets. Primer mode keeps the existing component styling; other
presets demonstrate example-only CSS, not production themes or a styling
contract. Skins use supplied classes, inline input styles, and inherited design
tokens, not `data-component` selectors or private ActionList wrappers. Inherited
control sizing leaves selection indicators and action visuals owned by Primer.

The anatomy inspector uses example-owned `data-select-panel-*` markers, including
visuals authored by the example. It does not redefine Primer's component
identifiers. The Windows 98 appearance includes the existing local anatomy image.
The read-only React/CSS previews are generated from the same configuration. Their
named scroll regions are keyboard-focusable so long code and desktop-sized
previews can be scrolled without a pointer.

## Stories

- Playground: `/?path=/story/components-selectpanel-playground--playground`
- Iframe transport surface:
  `/?path=/story/components-selectpanel-playground--preview-surface`
- Ref selector:
  `/?path=/story/components-selectpanel-composition-refselector--default`

The isolated iframe resolves `iframe.html` relative to the current Storybook path,
including hosted subdirectories. Same-origin messages validate source window,
configuration, theme, and reset counter. Configuration updates do not navigate or
replace the preview; an explicit retry does. The adjacent tests cover this
transport independently from the real Storybook integration.

This branch deliberately excludes the recording/source-showcase story and assets.
The ref selector uses static fixtures; branch/tag creation and repository requests
are out of scope.

## Accessibility responsibilities

These examples reuse the existing
[APG combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/),
[listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/), and
[tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) primitives; they do not
introduce a new accessibility primitive or change the core's keyboard policy.

| Requirement                                                   | Existing presentational parts                  | Example / consumer responsibility                                                   |
| ------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| Dialog name, focus entry/return, Escape and outside dismissal | SelectPanel core / Dialog                      | Compose Title, dismissal controls, and an appropriate heading level                 |
| Search, active option, listbox relationships and navigation   | SearchInput, List and Item                     | Filter fixtures and keep only the active collection mounted                         |
| Selection and disabled semantics                              | Item                                           | Own selected values, immediate versus Save/Cancel commit policy                     |
| Secondary actions                                             | Core item shortcut and details Dialog          | Supply labelled actions; use the core shortcut, not nested tabbable controls        |
| Tab roles, relationships and automatic arrow-key activation   | UnderlinePanels                                | Label tabs and keep tab state separate from selected ref                            |
| Repository navigation                                         | ActionList.LinkItem                            | Keep links outside the selectable listbox                                           |
| Loading, empty, error and saved-selection feedback            | Loading / Message and authored live text       | Provide meaningful text and simulated state                                         |
| Themes and contrast                                           | Primer mode uses Primer tokens                 | Custom skins remain experimental; tests check palette contrast and focus visibility |
| Iframe and source access                                      | Named iframe, read-only code, status and retry | Same-origin Storybook host; keyboard-accessible scrolling                           |

Optional behavior decisions stay at the example level: filtering is available by
default and can be omitted with Quick pick; multiple selection, grouping,
descriptions, actions, Save/Cancel, and anatomy are opt-in. Controls and browser
tests cover both default and enabled paths. Selection does not follow focus.
The ref selector uses the existing automatic tab activation and keeps repository
navigation outside the listbox. No range-selection or select-all shortcuts are
added by the demos.

## Adoption

Run the adjacent browser tests with `VITEST_FAIL_ON_CONSOLE=true`, then exercise
the actual iframe-backed story. No console warnings are suppressed. These files
have no public exports or published runtime impact, so no release changeset is
needed; use `skip changeset` when opening a PR.
