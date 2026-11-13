# Token

`Token` displays compact filter or selection content with optional leading visuals, selection state, and removal behavior. `IssueLabelToken` provides the same token interaction model with a custom label color.

Import: `import {Token, IssueLabelToken, TokenBase} from '@primer/react-tailwind/Token'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {Token} from '@primer/react-tailwind/Token'
;<Token text="bug" isSelected onRemove={() => removeFilter('bug')} />
```

## API notes

Named sizes are `small`, `medium`, `large`, and `xlarge`. `onRemove` receives no arguments; `id` is applied to the root element.

`TokenBase` exposes the shared base API. `IssueLabelToken` adds `fillColor?: string` and derives light- and dark-theme backgrounds, foregrounds, borders, hover states, and selection treatment from that color.

## Composition

Use tokens as filter chips or selected values. Use an interactive parent (`as="button"`, `as="a"`, or `onClick`) when the whole token is actionable. Button tokens default to `type="button"`; pass `type="submit"` or `type="reset"` when that form behavior is intended. For removal, pass `onRemove`; do not add a second nested remove button yourself.

For a non-interactive removable token, `removeButtonLabel` supplies the full accessible name of its separate remove button. Include the remove action, the visible token text, and enough context to identify what will be removed. Without the prop, string text produces `Remove <text>` and non-string text produces the generic `Remove token`; provide a specific label for rich content or localization. This prop does not label the aria-hidden pointer affordance used by interactive tokens.

```tsx
<Token
  text={
    <>
      <VisuallyHidden>Open pull request </VisuallyHidden>#42
    </>
  }
  onRemove={removePullRequest}
  removeButtonLabel="Remove linked pull request #42"
/>
```

### Native props, custom actions, and root refs

