# Alignment

## From: `@primer/react`

Card is a composable display surface whose stories cover edge-to-edge images, icons, headings, metadata, descriptions, custom content, lists, and external menu/action controls. Its slot children are arranged into the same header/body/action structure regardless of the order supplied by the caller.

## To: `@primer/react-tailwind`

Card keeps stable `Icon`, `Image`, `Heading`, `Description`, `Action`, and `Metadata` slots. Static Tailwind classes preserve the upstream slot composition and responsive geometry. Compound parts can be grouped in fragments, and custom or duplicate children remain visible in the content region.

Section cards generate `aria-labelledby` only when a heading exists and preserve an explicit heading id. The root supports simple presentational `as`, padding, border-radius, and layout choices. `Image` preserves edge-to-edge composition.

Card is not an interaction primitive and does not use Base UI. Actions are local slot content, so menu implementations remain separate. Package-local action controls can have small geometry differences from upstream, and Tailwind's computed shadow serialization can include transparent fallback layers for the same resting shadow token.

## Migration notes

- Compose ActionMenu or native action controls inside `Card.Action` instead of relying on a Card-specific menu API.
- Use `as` only for simple presentational roots.
- Preserve meaningful image alt text and accessible action names.
- Replace `sx` and styled-system props with `className` on the target slot.
- Tailwind stories use the package's Button, ActionMenu, ActionList, and VisuallyHidden primitives; their controls remain separate from Card.
