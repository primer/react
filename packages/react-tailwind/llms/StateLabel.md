# StateLabel

`StateLabel` shows the lifecycle state of an issue or pull request, such as open, closed, or merged. Use `Label` for general-purpose metadata.

Import: `import {StateLabel} from '@primer/react-tailwind/StateLabel'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {StateLabel} from '@primer/react-tailwind/StateLabel'
;<StateLabel status="pullMerged">Merged</StateLabel>
```

## API notes

The default size is `medium`.

## Composition

Use the component-owned status icon with text children that name the state.

## Accessibility

Include visible state text. Component-owned issue, pull request, alert, and archived icons expose their artifact type to assistive technology; the unavailable icon is decorative because it does not identify an artifact type.

## Data attributes

The root exposes `data-component="StateLabel"` and `data-status`.

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `size`: `"medium" | "small" | null`
- `status` (required): `"alertClosed" | "alertDismissed" | "alertFixed" | "alertOpened" | "archived" | "closed" | "draft" | "issueClosed" | "issueClosedNotPlanned" | "issueDraft" | "issueOpened" | "open" | "pullClosed" | "pullMerged" | "pullOpened" | "pullQueued" | "unavailable"` — State being reported, which sets the label's colour, icon, and default text.

## Differences from `@primer/react`

- Keep the accessible text explicit rather than depending on color alone.
- Replace the deprecated `variant="small"` prop with `size="small"`.
- Use `className`, not `sx` or styled-system props.