Native anchor and button props follow `as`. Custom `as` components retain their required props (for example a router link's `to`) and must forward DOM props and refs.

When `onRemove` is present and `hideRemoveButton` is false, an interactive `Token` or `IssueLabelToken` uses a span shell around the primary action and removal affordance. Link props such as `target`, `rel`, and `download`, button form props such as `name`, `value`, and `formAction`, and custom router props go to the inner action. Global DOM/ARIA/data props, IDs, classes, styles, and non-click event handlers stay on the root; `onClick` goes to the action.

The ref always points to the root. For HTML-root tokens use `React.useRef<HTMLElement>(null)`, not an anchor-only or button-only ref: optional/dynamic removal props can replace the selected root with a span. The types conservatively include this span possibility even if removal is currently hidden or omitted. `TokenBase` never creates the sibling-action shell and retains the selected element's native/custom ref type.

For wrappers that accept different HTML roots, unparameterized `TokenProps` and `IssueLabelTokenProps` include native anchor and button attributes and a span-capable `HTMLElement` ref. These broad types work with interfaces and utilities such as `Omit`, but do not correlate attributes with `as`; the wrapper must pass attributes appropriate to the selected root. Direct JSX with a concrete `as` checks that root, as do explicit types such as `TokenProps<'a'>` or `TokenProps<typeof RouterLink>`. An undefined `as` renders a span, so direct calls with an undefined or optional root reject anchor- and button-only attributes; narrow the root or render conditionally before passing those attributes. For a custom non-HTML root, use an explicit generic and a ref that accepts both that root and `HTMLSpanElement`.

React's structurally typed refs can allow a narrower ref to be widened through a stored props type. Create the ref with the correct root type rather than relying on an assignment to catch an anchor-only or button-only ref.

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

The removable link now preserves new-tab behavior; legacy Primer React placed these attributes on its shell instead. See the alignment notes for the full runtime/ref distinction.

## Accessibility

Interactive tokens expose button or link semantics. `Enter` and `Space` invoke an interactive span's click handler, while `Backspace` and `Delete` invoke `onRemove`. When an interactive token is also removable, its action and pointer removal affordance are composed as sibling targets inside the token shell, avoiding nested controls. `Token` includes removal instructions in its text; `IssueLabelToken` does not, so consumers of an interactive removable issue label must add those instructions to its action's accessible name or description. Non-interactive tokens receive a real, labelled remove button.

## Animation and reduced motion

`Token` has no animation and does not need reduced-motion handling.

## Theming and Tailwind

Use `className` to extend token layout and Primer semantic border/background tokens. Import package styles or compile Tailwind v4 with the package `dist` path in `@source`. `IssueLabelToken` uses package CSS and internal custom properties to preserve arbitrary consumer-provided colors in light, dark, and automatic color modes without requiring generated Tailwind classes.

### Data attributes

`Token` and `IssueLabelToken` expose `data-component="TokenBase"`, `data-cursor-is-interactive`, `data-is-selected`, and `data-size`. The remove affordance exposes `data-component="Token.RemoveButton"`.

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `TokenElement` — Default `'span'`. Element to render. Use `a` or `button` when the token is interactive.
- `disabled`: `boolean` — Prevents interaction with the token and its remove button.
- `download`: `undefined`
- `form`: `undefined`
- `formAction`: `undefined`
- `formEncType`: `undefined`
- `formMethod`: `undefined`
- `formNoValidate`: `undefined`
- `formTarget`: `undefined`
- `hideRemoveButton`: `boolean` — Default `false`. Hides the remove button while `onRemove` still handles removal by keyboard.
- `href`: `undefined`
- `hrefLang`: `undefined`
- `id`: `string | number` — Identifier applied to the root element.
- `isSelected`: `boolean` — Marks the token as the current one in a list of tokens.
- `leadingVisual`: `React.ElementType` — Icon shown before the token's text.
- `media`: `undefined`
- `name`: `undefined`
- `onRemove`: `(() => void)` — Shows a remove button and is called when it is activated.
- `ping`: `undefined`
- `ref`: `Ref<HTMLElement>` — Root ref, including the span shell used by visibly removable actions.
- `referrerPolicy`: `undefined`
- `removeButtonLabel`: `string` — Full accessible name for the separate remove button, including the visible text and item context.
- `size`: `TokenSize` — Height and text size of the token.
- `target`: `undefined`
- `text` (required): `React.ReactNode` — Label shown on the token.
- `type`: `undefined`
- `value`: `undefined`

## IssueLabelToken

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `TokenElement` — Default `'span'`. Element to render. Use `a` or `button` when the token is interactive.
- `disabled`: `boolean` — Prevents interaction with the token and its remove button.
- `download`: `undefined`
- `fillColor`: `string` — Custom hex colour for the token, matching the label it represents.
- `form`: `undefined`
- `formAction`: `undefined`
- `formEncType`: `undefined`
- `formMethod`: `undefined`
- `formNoValidate`: `undefined`
- `formTarget`: `undefined`
- `hideRemoveButton`: `boolean` — Default `false`. Hides the remove button while `onRemove` still handles removal by keyboard.
- `href`: `undefined`
- `hrefLang`: `undefined`
- `id`: `string | number` — Identifier applied to the root element.
- `isSelected`: `boolean` — Marks the token as the current one in a list of tokens.
- `media`: `undefined`
- `name`: `undefined`
- `onRemove`: `(() => void)` — Shows a remove button and is called when it is activated.
- `ping`: `undefined`
- `ref`: `Ref<HTMLElement>` — Root ref, including the span shell used by visibly removable actions.
- `referrerPolicy`: `undefined`
- `removeButtonLabel`: `string` — Full accessible name for the separate remove button, including the visible text and item context.
- `size`: `TokenSize` — Height and text size of the token.
- `target`: `undefined`
- `text` (required): `React.ReactNode` — Label shown on the token.
- `type`: `undefined`
- `value`: `undefined`

## TokenBase

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `TokenElement` — Default `'span'`. Element to render. Use `a` or `button` when the token is interactive. Element or component to render.
- `disabled`: `boolean` — Prevents interaction with the token and its remove button.
- `download`: `undefined`
- `form`: `undefined`
- `formAction`: `undefined`
- `formEncType`: `undefined`
- `formMethod`: `undefined`
- `formNoValidate`: `undefined`
- `formTarget`: `undefined`
- `hideRemoveButton`: `boolean` — Default `false`. Hides the remove button while `onRemove` still handles removal by keyboard.
- `href`: `undefined`
- `hrefLang`: `undefined`
- `id`: `string | number` — Identifier applied to the root element.
- `isSelected`: `boolean` — Marks the token as the current one in a list of tokens.
- `media`: `undefined`
- `name`: `undefined`
- `onRemove`: `(() => void)` — Shows a remove button and is called when it is activated.
- `ping`: `undefined`
- `ref`: `(Ref & CompatibleRootRef<ComponentRef<As>, Ref>)`
- `referrerPolicy`: `undefined`
- `size`: `TokenSize` — Default `'medium'`. Height and text size of the token.
- `target`: `undefined`
- `text` (required): `React.ReactNode` — Label shown on the token.
- `type`: `undefined`
- `value`: `undefined`

## Differences from `@primer/react`

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
