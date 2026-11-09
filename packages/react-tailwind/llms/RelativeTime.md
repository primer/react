# RelativeTime

`RelativeTime` renders a semantic `time` element with a human-readable relative value and a stable machine-readable date.

Import: `import {RelativeTime} from '@primer/react-tailwind/RelativeTime'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {RelativeTime} from '@primer/react-tailwind/RelativeTime'
;<RelativeTime datetime="2024-01-02T00:00:00.000Z" />
```

Use `date` when a `Date` object is already available, or `datetime` for an ISO date string. Omit `children` to display the formatter's output, including `format="micro"`.

`children` is a persistent display override, not a loading or hydration fallback: rendering uses `children ?? text`. Any non-nullish child, including an empty string or `false`, suppresses formatted text. `null` and `undefined` use the formatter. Custom children do not stop the timer, title calculation, or update callback; callback text describes the formatter's output, not necessarily the visible children.

`format="duration"` and `format="elapsed"` default to second precision and update at the next represented unit boundary. Duration formatting groups 30 days into a month and 12 months into a year; `precision="week"` counts whole seven-day weeks within each 30-day month. Browsers may delay timers, particularly in background tabs; the display catches up when the timer runs.

Relative and micro formats schedule updates at represented minute and hour rounding boundaries for past and future dates. Text uses the most recent update's time, so unrelated React rerenders do not independently change it. With automatic tense, `auto` and `relative` formats also refresh at the represented precision boundary when a fixed threshold is reached before 30 days. Relative and micro output also refreshes at elapsed-day boundaries, precision-adjusted offsets in explicit thresholds, represented 30-day month rollovers, and UTC reference-day changes, including shifted boundaries for negative calendar thresholds. Micro threshold comparisons use whole seconds. Calendar-based comparisons can change at other times between updates, so remaining threshold transitions are best-effort.

## API notes

When both `date` and `datetime` are provided, `datetime` takes precedence. A supplied `title` overrides the computed absolute-date tooltip, even with `noTitle`. `noTitle` suppresses only the generated title: omit `title` as well when the host prohibits the attribute.

Other standard `time` attributes, including `className`, are forwarded.

## Composition

Use `RelativeTime` in activity metadata, event lists, and prose where a machine-readable timestamp should remain available. A user's absolute-time setting is honored automatically through `data-prefers-absolute-time="true"` on `html` or `body`, including live changes; pass `prefersAbsoluteTime` when the host owns that setting in React state instead. Durations and elapsed timers are unaffected. Custom children must describe the time meaningfully. Provide a precise date in visible text or a separately accessible disclosure rather than relying on a browser title tooltip.

When the absolute-time preference is active, "Today" and current-year labels refresh at civil-day changes in the displayed time zone, including offset transitions. Future timestamps also update when they enter the current calendar year. Older timestamps keep a daily check because a time-zone rollback can return to their calendar year; unchanged text does not trigger an update callback. Browsers may delay these timers, particularly in background tabs.

After hydration, formatting follows the nearest `lang`, `time-zone`, and `hour-cycle` attributes, including changes to those attributes. Pass the native `lang` prop, `timeZone`, or `hourCycle` to override the corresponding inherited setting. Without an hour-cycle setting, the browser's 12- or 24-hour preference is used. Until hydration, the visible fallback is an ISO 8601 UTC timestamp, independent of formatting props and document context. This avoids mismatches between different server and browser Intl implementations, but is not localized if JavaScript does not run. Custom children remain a persistent display override.

## Accessibility

The native `time` element carries a machine-readable `datetime`, but that attribute does not guarantee that assistive technology announces the full date, time, or time zone. It is not an interactive control and does not become a Tab stop merely because it has `datetime` or `title`. The component adds no live region or automatic announcement contract. Native element semantics are not evidence of equivalent announcements to the legacy custom element.

`format="elapsed"` defaults to narrow units such as `1m`, which can be ambiguous. Where space permits, `formatStyle="long"` renders expanded units such as `1 minute`. Verify the resulting wording with the host's supported screen readers; an accessible name on a surrounding timer does not by itself establish how its changing value is announced.

