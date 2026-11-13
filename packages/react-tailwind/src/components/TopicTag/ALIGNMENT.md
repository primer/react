# Alignment

## From: `@primer/react`

`TopicTag` is a compact polymorphic topic link/label with a `size` option, optional `href`, and native element props. Legacy `TopicTagGroup` provides a simple wrapper for arranging tags. Both use CSS-module styling and shared legacy styling props; neither owns filtering, navigation, or popup behavior.

## To: `@primer/react-tailwind`

Tailwind preserves `TopicTag`, its polymorphic/native link behavior, and `TopicTagGroup`, while implementing the tag and group layout with Tailwind utilities and Primer semantic tokens. The group remains a layout wrapper and the tag remains a presentational/native interaction; no Base UI behavior is introduced. The package treats `TopicTagGroup` as a promoted stable composition, with React 19-compatible native props and no styled-system surface.

## Migration notes

- Existing TopicTag and TopicTagGroup composition can generally be retained.
- Keep navigation/filter state outside the components.
- Remove `sx`, styled-system props, and legacy CSS-module selectors.
