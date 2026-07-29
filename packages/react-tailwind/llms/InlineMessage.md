# InlineMessage

`InlineMessage` communicates validation, status, and availability inline with content or a form control.

Import: `import {InlineMessage} from '@primer/react-tailwind/InlineMessage'`

Renders a `<div>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `leadingVisual`: `React.ReactNode | React.ElementType` — Replaces the icon the variant would otherwise choose.
- `size`: `"medium" | "small"` — Default `'medium'`. Text size of the message.
- `variant`: `InlineMessageVariant` — Severity of the message, which sets its colour and default icon.

## Differences from `@primer/react`

- Existing variant and content usage can be retained.