`format="micro"` also supports expanded units with `formatStyle="long"` when tense is automatic. When a past or future tense is explicitly forced, micro phrasing remains narrow even with `formatStyle="long"`, matching the legacy formatter. Use `format="relative"` with `formatStyle="long"` or a precise date when expanded wording is needed in that case.

For static precise output, use `format="datetime"`, `noTitle`, and explicit date parts and time zone:

```tsx
<RelativeTime
  datetime="2024-01-02T12:00:00.000Z"
  format="datetime"
  year="numeric"
  month="long"
  day="numeric"
  hour="numeric"
  minute="2-digit"
  second="2-digit"
  timeZone="UTC"
  timeZoneName="short"
  prefix=""
  noTitle
/>
```

This keeps precision in the readable text instead of only in an attribute. Confirm the rendered locale-specific date and zone. If compact relative output must remain, show the precise timestamp alongside it or expose it through a keyboard-operable, descriptively named disclosure. A custom tooltip must also work on focus, preserve access to the information, and satisfy dismissal, hover, and persistence requirements; wrapping an unfocusable `time` in a hover-only tooltip is insufficient. `noTitle` neither creates a tooltip nor exposes additional precision.

Invalid dates omit `datetime` and formatter text; supplied children still render. Verify keyboard access to any precision disclosure and screen-reader reading of both compact and precise values in the host's supported browser/AT combinations. Canary AT announcement parity and a11ysupport.io support data remain unverified.

## Animation and reduced motion

`RelativeTime` has no visual animation, but its relative text updates automatically. The component does not read `prefers-reduced-motion` and has no pause, stop, hide, or update-disable prop. `precision` is not a pause control, and custom children do not cancel updates.

For auto-updating information presented alongside other content, evaluate WCAG 2.2.2's auto-update requirement: provide a user mechanism to pause, stop, hide, or control update frequency unless updating is essential to the activity. The five-second condition for moving content does not apply to this separate auto-update requirement. A historical audit closure does not grant a blanket exception for timestamps. Reduced-motion preferences can inform a host's static-display choice, but the absence of animation alone does not resolve auto-update requirements.

A supported host path is a user-controlled switch to `format="datetime"` with `prefersAbsoluteTime={false}`. This formats once per relevant prop or context change without scheduling recurring updates; the explicit preference override is needed because preferred absolute text can itself change over time. If preserving a frozen relative phrase is required, replace/unmount this component with an app-owned native `time` containing the frozen text and a valid `datetime`; resume by rendering `RelativeTime` again. Merely supplying fixed children, applying CSS to hide the component, or changing precision does not disable its timer. A package-level pause API remains a gap.

## Theming and Tailwind

Import the package styles once, or compile with Tailwind v4 and the package `dist` `@source`. Use `className` and standard CSS to style the time element; the component does not add a typography-specific styling prop.

### Data attributes

The root exposes `data-component="RelativeTime"`, plus native `dateTime` and `title` values. The relative formatting is content, not a state attribute.

