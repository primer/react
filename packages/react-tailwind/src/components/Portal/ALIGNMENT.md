# Alignment

## From: `@primer/react`

Legacy `Portal` renders children into a registered portal root selected by `containerName`, with the package's portal-root registration convention. It provides the old portal lookup behavior and accepts the legacy component props, including styling-system additions through shared types. The default root is governed by that registration mechanism rather than a direct DOM container prop.

## To: `@primer/react-tailwind`

Tailwind `Portal` accepts a direct `container` element or ref and forwards native div props and a ref. Without one, it resolves `[data-portal-root]` and falls back to `document.body`. It uses React 19-compatible portal composition and does not require named root registration. Portal remains a small rendering utility; it does not add focus, dismissal, or positioning behavior and is not itself a Base UI primitive.

## Migration notes

- Replace `containerName` with a DOM `container` or ref.
- Add `[data-portal-root]` to a root when a shared default is desired.
- Remove `sx` and styled-system props; move styling to the portaled content.
