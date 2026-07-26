# Alignment

## From: `@primer/react`

Card is a composable display surface whose stories cover edge-to-edge images, icons, headings, metadata, descriptions, custom content, lists, and external menu/action controls. Its slot children are arranged into the same header/body/action structure regardless of the order supplied by the caller.

## To: `@primer/react-tailwind`

Card keeps stable `Icon`, `Image`, `Heading`, `Description`, `Action`, and `Metadata` slots and mirrors the upstream slot composition and responsive geometry with static Tailwind classes. Compound parts can be grouped in fragments, and custom or duplicate children remain visible in the content region instead of being discarded. Section cards only generate `aria-labelledby` when a heading exists and preserve an explicit heading id. The root supports simple presentational `as`, padding, border-radius, and layout choices; `Image` preserves the edge-to-edge composition. Card is not an interaction primitive and does not use Base UI. Actions are local slot content, so unrelated menu implementations are not absorbed into Card. Package-local action controls can retain small geometry differences from upstream while Card's own layout remains aligned; Tailwind's computed shadow serialization may also include transparent fallback layers for the same resting shadow token.

## Migration

- Compose ActionMenu or native action controls inside `Card.Action` instead of relying on a Card-specific menu API.
- Use `as` only for simple presentational roots.
- Preserve meaningful image alt text and accessible action names.
- Replace `sx` and styled-system props with `className` on the target slot.
- Tailwind stories use the package's Button, ActionMenu, ActionList, and VisuallyHidden primitives; their controls remain separate from Card.
