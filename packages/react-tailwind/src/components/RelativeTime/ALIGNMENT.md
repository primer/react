# Alignment

## From: `@primer/react`

Legacy RelativeTime wraps a GitHub custom element and supports localized relative, date-time, and duration formatting with configurable date parts, tense, precision, threshold, prefix, and time-zone behavior.

## To: `@primer/react-tailwind`

RelativeTime is a pure React 19 implementation that renders a semantic `time` element. It includes dependency-free duration and formatting logic, forwards DOM props and its root ref, and updates relative output with a React-managed timer.

## Migration notes

- `date` and `datetime` are normalized onto the `time` element's machine-readable `datetime` value.
- All formats, date-part controls, title handling, tense, precision, prefix, threshold, and time-zone props are formatted locally without a custom-element dependency.
- The initial server-rendered value is an absolute localized date; the client enhances it to relative output after hydration to avoid time-dependent hydration mismatches.
- Parent `lang`, `time-zone`, `hour-cycle`, and `data-prefers-absolute-time` DOM context are not read; use the component props and the runtime Intl defaults instead.
- Use `className` instead of `sx` or styled-system props.
