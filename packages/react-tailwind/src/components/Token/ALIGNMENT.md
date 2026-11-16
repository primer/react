# Alignment

## From: `@primer/react`

Legacy Token, IssueLabelToken, and TokenBase support removable and interactive token patterns, including the accessibility requirement that an interactive token not contain a nested interactive remove control.

## To: `@primer/react-tailwind`

The stable API keeps `Token`, `IssueLabelToken`, and `TokenBase`. TokenBase supports text, size, remove behavior, selected state, href, disabled state, and simple element choice. Token and IssueLabelToken share internal text and size-aware removal layers.

Interactive removable tokens compose their primary action and pointer removal affordance as siblings inside the token shell. Non-interactive tokens retain a labelled remove button. IssueLabelToken parses arbitrary CSS colors once and exposes light, dark, hover, border, and selected color models through package CSS. No Base UI primitive is used.

## Migration notes

- Do not nest a remove button inside a link/button token.
- Use `onRemove` and the documented composition for keyboard removal.
- `as="button"` defaults to `type="button"`; pass `type="submit"` or `type="reset"` explicitly for form actions.
- Keep non-interactive token remove controls visibly and programmatically named. `Token` includes keyboard-removal instructions in its text; for an interactive removable `IssueLabelToken`, consumers must add those instructions to the primary action's accessible name or description.
- `sx` and styled-system props are unsupported; use `className`.
- Explicit `aria-disabled` is preserved independently of `disabled`. It does not set native `disabled`, remove the action from keyboard focus, or suppress activation; a consumer can retain an unavailable action that opens explanatory details. `disabled` still controls the package's interaction suppression and native button disabling, and forces `aria-disabled="true"` on non-button roots even if an explicit false value was supplied. On native button roots, native `disabled` provides the disabled state while any explicit ARIA value is forwarded unchanged. For removable interactive tokens, ARIA remains on the public span root rather than being moved or duplicated onto the inner action, preserving the existing root-props/ref contract and ARIA's inherited disabled-state semantics.

- Leading visuals and accessible text:

  `Token.leadingVisual` is decorative: its wrapper has `aria-hidden="true"`, so an icon's label does not contribute to the token's accessible name. Legacy consumers that conveyed meaningful state through a labelled icon must put that state in `text`, for example as visually hidden text alongside the visible pull-request title. Keep the state inside `text`, rather than only in `leadingVisual`, so it belongs to the primary action even when a removable interactive token uses a separate span shell.

  The separate remove button derives `Remove <text>` only when `text` is a string. ReactNode content, including a fragment containing visually hidden state, otherwise produces the generic `Remove token` label. Use `removeButtonLabel` on `Token` or `IssueLabelToken` to supply the full accessible name, including the visible token text and enough context to identify the removed item; a root `aria-label` does not name the separate remove action. Hidden state need not be repeated in that name if it is not needed to identify the item. The override also permits a localized name. For interactive removable tokens, the internal removal affordance is aria-hidden and the override has no effect; ensure the primary action communicates keyboard removal as described above.

- Native attributes, custom actions, and refs:

  `as="a"` accepts native anchor props; `as="button"` accepts native button props. Custom components passed to `as` retain their required props and must forward the received DOM props and ref to their host element.

  For `Token` and `IssueLabelToken`, an interactive action with `onRemove` and without `hideRemoveButton` renders inside a **span shell**, alongside the pointer removal affordance. Anchor attributes (`href`, `target`, `rel`, `download`, `hrefLang`, `media`, `ping`, `referrerPolicy`, and `type`) go to the inner link. Button attributes (`type`, `name`, `value`, `form*`, and `popoverTarget*`) go to the inner button. Custom action props such as router `to`, `preload`, and `reloadDocument` likewise go to the custom action. Global DOM props, ARIA/data attributes, classes, styles, IDs, and non-click event handlers remain on the shell; `onClick` runs on the primary action.

  **The public ref always points to the root, never the inner action.** Without visible removal, the selected element/custom component is the root. With visible removal, the root is a span. Changing optional/dynamic `onRemove` or `hideRemoveButton` can replace the root and detach/reattach its ref. Compound token typings conservatively include that span possibility even when a call currently omits removal or sets `hideRemoveButton`. Use `React.Ref<HTMLElement>` for HTML-root tokens; anchor-only/button-only refs are not a sound contract for these configurable components. Custom roots include their declared ref target and the span shell. `TokenBase` does not create the sibling-action shell: its ref follows its selected `as` element, even when it receives `onRemove`.

  Unparameterized `TokenProps` and `IssueLabelTokenProps`, and `React.ComponentProps` for either component, support wrappers that choose between HTML roots. Their broad `as` and native attributes are not a discriminated union, so wrappers must match attributes to the actual root. For root-specific validation and custom component props, use explicit generics such as `TokenProps<'a'>` or `TokenProps<typeof RouterLink>`; direct JSX also validates a concrete root. Undefined and optional roots can render a span, so direct calls reject incompatible native action attributes and refs; broad wrapper types can still erase that relationship. Use an explicit generic for custom non-HTML roots and a ref that accepts both the custom root and `HTMLSpanElement`. React's structural ref types can permit a narrower ref after it is widened through a stored props alias, so create refs with the actual supported root type rather than relying on that assignment for safety.

  Legacy Primer React accepted `target`/`rel` in its types but placed them on the span for removable links, losing new-tab behavior. The Tailwind implementation deliberately corrects that runtime bug instead of preserving it. Keep any needed new-window warning in consumer-authored accessible link content; setting `target="_blank"` alone does not announce the destination behavior.

  ```tsx
  const tokenRef = React.useRef<HTMLElement>(null)

  <Token
    as="a"
    href="/issues"
    target="_blank"
    rel="noopener noreferrer"
    text="Issues (opens in a new tab)"
    onRemove={canRemove ? removeFilter : undefined}
    hideRemoveButton={hideRemoval}
    ref={tokenRef}
  />
  ```

  No separate inner-action ref API is added. Do not assume `tokenRef.current` has anchor/button-only properties; narrow the actual DOM node if those are needed.
