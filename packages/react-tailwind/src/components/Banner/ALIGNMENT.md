# Alignment

## From: `@primer/react`

Legacy Banner exposes standard variants, a custom heading, flush dialog-contained presentation, and dismissible primary/secondary action layouts. Its responsive action layout was often expressed through surrounding page styles.

## To: `@primer/react-tailwind`

Banner has stable compound `Title`, `Description`, `Actions`, `PrimaryAction`, and `SecondaryAction` parts plus root `title`, `description`, `leadingVisual`, `onDismiss`, action, variant, layout, flush, and hide-title options. It preserves the supported dialog-contained and dismissible compositions without Base UI. Multiline actions use a named container query, so action placement responds inside a narrow sidebar as well as at a narrow viewport.

## Migration notes

- Prefer the compound parts for custom heading and action markup.
- Keep dialog ownership in local Dialog composition; Banner does not own modal behavior.
- Do not replace the container-query behavior with viewport-only CSS.
- `sx` and styled-system props are unsupported; use documented `className` composition.
