# RelativeTime

`RelativeTime` renders a semantic `time` element with a human-readable relative value and a stable machine-readable date.

Import: `import {RelativeTime} from '@primer/react-tailwind/RelativeTime'`

## Props

- `date`: `Date` — Instant being described.
- `datetime`: `string` — Instant being described, as an ISO 8601 string. An alternative to `date`.
- `day`: `NumericDatePart` — How the day of the month is rendered in an absolute date.
- `format`: `Format` — Which formatting scheme to use, such as a relative phrase, an elapsed duration, or a plain date.
- `formatStyle`: `FormatStyle` — How verbose the formatted output is.
- `hour`: `NumericDatePart` — How the hour is rendered in an absolute date.
- `minute`: `NumericDatePart` — How the minutes are rendered in an absolute date.
- `month`: `"long" | "narrow" | "short" | NumericDatePart` — How the month is rendered in an absolute date.
- `noTitle`: `boolean` — Stops the full date being set as the element's `title`.
- `onRelativeTimeUpdated`: `((event: RelativeTimeUpdatedEvent) => void)` — Called whenever the rendered text changes as time passes.
- `precision`: `"day" | "hour" | "minute" | "month" | "second" | "week" | "year"` — Smallest unit the output distinguishes, which also sets how often it refreshes.
- `prefix`: `string` — Text placed before an absolute date, such as `on`.
- `second`: `NumericDatePart` — How the seconds are rendered in an absolute date.
- `tense`: `Tense` — Forces past or future phrasing rather than deriving it from the date.
- `threshold`: `string` — Duration past which the output switches from a relative phrase to an absolute date.
- `timeZone`: `string` — IANA time zone the date is presented in.
- `timeZoneName`: `"" | "long" | "longGeneric" | "longOffset" | "short" | "shortGeneric" | "shortOffset"` — How the time zone is named in the output, if at all.
- `weekday`: `"" | "long" | "narrow" | "short"` — How the weekday is rendered in an absolute date, if at all.
- `year`: `NumericDatePart` — How the year is rendered in an absolute date.

## Differences from `@primer/react`

- `date` and `datetime` are normalized onto the `time` element's machine-readable `datetime` value.
