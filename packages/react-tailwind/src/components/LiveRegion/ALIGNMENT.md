# Alignment

## From: `@primer/react`

Legacy React exports separate Announce, AriaStatus, and AriaAlert components and documents them as distinct live-region fixtures.

## To: `@primer/react-tailwind`

The stable module keeps `Announce`, `AriaStatus`, and `AriaAlert` as local exports with shared live-region semantics. `Announce` supports `announceOnShow`, `delayMs`, `hidden`, `politeness`, and simple `as`; the status and alert variants express the appropriate ARIA urgency. The implementation is a normal semantic live-region component, not a Base UI primitive.

## Migration notes

- Select `AriaStatus` for polite status updates and `AriaAlert` for urgent messages; do not duplicate the text in multiple regions.
- Use `announceOnShow` and `delayMs` only for the documented Announce activation behavior.
- Keep visual hiding separate from removing important content from the accessibility tree.
- `sx` and styled-system props are unsupported; use `className`.
