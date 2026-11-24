# SelectPanel composition

The existing callable configured API is unchanged. Its established compound-export
convention is retained for the new parts. The companion state hook and contexts
remain internal. No new package entry point or speculative base API is introduced:
AnchoredOverlay, ActionList, TextInput and IconButton already provide the primitives.
Consumers extend panels through ordinary children, not child extraction or cloning.

## Accessibility responsibilities

Patterns: [modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/),
[listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) and
[combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).

| Requirement                                       | Presentational parts                          | Consumer                                                          |
| ------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| Dialog role, modal state, backdrop and focus trap | Overlay via AnchoredOverlay                   | Provide an accessible name                                        |
| Title and description references                  | Registered parts via internal context         | Use Title or aria-label; omit Description for complex content     |
| Heading structure                                 | Title defaults to h1 in Overlay, h2 otherwise | Choose `as` for the surrounding document                          |
| Focus entry and restoration                       | SearchInput initially, trigger on close       | Supply initialFocusRef for complex content or destructive actions |
| Close and Escape                                  | CloseButton and Overlay                       | Render a visible CloseButton                                      |
| Listbox and option roles, selection state         | List, Item and internal state hook            | Use stable string/number values; label a standalone List          |
| Arrow navigation and disabled item skipping       | Internal useListboxFocus                      | Do not nest arrow-key controls in options                         |
| Active descendant or roving focus                 | Root focusStrategy                            | Use one SearchInput and List per Root                             |
| Styling and focus indicators                      | Existing Primer primitives and tokens         | Preserve contrast in custom content                               |
| Query filtering                                   | SearchInput publishes query changes           | Filter rendered children; do not imply filtering if none occurs   |

Optional APG choices are deliberate: selection does not follow focus; multiple
selection uses modifier-free toggling. Home/End and PageUp/PageDown are supported
for roving options; Home/End keep native input editing in active-descendant mode.
Type-ahead is not added to the roving collection: use SearchInput for filtering.
Shift range selection, Ctrl+A/select-all and contiguous range shortcuts are not
provided by this compositional core. No region landmarks are added per group.
`aria-describedby` is opt-in through Description. `aria-label` is supported when
there is no visible title. A custom initial focus target is opt-in through the
existing overlay focus settings. Dialog is the only panel role; alertdialog is
not a selection-panel variant.

Parts composed from another Primer component retain that component's identifier
(Heading, ActionList, TextInput, IconButton). Owned wrappers carry SelectPanel
identifiers; this avoids silently replacing another component's stable selector.

Configured message rendering and announcements stay on their legacy path until
the default-off compatibility adapter is introduced. The new Message and Loading
parts provide polite status announcements, including compact inline content.