Renders a [`<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `date`: `Date` — Instant being described.
- `datetime`: `string` — Instant being described, as an ISO 8601 string. An alternative to `date`.
- `day`: `NumericDatePart` — How the day of the month is rendered in an absolute date.
- `format`: `Format` — Which formatting scheme to use, such as a relative phrase, an elapsed duration, or a plain date.
- `formatStyle`: `FormatStyle` — How verbose the formatted output is.
- `hour`: `NumericDatePart` — How the hour is rendered in an absolute date.
- `hourCycle`: `"h11" | "h12" | "h23" | "h24"` — Hour cycle used for absolute times and titles. Overrides the nearest `hour-cycle` attribute.
- `minute`: `NumericDatePart` — How the minutes are rendered in an absolute date.
- `month`: `"long" | "narrow" | "short" | NumericDatePart` — How the month is rendered in an absolute date.
- `noTitle`: `boolean` — Stops the full date being set as the element's `title`.
- `onRelativeTimeUpdated`: `((event: RelativeTimeUpdatedEvent) => void)` — Called whenever the rendered text changes as time passes.
- `precision`: `"day" | "hour" | "minute" | "month" | "second" | "week" | "year"` — Smallest unit the output distinguishes, which also sets how often it refreshes.
- `prefersAbsoluteTime`: `boolean` — Shows the user's preferred absolute date and time instead of relative or micro output. Durations and elapsed timers are unaffected. Defaults to reading `data-prefers-absolute-time="true"` on the document's `html` or `body` element, and follows live changes to that attribute.
- `prefix`: `string` — Text placed before an absolute date, such as `on`.
- `second`: `NumericDatePart` — How the seconds are rendered in an absolute date.
- `tense`: `Tense` — Forces past or future phrasing rather than deriving it from the date.
- `threshold`: `string` — Duration past which the output switches from a relative phrase to an absolute date.
- `timeZone`: `string` — IANA time zone the date is presented in. Overrides the nearest `time-zone` attribute.
- `timeZoneName`: `"" | "long" | "longGeneric" | "longOffset" | "short" | "shortGeneric" | "shortOffset"` — How the time zone is named in the output, if at all.
- `weekday`: `"" | "long" | "narrow" | "short"` — How the weekday is rendered in an absolute date, if at all.
- `year`: `NumericDatePart` — How the year is rendered in an absolute date.

## Differences from `@primer/react`

- `date` and `datetime` are normalized onto the `time` element's machine-readable `datetime` value.
- All formats, date-part controls, title handling, tense, precision, prefix, threshold, and time-zone props are formatted locally without a custom-element dependency.
- **DOM selectors and refs:** legacy renders `<relative-time>`; this package renders `<time data-component="RelativeTime">`. Scope DOM tests and CSS selectors to `time[data-component="RelativeTime"]` rather than the old tag. The forwarded ref points to the native time element, not a custom-element instance; review custom-element properties, methods, and shadow-root assumptions instead of blindly replacing the tag name.
- **Formatting attributes:** props such as `format`, `tense`, and `precision` control React-managed formatting and are consumed rather than emitted as custom-element attributes. Assert rendered text, the native `datetime` value, or the public callback instead of inspecting those attributes or assigning custom-element properties.
- **Update notifications:** `onRelativeTimeUpdated` remains a supported React callback. The implementation invokes that callback but does not dispatch the custom-element event through the DOM, so native `addEventListener('relative-time-updated', ...)` and delegated event assumptions need migration rather than a selector-only replacement.
- **Automatic durations:** `duration` and `elapsed` default to second precision and refresh at the next represented unit boundary. Duration formatting groups 30 days into a month and 12 months into a year. `precision="week"` counts whole weeks within each 30-day month rather than rendering zero weeks as the legacy formatter did. Browser timer throttling can delay an update; the displayed value catches up when the timer runs.
- **Relative refresh timing:** `auto`, `relative`, and `micro` update at represented minute and hour rounding boundaries for past and future dates. Text uses the most recent update's time, so unrelated React rerenders do not independently change it. Browser timer throttling can delay an update.
- **Known — calendar thresholds:** Thresholds use the upstream calendar-duration comparison. Auto/relative output with automatic tense refreshes at the represented precision boundary for fixed thresholds that transition before 30 days. Relative and micro output also refreshes at elapsed-day boundaries, precision-adjusted offsets in explicit thresholds, represented 30-day month rollovers, and UTC reference-day changes, including shifted boundaries for negative calendar thresholds. Micro threshold comparisons use whole seconds. Remaining threshold transitions are best-effort; near calendar boundaries the comparison can change and reverse between checks, even within a second.
- **Server fallback:** the initial server-rendered value is an ISO 8601 UTC timestamp, regardless of formatting props. This keeps first hydration consistent even when server and browser Intl implementations format the same locale differently. Explicit formatting props, DOM ancestors, and the document's absolute-time preference take effect after hydration. The fallback is not localized when JavaScript does not run; custom children remain a persistent display override.
- **Children contract:** `children ?? text` makes children a permanent display override, not a fallback until formatting completes. Omit children for formatted output; `null` and `undefined` also use the formatter. Empty strings and `false` suppress it. Formatting, title updates, and callbacks continue behind custom children. The github-ui host removed fallback children from its `format="micro"` Ago adapter and reports 40 passing package browser tests; that is host evidence, separate from canary validation.
- **Parity gap — update controls:** no pause/stop/hide or update-disable API exists, and reduced-motion preferences are not read. `precision` affects cadence in some formats but does not stop updates. `format="datetime" prefersAbsoluteTime={false}` performs an initial calculation without a recurring timer; a user-controlled switch to this static mode is a supported host path. To freeze relative wording, unmount and replace the component with an app-owned native `time`, then remount to resume. Fixed children and CSS hiding do not stop the timer. Evaluate WCAG 2.2.2's auto-updating-content requirement in the host context; historical audit `github/accessibility-audits#10091` was reported closed NOT_PLANNED, not as a general essential-update exception or canary compliance finding.
- **Title and accessible precision:** `noTitle` suppresses the generated title only; explicitly supplied `title` still wins. Hosts prohibiting `title` must set `noTitle` and omit `title`. Prefer readable precise date/time/zone text with `format="datetime"` and explicit date parts, or a keyboard-accessible precision disclosure alongside compact text. Native `datetime` and browser title tooltips are not substitutes for accessible precision. A native `time` is not automatically a Tab stop or live region. The reported completion of `github/accessibility-audits#5633` after `primer/react#4635` added `noTitle` concerns the legacy implementation, not native-time browser/AT parity. Canary announcement parity and a11ysupport.io support data remain unverified.
- **Compact elapsed units:** `elapsed` defaults to narrow localized units, which can be ambiguous; `formatStyle="long"` is available when expanded units are appropriate. The open `github/accessibility-audits#5632` concerns ambiguous year abbreviations in the legacy React micro-format story, not a verified failure of this elapsed timer. Test the actual host and assistive-technology combinations.
- **Compact micro units:** `formatStyle="long"` expands micro units with automatic tense, but explicitly forced past/future micro phrasing stays narrow, matching legacy. Use a long relative format or a precise date when expanded wording is needed.
- **Verified native DOM behavior:** a focused Chromium fixture using this component confirmed `HTMLTimeElement`, normalized `datetime`, visible precise UTC text, no generated title with `noTitle`, and Tab moving past the static timestamp. No live-region attribute or recurring timer was added in `format="datetime"`. An explicit title remained present with `noTitle`; micro-format children suppressed visible formatting while a timer remained active; omitting children restored formatted output, and unmounting cleared the timer. These are component/browser observations, not screen-reader or cross-browser validation.
- **Absolute-time preference:** like legacy, `data-prefers-absolute-time="true"` on the owner document's `html` or `body` switches relative, auto, micro, and datetime output to the legacy preferred absolute text (`Today 9:05 AM UTC`, `Mar 2, 9:05 AM UTC`, or with a year outside the current year), including `format="relative" tense="past"`; `duration` and `elapsed` remain durations. Unlike legacy, live attribute changes rerender immediately rather than at the next timer tick. The `prefersAbsoluteTime` prop overrides document context for hosts that own the setting in React state. `prefix`, date-part props, and `threshold` do not affect preferred absolute text; language, time zone, and hour cycle do. The preference is read after hydration. "Today" and current-year labels refresh at civil-day changes in the displayed time zone, including offset transitions. Future dates also refresh when they enter the current calendar year; older dates retain daily checks for unusual rollbacks into a previous year. Offset transitions are sampled at six-hour intervals, so multiple transitions within a sample can be missed; browser timer throttling can also delay updates.
- **Language and clock context:** like legacy, the nearest `lang`, `time-zone`, and `hour-cycle` attributes, including those on the time element, determine formatting. An empty nearest attribute falls back to the owner document's `html` attribute. The native `lang` prop, `timeZone`, and `hourCycle` override inherited settings. Missing or invalid language uses the runtime locale; a missing or invalid hour cycle uses the runtime's 12- or 24-hour preference, independently of the resolved language. Invalid values warn in development; an invalid time zone surfaces the Intl error. Unlike legacy, ancestor changes and moves update mounted output when observed, including static datetime output, instead of waiting for another legacy update.
- Use `className` instead of `sx` or styled-system props.
