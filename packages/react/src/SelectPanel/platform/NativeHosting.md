# Internal SelectPanel native hosting

Native hosting is a default-off implementation of the existing presentational
parts, not another public API. `NativeDialogHost` owns the native lifecycle; the
shared SelectPanel state, listbox behavior, outside-click hook and anchored
positioning hook remain the foundations. No new export or entry point is needed.

## Accessibility and lifecycle ownership

| Requirement                                | Modal native hosting                                       | Anchored native hosting                                       |
| ------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------- |
| Dialog name and description                | SelectPanel context and overlay                            | SelectPanel context and overlay                               |
| Meaningful title, description and content  | Consumer supplies through existing parts                   | Consumer supplies through existing parts                      |
| Top layer                                  | Browser `showModal()`                                      | Browser manual `showPopover()`                                |
| Background inertness and focus containment | Browser                                                    | Intentionally absent; Tab can leave                           |
| Initial focus                              | Browser autofocus, with one-time late-content fallback     | Browser autofocus, with one-time late-content fallback        |
| Escape                                     | Browser `cancel`; host requests controlled dismissal       | Shared topmost-host registry and host Escape handler          |
| Outside dismissal                          | Host hit-tests the browser backdrop                        | Shared outside-click hook, only for the topmost host          |
| Focus after dismissal                      | Host returns focus                                         | Host returns focus except after clicking a background control |
| Scrolling                                  | Per-document reference-counted lock                        | Background scrolling remains available                        |
| Controlled acceptance/rejection            | React state authoritative, including external native close | React state authoritative, including external native hide     |
| Placement and styling                      | Existing Primer surface and responsive variants            | Existing anchored-positioning utility and Primer surface      |

This slice does not add optional APG interactions or semantics. It preserves the
existing dialog and listbox contracts. Modal focus containment is exclusively
browser-owned: there is no custom Tab trap. Anchored panels deliberately do not
declare `aria-modal` or obscure the background.

## Conservative configured adoption

Configured SelectPanel under legacy `DialogContext` stays on the part-backed
compatibility host even when native hosting is enabled. Reproduction at 1280px
and 390px showed Escape leaving the native configured collection mounted under
the legacy Dialog's focus/Escape ownership. This is a narrow React-ancestry guard,
not a DOM probe or global native disable; configured hosting outside that context
and generic composable native panels remain available.

The existing compatibility gate also retains meaningful focus opt-outs,
outside-click exceptions, explicit positioning/reflow options, and non-default
CSS anchor fallback strategies (including opposite-side fallback) on the legacy
host. Do not introduce a custom positioning helper to bypass that boundary.

Consumers extend content, order and layout with the existing presentational
parts and children. The internal host and compatibility hook are not public
utilities; exposing another API type is deferred until there is a concrete need.
