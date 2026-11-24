# Internal SelectPanel virtualization experiment

This standalone proof of concept builds on the compositional SelectPanel
capabilities core. It is **internal, experimental demo code**, not a supported
SelectPanel part or package export. Import it only from this directory in stories
and tests. It has no native-dialog, invoker, or configured-adapter dependency.

The collection owns its virtual viewport and focus state. It reuses SelectPanel's
internal context, SearchInput, and Item behavior, ActionList's markup, and TanStack
Virtual rather than adding a second selection implementation. No new config,
base, public hook, or entrypoint is needed to evaluate this experiment. Consumers
can continue composing the existing presentational parts; this does not change
their API.

## Deliberate limits

- Flat, single-line, fixed 32px rows; no groups, variable heights, nested controls,
  secondary actions, or active-descendant mode.
- Use `focusStrategy="roving"`. Values must be unique, stable strings or numbers;
  numeric `1` and string `"1"` are distinct.
- The caller filters the data and controls `filterValue`/`onFilterChange`.
  Selection persists across filters. Positional ARIA describes the filtered set.
- The active row stays mounted while scrolling, keeping the DOM bounded without
  losing browser focus. Focus repair after data removal is intentionally internal.

## Accessibility responsibilities

Reference: [APG listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).
Only the existing presentational core and this internal collection exist here;
there is no separate public base or hook-only API.

| Requirement                                       | Internal collection / existing core              | Story or caller                                      |
| ------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| Named dialog, dismissal, initial and return focus | SelectPanel core                                 | Provide Title and CloseButton inside Overlay         |
| Named listbox and search                          | Collection provides explicit labels              | Supply an appropriate surrounding title              |
| Option role, selection, disabled state            | SelectPanel.Item                                 | Supply unique values and labels                      |
| Full filtered position and size                   | Collection sets `aria-posinset` / `aria-setsize` | Supply the entire filtered data set                  |
| Roving focus and virtual-window navigation        | Collection, including disabled-row skipping      | Choose roving mode; do not nest interactive controls |
| Selection without modifier keys                   | Core handles Enter/Space and click               | Choose single/multiple and close-on-select policy    |
| Filtering and empty results                       | SearchInput emits filter changes                 | Filter data and render an empty message              |
| Focus visibility and contrast                     | Existing Primer parts and structural CSS         | Keep labels single-line and avoid clipping           |

### Optional APG decisions

Home/End are enabled (recommended for large sets); PageUp/PageDown are additional
viewport-sized navigation. Arrow keys wrap and skip disabled options. These paths
are covered by the browser tests. Focus does not select: Enter/Space explicitly
toggle selection using the core's modifier-free selection model.

APG's optional selection-follows-focus, Shift+Arrow range selection,
Shift+Space range selection, Ctrl/Cmd+A select-all, and Ctrl/Cmd+Shift+Home/End
range shortcuts are not implemented. Printable-key typeahead is not implemented;
use the separate filter input instead. There is deliberately no opt-in API for
these unproven behaviors. Nested controls are unsupported because their key
bindings conflict with listbox navigation.

## Validation and preview

Run the adjacent browser test and the existing SelectPanel core tests. The
`Components/SelectPanel/Virtualization` story exercises 10,000 rows, keyboard
navigation, filtering, and selection while checking the mounted option count:

`/?path=/story/components-selectpanel-virtualization--ten-thousand-items`

No public export or published runtime behavior changes, so this demo-only branch
does not need a package changeset (`skip-changeset` when opening a PR).
