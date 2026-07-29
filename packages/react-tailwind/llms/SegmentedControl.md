# SegmentedControl

`SegmentedControl` is a single-choice Base UI toggle group for related view or mode choices.

Import: `import {SegmentedControl} from '@primer/react-tailwind/SegmentedControl'`

## Props

- `className`: `string | ((state: ToggleGroupState) => string | undefined)`
- `fullWidth`: `ResponsiveValue<boolean>` — Stretches the control to fill its container, sharing the width between segments.
- `size`: `SegmentedControlSize` — Default `'medium'`. Height and text size of the segments.
- `variant`: `"default" | Partial<Record<"narrow" | "regular" | "wide", SegmentedControlVariant>>` — Default `'default'`. How the control adapts on narrow viewports, such as collapsing into a menu or hiding labels.

## Button props

- `children`: `React.ReactElement[]`
- `className`: `string | ((state: ToggleState) => string | undefined)`
- `count`: `string | number` — Number shown after the segment's label.
- `leadingVisual`: `React.ReactNode` — Icon shown before the segment's label.
- `value`: `string` — Value this segment selects, matched against the control's value.

## IconButton props

- `aria-label`: `string` — Accessible name for the segment, since the icon alone conveys nothing.
- `className`: `string | ((state: ToggleState) => string | undefined)`
- `count`: `string | number` — Number shown after the segment's label.
- `icon`: `React.ElementType` — Icon component to render.
- `value`: `string` — Value this segment selects, matched against the control's value.

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for single-choice state.
