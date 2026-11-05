# StateLabel

`StateLabel` shows the lifecycle state of an issue or pull request, such as open, closed, or merged. Use `Label` for general-purpose metadata.

Import: `import {StateLabel} from '@primer/react-tailwind/StateLabel'`

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `size`: `"medium" | "small" | null`
- `status`: `"alertClosed" | "alertDismissed" | "alertFixed" | "alertOpened" | "archived" | "closed" | "draft" | "issueClosed" | "issueClosedNotPlanned" | "issueDraft" | "issueOpened" | ... 5 more ... | "unavailable"` — State being reported, which sets the label's colour, icon, and default text.

## Differences from `@primer/react`

- Keep the accessible text explicit rather than depending on color alone.
