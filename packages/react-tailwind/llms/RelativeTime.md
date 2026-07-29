# RelativeTime

`RelativeTime` renders a semantic `time` element with a human-readable relative value and a stable machine-readable date.

Import: `import {RelativeTime} from '@primer/react-tailwind/RelativeTime'`

## Props

- `date`: `Date`
- `datetime`: `string`
- `day`: `NumericDatePart`
- `format`: `Format`
- `formatStyle`: `FormatStyle`
- `hour`: `NumericDatePart`
- `minute`: `NumericDatePart`
- `month`: `"long" | "narrow" | "short" | NumericDatePart`
- `noTitle`: `boolean`
- `onRelativeTimeUpdated`: `((event: RelativeTimeUpdatedEvent) => void)`
- `precision`: `"day" | "hour" | "minute" | "month" | "second" | "week" | "year"`
- `prefix`: `string`
- `second`: `NumericDatePart`
- `tense`: `Tense`
- `threshold`: `string`
- `timeZone`: `string`
- `timeZoneName`: `"" | "long" | "longGeneric" | "longOffset" | "short" | "shortGeneric" | "shortOffset"`
- `weekday`: `"" | "long" | "narrow" | "short"`
- `year`: `NumericDatePart`

## Differences from `@primer/react`

- `date` and `datetime` are normalized onto the `time` element's machine-readable `datetime` value.
