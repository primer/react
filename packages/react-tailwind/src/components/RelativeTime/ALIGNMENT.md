# Alignment

## From: `@primer/react`

Legacy RelativeTime wraps `@github/relative-time-element` and supports localized relative, date-time, and duration formatting with configurable date parts, tense, precision, threshold, prefix, and time-zone behavior.

## To: `@primer/react-tailwind`

RelativeTime preserves the same custom-element behavior through a typed React 19 wrapper around `@github/relative-time-element`. It forwards the formatting contract, custom update callback, DOM props, and ref while providing the localized absolute date as the server-rendered fallback.

## Migration notes

- `date` and `datetime` are normalized onto the custom element's machine-readable `datetime` value.
- The default and deprecated `auto`, `micro`, and `elapsed` formats remain compatible because the shared custom element still supports them; prefer `relative`, `datetime`, or `duration` in new code.
- The component intentionally uses the behavior-focused GitHub custom element rather than Base UI because Base UI does not provide date localization or continuously updating relative-time semantics.
- Use `className` instead of `sx` or styled-system props.
