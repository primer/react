# Accessibility review record

Reviewed November 5, 2026 against implementation `4e744c114acc2e6d2d445611fa8f293f8ee12875` and baseline `f80b27cc531b4f12f3384a68a6c0259639d07d99`.

## Result and scope

Static and Chromium review supports the scoped changes: selection owns aggregate messages; initial selection is silent; canceled rapid updates settle to one message; inactive actions are excluded from the accessible table; native controls, column names, and focus recovery are preserved. No additional code finding remains in the reviewed change. **Assistive-technology sign-off is pending, and this is not a clean screen-reader review.**

Inspected the changed DataTable announcement effect, inactive header row, bulk-actions composition, private announcement context, and standalone count. Also inspected the existing focus MutationObserver, `AriaStatus`/`Announce`, the installed live-region implementation, selection model, table semantics/styles, tests, and unchanged captured story fixtures. No group-checkbox/disclosure behavior or selection scope changed.

## Review routes and evidence

Applied the accessibility-review skill's canonical routing manifest, repository accessibility policy, complete WCAG A/AA discovery index, criterion catalogue, severity rules, review/source-safety policy, and escalation trigger/exclusion/taxonomy. Relevant selected topics were WCAG criteria, AT support, prior audits, linked URLs, structure/headings, keyboard/focus, ARIA, live regions, runtime uncertainty, manual screen readers, and Primer component ownership.

Detailed criteria selected and read: **1.3.1, 1.3.2, 2.1.1, 2.4.3, 2.4.7, 2.4.11, 4.1.2, 4.1.3**, including the exact local criterion members and GitHub interpretations. Applied the keyboard/focus invariants, heading checks, HTML/ARIA and live-region checks, Primer source integration guidance, and the explicit VoiceOver macOS, NVDA, and JAWS manual guides. Source paths were resolved from the routing manifest; source-safety prerequisites were applied to external research.

- Structure/reading order: inactive header disappears from the accessible tree; active header and data roles remain intact. Role snapshots and full Chromium AX trees are in the report.
- Keyboard/focus: native checkbox Space, actions Enter, focus retention/return, and restoration of sorting controls passed browser checks. Existing focus tests cover detached actions and consumer overrides.
- Names/roles/states: native checkboxes and their labels are unchanged. Both intentional group controls remain. No inactive focusable actions remain under the hidden header.
- Status: both configurations emit polite count/clearing requests, explicit initial silence, cancellation/debounce, no duplicate toolbar request, localized messages, and no repeated unchanged count. DOM delivery is observed, speech is not.
- Visual impact: no intended visual change. All eight screenshot pairs are byte-identical, including focus recovery. No new layout, typography, color, pointer target, motion, media, form error, navigation landmark, tooltip, or custom-grid interaction was introduced; those unrelated topics were not expanded into a product-wide audit.

## External context and policy differences

Validated the supplied [original review](https://github.com/github/primer/issues/6780#issuecomment-6615478569), [reference audit](https://github.com/github/accessibility/issues/10807#issuecomment-4845725068), [migration request](https://github.com/github/accessibility/issues/10807#issuecomment-5284028744), and [historical VoiceOver retest](https://github.com/github/accessibility/issues/10807#issuecomment-5410001879). Historical evidence is not a reproduction on current AT.

The required prior-audit search in `github/accessibility-audits` with `accessibility` returned no `IndexTable` results. A broader `DataTable` query returned unrelated product audits. A focused `accessibility` + `eng-reviewable` query for `"live region" "selection"` returned no results. Search previews were not promoted to validated findings. The supplied directly relevant audit remains the supporting history.

Read [Primer DataTable accessibility guidance](https://primer.style/product/components/data-table/accessibility/) and local component ownership. Generic policy recommends the github-ui live-region package; Primer itself already owns its shared live-region integration. This scoped library fix retains that existing dependency rather than adding an application-layer dependency. The delivery compatibility concern remains explicitly unresolved.

Navigated from [a11ysupport.io](https://a11ysupport.io/) to its exact returned [aria-live support page](https://a11ysupport.io/tech/aria/aria-live_attribute). It records support for announcing changes across the requested ATs, but a macOS VoiceOver gap for polite non-interruption; data is 4–6 years old and does not establish shadow-root compatibility or a current DataTable pass. This is a support warning, not a newly observed failure. Initial plain-HTML retrieval lacked the SPA data; a rendered browser visit completed that lookup. A Primer redirect was followed to the exact HTTPS trailing-slash URL to complete the component guidance read.

## Manual dependency and escalation

The historical cross-AT discrepancy matches the ambiguous-requirement trigger “Component behavior differs significantly across AT” (default **Blocked** for compatibility sign-off). Scoped native-semantic and announcement-ownership fixes were independently completed under the user's authorization. No shared live-region replacement was attempted. Current AT testing and any necessary shared fix remain outstanding in #7342; no issue is represented as fully closed by browser assertions.

The exact manual matrix is in the main report. In particular, test spoken counts/clearing, rapid changes, silence on mount, and NVDA/JAWS table dimensions/cell navigation. Browser trees cannot determine those results. No other required source remains unavailable; missing current AT evidence is explicitly preserved here and in the draft PR.
