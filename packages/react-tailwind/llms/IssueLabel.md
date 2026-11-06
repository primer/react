# IssueLabel

`IssueLabel` displays a colored label and can render as a link, button, or custom element for interactive label workflows.

Import: `import {IssueLabel} from '@primer/react-tailwind/IssueLabel'`

## Props

- `as`: `React.ElementType` — Element to render.
- `fillColor`: `` `#${string}` `` — Custom hex colour, for a label whose colour is chosen by the user rather than from `variant`.
- `href`: `string` — Makes the label a link to the given URL.
- `variant`: `IssueLabelVariant` — Default `'gray'`. Named colour for the label.

## Differences from `@primer/react`

- Import the stable Tailwind `IssueLabel` instead of the experimental legacy entry point.
- Add `as="button"` for click actions without `href`.
- Remove `sx`, styled-system props, and CSS-module selectors.
