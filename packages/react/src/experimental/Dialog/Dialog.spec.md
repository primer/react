# Dialog — 4-Layer Component Spec

> **Status:** Draft
> **Issue:** [core-ux#2267](https://github.com/github/core-ux/issues/2267) > **Authors:** Lukas Oppermann
> **Last updated:** 2026-04-27

## Overview

This document defines the Dialog component across all four layers of the [modular component architecture](https://github.com/github/primer/issues/6546):

| Layer | Name            | What it provides                                                                  |
| ----- | --------------- | --------------------------------------------------------------------------------- |
| 4     | **Hooks**       | Behavioral primitives — state, keyboard, focus, ARIA attributes                   |
| 3     | **Foundations** | Compound hook with prop-getters — consumer controls markup, foundation wires a11y |
| 2     | **Parts**       | Primer-styled compositional components                                            |
| 1     | **Ready-made**  | Props-based API — drop in and go                                                  |

Each layer builds on the one below. Most consumers use Layer 1. Teams needing custom layouts use Layer 2. Teams needing custom visuals use Layer 3. Teams needing full control over markup use Layer 4.

Dialog is the first component to go through this process, so the patterns established here will inform all subsequent components.

---

## Web Standards Baseline

The spec is grounded in two web standards. Where we follow them, we don't need to justify it. Where we deviate, we document why.

### HTML `<dialog>` element

The native `<dialog>` element ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)) provides significant built-in behavior when used with `showModal()`:

| Capability                      | How it works                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------- |
| **Modal behavior**              | Background becomes inert — no interaction possible outside the dialog        |
| **Focus trapping**              | Tab/Shift+Tab cycle within the dialog automatically                          |
| **Escape to close**             | Fires a `cancel` event, closes the dialog                                    |
| **Top layer rendering**         | Rendered above all other content, no z-index management needed               |
| **`::backdrop` pseudo-element** | Styleable backdrop behind the modal                                          |
| **`autofocus` attribute**       | Focuses the marked element when the dialog opens                             |
| **Focus restoration**           | Returns focus to the previously-focused element on close                     |
| **`closedby` attribute**        | Controls which gestures can close the dialog (`any`, `closerequest`, `none`) |
| **Form integration**            | `<form method="dialog">` closes the dialog on submit, sets `returnValue`     |
| **`returnValue`**               | String value set when the dialog is closed via form submission               |

**Browser support:** `<dialog>` and `showModal()` are supported in all evergreen browsers. The `closedby` attribute is newer (Chrome 134+, Firefox 137+) — may need a polyfill or fallback for older browsers.

### ARIA APG Dialog (Modal) Pattern

The [APG dialog-modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) defines the accessibility contract:

#### Roles, States, and Properties

| Requirement                       | Details                                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Container has `role="dialog"`     | Native `<dialog>` provides this implicitly                                                                                                                         |
| `aria-modal="true"`               | Set on the dialog container. Native `showModal()` sets this implicitly                                                                                             |
| `aria-labelledby` or `aria-label` | References a visible title element, or provides a direct label                                                                                                     |
| `aria-describedby` (optional)     | References content describing the dialog's purpose. Omit when content has complex semantic structure (lists, tables) — screen readers announce it as a flat string |

#### Keyboard Interaction

| Key           | Behavior                                                                              |
| ------------- | ------------------------------------------------------------------------------------- |
| **Tab**       | Moves focus to the next tabbable element inside the dialog. Wraps from last to first. |
| **Shift+Tab** | Moves focus to the previous tabbable element. Wraps from first to last.               |
| **Escape**    | Closes the dialog.                                                                    |

#### Focus Management

1. **On open:** Focus moves to an element inside the dialog. The best target depends on content:
   - First focusable element (default)
   - A static element at the top (`tabindex="-1"`) if content is complex/semantic
   - The least destructive action button for irreversible operations
   - The most likely-used element (e.g., OK button) for simple confirmations
2. **On close:** Focus returns to the element that invoked the dialog, unless:
   - That element no longer exists → focus a logical alternative
   - Workflow design makes a different target more appropriate
3. **Close button:** Strongly recommended — a visible button with `role="button"` that closes the dialog

### What native `<dialog>` gives us for free

When we use `<dialog>` with `showModal()`, we get most ARIA APG requirements automatically:

- ✅ `role="dialog"` (implicit)
- ✅ `aria-modal="true"` (implicit)
- ✅ Focus trapping (Tab/Shift+Tab cycle)
- ✅ Escape to close (`cancel` event)
- ✅ Top layer rendering (no Portal needed)
- ✅ Background inert (no manual `aria-hidden` on siblings)
- ✅ `::backdrop` styling
- ✅ Focus restoration on close
- ✅ `autofocus` support

**We still need to provide:**

- `aria-labelledby` / `aria-label` (connect to title element)
- `aria-describedby` (optional, connect to description element)
- Close button (visible, keyboard accessible)
- Scroll lock on body (native `inert` prevents interaction but doesn't prevent scroll in all browsers)
- Animation (open/close transitions)
- Responsive positioning (center, bottom sheet, fullscreen on narrow)

---

## Layer 4: Hooks

Hooks provide behavioral building blocks with zero markup or styling. They return state, event handlers, and ARIA attributes that consumers wire into their own elements.

**Import:** `@primer/react/hooks`

### `useDialog`

Manages the core dialog lifecycle: open/close state, scroll lock, and focus restoration.

```ts
interface UseDialogOptions {
  /**
   * Whether the dialog is open.
   * When using native <dialog>, this controls showModal()/close() calls.
   */
  open: boolean

  /**
   * Called when the dialog requests to close.
   * Receives the gesture that triggered the close.
   * The dialog does NOT close until `open` is set to `false` — this is a request, not a command.
   */
  onClose: (gesture: 'escape' | 'close-button' | 'backdrop') => void

  /**
   * Element to focus when the dialog opens.
   * Falls back to the first focusable element, then the dialog itself.
   * @default undefined (auto-detect)
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>

  /**
   * Element to return focus to when the dialog closes.
   * Falls back to the element that was focused before the dialog opened.
   * @default undefined (auto-restore)
   */
  returnFocusRef?: React.RefObject<HTMLElement | null>

  /**
   * Whether clicking the backdrop closes the dialog.
   * @default false
   */
  closeOnBackdropClick?: boolean
}

interface UseDialogReturn {
  /** Ref to attach to the <dialog> element */
  dialogRef: React.RefObject<HTMLDialogElement | null>

  /** Props to spread onto the <dialog> element */
  dialogProps: {
    role: 'dialog' | 'alertdialog'
    'aria-modal': true
    'aria-label'?: string
  }

  /** Call to programmatically close the dialog */
  close: (gesture: 'escape' | 'close-button' | 'backdrop') => void

  /** Whether the dialog is currently open */
  isOpen: boolean
}

function useDialog(options: UseDialogOptions): UseDialogReturn
```

**Behavior:**

- Calls `dialogRef.current.showModal()` when `open` transitions to `true`
- Calls `dialogRef.current.close()` when `open` transitions to `false`
- Intercepts the native `cancel` event (Escape key): calls `preventDefault()` to prevent the browser from closing the dialog, then calls `onClose('escape')`. The dialog only closes when the consumer sets `open` to `false`. This is the **controlled close contract** — React state is the single source of truth.
- Manages scroll lock on `document.body` while open
- Handles initial focus placement (respects `initialFocusRef` if provided, then looks for an element with `autofocus`, then first focusable element)
- Restores focus on close (respects `returnFocusRef`, falls back to previously-focused element)
- Handles backdrop click detection when `closeOnBackdropClick` is `true`

**Controlled close contract:**

The dialog is fully controlled by the `open` prop. Native close paths are intercepted:

- **`cancel` event (Escape):** Intercepted with `preventDefault()`, routed to `onClose('escape')`
- **`close` event:** Should only fire as a result of our `dialogRef.close()` call when `open` becomes `false`
- **`<form method="dialog">`:** Not supported in this API. Forms inside the dialog should use standard submit handlers and call `onClose` explicitly. This avoids the dialog closing outside React's control.
- **`requestClose()`:** Not used. We implement close-request semantics via `onClose` callback.
- **`returnValue`:** Not surfaced. Consumers track form/button state in React state, not via the native `returnValue` string.

**Why not just use native `<dialog>` directly?**

Native `<dialog>` handles most of this, but the hook adds:

- Controlled open/close state (React-managed, not imperative) with cancel event interception
- `initialFocusRef` / `returnFocusRef` for precise focus control beyond what `autofocus` offers
- Scroll lock on body (native makes background inert but doesn't prevent scroll)
- Consistent close gesture reporting (`'escape' | 'close-button' | 'backdrop'`)
- Backdrop click detection (native `<dialog>` fires `click` on the dialog element itself when backdrop is clicked — needs coordinate-based detection)

> **Layer 4 is native-dialog-specific.** This hook is designed for use with `<dialog>` + `showModal()`. It is not a generic modal hook. Consumers who need full control over markup (no `<dialog>` element) should use the individual behavioral hooks (`useFocusTrap`, `useScrollLock`, `useOnEscapePress`) directly.

### `useFocusTrap`

Traps focus within a container. Wraps Tab/Shift+Tab to cycle through focusable elements.

```ts
interface UseFocusTrapOptions {
  /** Ref to the container element */
  containerRef: React.RefObject<HTMLElement | null>

  /** Element to focus initially */
  initialFocusRef?: React.RefObject<HTMLElement | null>

  /** Whether the trap is active */
  disabled?: boolean

  /** Restore focus to the previously-focused element on cleanup */
  restoreFocusOnCleanUp?: boolean

  /** Element to return focus to on cleanup (overrides restoreFocusOnCleanUp) */
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

function useFocusTrap(options: UseFocusTrapOptions): void
```

**When used with native `<dialog>`:** This hook is unnecessary when the dialog is opened via `showModal()`, which provides native focus trapping. It exists for cases where consumers build dialog-like UI without the native element (e.g., non-modal dialogs, custom overlays).

> **Deviation from native:** We retain this hook because `showModal()` focus trapping doesn't support `initialFocusRef` — it uses the `autofocus` attribute or falls back to the dialog element itself. Our hook enables ref-based focus targeting, which is more flexible in React.

### `useScrollLock`

Prevents background scrolling while the dialog is open.

```ts
interface UseScrollLockOptions {
  /** Whether the scroll lock is active */
  enabled: boolean
}

function useScrollLock(options: UseScrollLockOptions): void
```

**Behavior:**

- Sets `overflow: hidden` on `document.body`
- Compensates for scrollbar removal to prevent layout shift (sets `padding-right` equal to scrollbar width)
- Cleans up when disabled or unmounted
- Handles nested dialogs — only removes scroll lock when the last dialog closes

> **Deviation from native:** Native `showModal()` makes background content inert (no interaction), but does not prevent scroll on all browsers. We add explicit scroll lock for consistent behavior.

---

## Layer 3: Foundations

A compound hook returning prop-getters. The consumer controls all markup — the foundation wires up ARIA relationships, focus management, and keyboard behavior.

Per [core-ux#2272](https://github.com/github/core-ux/issues/2272): prop-getters are the public API; context is an internal implementation detail only.

**Import:** `@primer/react/foundations/experimental`

### `useDialog`

```ts
interface UseDialogOptions {
  /** Whether the dialog is open */
  open: boolean

  /** Called when the dialog requests to close (controlled — dialog stays open until `open` becomes false) */
  onClose: (gesture: 'escape' | 'close-button' | 'backdrop') => void

  /** ARIA role */
  role?: 'dialog' | 'alertdialog'

  /** Accessible label when no visible title is used */
  'aria-label'?: string

  /** Element to focus when the dialog opens */
  initialFocusRef?: React.RefObject<HTMLElement | null>

  /** Element to return focus to on close */
  returnFocusRef?: React.RefObject<HTMLElement | null>

  /** Whether clicking the backdrop closes the dialog. @default false */
  closeOnBackdropClick?: boolean
}

interface UseDialogReturn {
  /** Props for the <dialog> element */
  getDialogProps: () => {
    ref: React.RefCallback<HTMLDialogElement>
    role: 'dialog' | 'alertdialog'
    'aria-modal': true
    'aria-labelledby'?: string
    'aria-label'?: string
    'aria-describedby'?: string
    onClick: (e: React.MouseEvent) => void
  }

  /** Props for the title element (auto-wires aria-labelledby) */
  getTitleProps: () => {
    id: string
  }

  /** Props for the description element (auto-wires aria-describedby). Only call if description is present. */
  getDescriptionProps: () => {
    id: string
  }

  /** Props for the close button */
  getCloseProps: () => {
    type: 'button'
    onClick: () => void
  }

  /** Props for a scrollable body region */
  getBodyProps: () => {
    'aria-labelledby': string
    tabIndex: 0
    role: 'region'
  }

  /** Whether the dialog is currently open (reflects DOM state) */
  isOpen: boolean

  /** Programmatically request close */
  close: (gesture: 'escape' | 'close-button' | 'backdrop') => void
}

function useDialog(options: UseDialogOptions): UseDialogReturn
```

### Usage

```tsx
import {useDialog} from '@primer/react/foundations/experimental'

function MyCustomDialog({open, onClose}) {
  const dialog = useDialog({open, onClose})

  return (
    <dialog {...dialog.getDialogProps()}>
      <header>
        <h2 {...dialog.getTitleProps()}>Confirm changes</h2>
        <p {...dialog.getDescriptionProps()}>This action cannot be undone.</p>
        <button {...dialog.getCloseProps()} aria-label="Close">
          ✕
        </button>
      </header>
      <div {...dialog.getBodyProps()}>
        <p>Are you sure you want to proceed?</p>
      </div>
      <footer>
        <button onClick={() => onClose('close-button')}>Cancel</button>
        <button>Delete</button>
      </footer>
    </dialog>
  )
}
```

### Behavior

- Internally uses Layer 4 hooks: `useScrollLock` for scroll lock, native `<dialog>` for focus trapping + Escape
- Intercepts the native `cancel` event (`preventDefault()`) to maintain controlled close contract
- Auto-generates stable IDs for `aria-labelledby` and `aria-describedby` wiring
- `getDialogProps()` returns a ref callback that manages `showModal()`/`close()` based on `open` prop
- `getBodyProps()` returns `tabIndex: 0` and `role: "region"` so the scrollable body is keyboard-accessible and announced
- Backdrop click detection via `onClick` on the `<dialog>` element (comparing click coordinates to dialog bounds)

### Accessible name contract

Every dialog MUST have an accessible name:

- If `getTitleProps()` is spread onto an element → `aria-labelledby` is auto-wired (preferred)
- If no title → `aria-label` option is required
- A dev-mode warning fires if neither is provided

> **Deviation from current implementation:** The current Dialog uses `<div role="dialog">` rendered inside a Portal. Foundations switch to native `<dialog>` because:
>
> 1. Native `<dialog>` with `showModal()` renders in the top layer — no Portal or z-index needed
> 2. Background is automatically inert — no manual `aria-hidden` management
> 3. Focus trapping is built in — less JS, fewer edge cases
> 4. `::backdrop` pseudo-element is natively styleable
>
> The Portal approach was necessary before native `<dialog>` had broad support. That's no longer the case.

### Minimal CSS reset

Foundations ship with a minimal CSS reset — only what's needed to remove browser default styling:

```css
/* Foundation reset — no visual opinion */
dialog[data-dialog-foundation] {
  border: none;
  padding: 0;
  background: transparent;
  max-width: unset;
  max-height: unset;
}

dialog[data-dialog-foundation]::backdrop {
  background: transparent;
}
```

> **Important:** A Foundation-level dialog with a transparent backdrop is semantically modal (background is inert) but visually non-modal. Per ARIA APG, `aria-modal="true"` should only be set when background content is **both** non-interactive and visually obscured. Consumers using Foundations directly **must** provide visible backdrop styling to meet this requirement. Layer 2 Parts handle this automatically with Primer's `--overlay-backdrop-bgColor` token.

---

## Layer 2: Parts

Primer-styled compositional components. These are styled wrappers around Layer 3 Foundations, using Primer design tokens and CSS modules.

**Import:** `@primer/react`

### Component tree

Same structure as Foundations, but with Primer visual styling applied:

```
Dialog.Root         ← Styled DialogRoot
├── Dialog.Content  ← Styled DialogContent (width, height, border-radius, shadow, animation)
│   ├── Dialog.Header    ← Styled DialogHeader (padding, border-bottom)
│   │   ├── Dialog.Title       ← Styled DialogTitle (font-size, font-weight)
│   │   ├── Dialog.Subtitle    ← Styled DialogDescription (smaller, muted)
│   │   └── Dialog.CloseButton ← Styled DialogClose (IconButton with XIcon)
│   ├── Dialog.Body      ← Styled DialogBody (padding, scroll, overflow border)
│   └── Dialog.Footer    ← Styled DialogFooter (padding, flex layout, gap)
```

### API

Parts use the same props as their Foundation counterparts, plus styling props:

```tsx
// Dialog.Root — extends DialogRoot
interface DialogRootPartProps extends DialogRootProps {
  // No additional props — styling is handled via CSS modules
}

// Dialog.Content — extends DialogContent
interface DialogContentPartProps extends DialogContentProps {
  /** Width preset */
  width?: 'small' | 'medium' | 'large' | 'xlarge'
  /** Height preset */
  height?: 'small' | 'large' | 'auto'
  /** Position */
  position?: 'center' | 'left' | 'right' | ResponsiveValue<'left' | 'right' | 'bottom' | 'fullscreen' | 'center'>
  /** Vertical alignment (only when position is 'center') */
  align?: 'top' | 'center' | 'bottom'
}
```

### Usage

```tsx
import {Dialog} from '@primer/react'

function MyDialog({open, onClose}) {
  return (
    <Dialog.Root open={open} onClose={onClose}>
      <Dialog.Content width="large">
        <Dialog.Header>
          <Dialog.Title>Confirm changes</Dialog.Title>
          <Dialog.Subtitle>This action cannot be undone.</Dialog.Subtitle>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <p>Are you sure you want to proceed?</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => onClose('close-button')}>Cancel</Button>
          <Button variant="danger">Delete</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
```

### Styling

Parts use Primer design tokens via CSS modules:

| Token area                   | Applied to                                     |
| ---------------------------- | ---------------------------------------------- |
| `--overlay-bgColor`          | Dialog.Content background                      |
| `--overlay-backdrop-bgColor` | `::backdrop` background                        |
| `--shadow-floating-small`    | Dialog.Content box-shadow                      |
| `--borderRadius-large`       | Dialog.Content border-radius                   |
| `--borderColor-default`      | Header/body divider, body/footer scroll border |
| `--text-body-size-medium`    | Dialog.Title font-size                         |
| `--text-title-weight-large`  | Dialog.Title font-weight                       |
| `--text-body-size-small`     | Dialog.Subtitle font-size                      |
| `--fgColor-muted`            | Dialog.Subtitle color                          |
| `--base-size-*`              | Padding, gaps                                  |

### Animations

Parts include open/close animations using the same keyframes as the current Dialog:

- **Center:** Scale fade (`scale(0.5)` → `scale(1)` + opacity)
- **Left/Right:** Slide in from edge
- **Bottom (narrow):** Slide up
- Respects `prefers-reduced-motion: reduce`

---

## Layer 1: Ready-made

The props-based API that most consumers use. Implemented as a thin wrapper around Layer 2 Parts.

**Import:** `@primer/react`

### API

```tsx
interface DialogProps {
  /** Dialog title. Also serves as aria-label. */
  title?: React.ReactNode
  /** Subtitle rendered below the title. Also serves as aria-describedby. */
  subtitle?: React.ReactNode
  /** Called when the dialog is closed via any gesture */
  onClose: (gesture: 'close-button' | 'escape') => void
  /** ARIA role */
  role?: 'dialog' | 'alertdialog'
  /** Width preset */
  width?: 'small' | 'medium' | 'large' | 'xlarge'
  /** Height preset */
  height?: 'small' | 'large' | 'auto'
  /** Position */
  position?: 'center' | 'left' | 'right' | ResponsiveValue<...>
  /** Vertical alignment */
  align?: 'top' | 'center' | 'bottom'
  /** Buttons to render in the footer */
  footerButtons?: DialogButtonProps[]
  /** Element to focus on open */
  initialFocusRef?: React.RefObject<HTMLElement | null>
  /** Element to return focus to on close */
  returnFocusRef?: React.RefObject<HTMLElement | null>
  /** Custom header renderer */
  renderHeader?: React.FunctionComponent<DialogHeaderProps>
  /** Custom body renderer */
  renderBody?: React.FunctionComponent<DialogProps>
  /** Custom footer renderer */
  renderFooter?: React.FunctionComponent<DialogProps>
  /** Content */
  children: React.ReactNode
}
```

### How it maps to Parts

The Ready-made `Dialog` is implemented entirely using Layer 2 Parts:

```tsx
function Dialog({ title, subtitle, onClose, children, footerButtons, width, height, position, align, ...rest }) {
  return (
    <Dialog.Root open onClose={onClose} role={rest.role}>
      <Dialog.Content width={width} height={height} position={position} align={align}>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          {subtitle && <Dialog.Subtitle>{subtitle}</Dialog.Subtitle>}
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>{children}</Dialog.Body>
        {footerButtons?.length > 0 && (
          <Dialog.Footer>
            {footerButtons.map(btn => <Button key={...} {...btn} />)}
          </Dialog.Footer>
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}
```

### Migration

The Ready-made API should remain backward-compatible with the current `Dialog`. Key differences:

- Underlying implementation changes from `<div role="dialog">` + Portal to native `<dialog>` + `showModal()`
- Scroll lock mechanism changes (same visible behavior, different implementation)
- `renderHeader`/`renderBody`/`renderFooter` custom renderers continue to work but consumers are encouraged to use Layer 2 Parts for custom layouts instead

---

## Accessibility Requirements

Consolidated requirements that all layers must satisfy:

### Must have

| Requirement                             | Layer 4 (Hooks)                            | Layer 3 (Foundations)                     | Layer 2 (Parts)      | Layer 1 (Ready-made)            |
| --------------------------------------- | ------------------------------------------ | ----------------------------------------- | -------------------- | ------------------------------- |
| `role="dialog"` or `role="alertdialog"` | Returns in `dialogProps`                   | Set on `<dialog>`                         | Inherited            | Inherited                       |
| `aria-modal="true"`                     | Returns in `dialogProps`                   | Implicit from `showModal()`               | Inherited            | Inherited                       |
| `aria-labelledby` → title               | Consumer wires                             | Auto-wired via context                    | Auto-wired           | Auto-wired from `title` prop    |
| `aria-describedby` → description        | Consumer wires                             | Auto-wired if `DialogDescription` present | Auto-wired           | Auto-wired from `subtitle` prop |
| Focus trap (Tab/Shift+Tab)              | Consumer implements or uses `useFocusTrap` | Native `showModal()`                      | Inherited            | Inherited                       |
| Escape closes dialog                    | Consumer handles                           | Native `cancel` event                     | Inherited            | Inherited                       |
| Focus moves into dialog on open         | `useDialog` manages                        | Managed by `DialogRoot`                   | Inherited            | Inherited                       |
| Focus returns on close                  | `useDialog` manages                        | Managed by `DialogRoot`                   | Inherited            | Inherited                       |
| Visible close button                    | Consumer provides                          | `DialogClose` component                   | `Dialog.CloseButton` | Built-in (X icon)               |
| Background inert                        | Consumer manages                           | Native `showModal()`                      | Inherited            | Inherited                       |
| Scroll lock                             | `useScrollLock` hook                       | Managed by `DialogRoot`                   | Inherited            | Inherited                       |

### Keyboard

| Key       | Behavior                           | Layer that implements                           |
| --------- | ---------------------------------- | ----------------------------------------------- |
| Tab       | Next focusable element (wraps)     | Native `<dialog>` (L3+) or `useFocusTrap` (L4)  |
| Shift+Tab | Previous focusable element (wraps) | Native `<dialog>` (L3+) or `useFocusTrap` (L4)  |
| Escape    | Closes dialog                      | Native `cancel` event (L3+) or `useDialog` (L4) |

### Focus management rules

1. **Initial focus:** `initialFocusRef` if provided, then first element with `autofocus`, then first focusable element, then the dialog itself
2. **Focus restoration:** `returnFocusRef` if provided, then the element that was focused before the dialog opened
3. **Nested dialogs:** Each dialog maintains its own focus trap. Closing the top dialog restores focus within the parent dialog.

---

## Deviations from Web Standards

### Using native `<dialog>` (Layer 3 and up)

We use native `<dialog>` with `showModal()` as the foundation. This is the standard, not a deviation.

### Scroll lock on body

| Standard behavior                                                                                                               | Our behavior                                                                              | Why                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `showModal()` makes background inert (no interaction) but scroll position may still respond to scroll gestures in some browsers | We explicitly set `overflow: hidden` on `document.body` with scrollbar width compensation | Consistent behavior across browsers. Users scrolling with a trackpad/mouse wheel should not see the background move behind the dialog. |

### Controlled open/close state

| Standard behavior                                 | Our behavior                                                        | Why                                                                                                                                                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `showModal()` / `close()` are imperative DOM APIs | We use a controlled `open` prop that calls these methods internally | React's model is declarative. A controlled prop integrates with React state management, conditional rendering, and transitions. Imperative `showModal()` doesn't compose with React's rendering lifecycle. |

### `initialFocusRef` / `returnFocusRef`

| Standard behavior                                                                            | Our behavior                                 | Why                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autofocus` attribute on the target element; focus returns to the previously-focused element | `initialFocusRef` and `returnFocusRef` props | `autofocus` requires modifying the target element's markup. Ref-based focus control is more flexible in React — the parent component can decide where focus goes without the child knowing. `returnFocusRef` enables workflow-based focus restoration (e.g., after a delete dialog, focus moves to the next item, not the delete button). |

### Backdrop click handling

| Standard behavior                                                                                                               | Our behavior                                                                                                                                                                                                     | Why                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `closedby="any"` attribute enables light dismiss. Clicking the backdrop fires a `click` event on the `<dialog>` element itself. | We detect backdrop clicks by comparing `event.target === event.currentTarget` on the backdrop/dialog, with mousedown tracking to prevent false positives from drags. `closeOnBackdropClick` defaults to `false`. | The native `closedby` attribute is too new for reliable cross-browser use (Chrome 134+, Firefox 137+). Our approach works everywhere and avoids accidental dismissal — important for data-loss-prevention dialogs. Defaulting to `false` follows the principle of not losing user work. |

### Portal rendering (Layer 2+, removed in Layer 3)

| Standard behavior                      | Our behavior                                                                                                  | Why                                                                                                                                                                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `showModal()` renders in the top layer | Layer 3 uses native top layer. Layer 2 may optionally use Portal for backward compatibility during migration. | Top layer is the correct solution. Portal was needed before `<dialog>` had broad support. During migration, Layer 2 may retain Portal support for consumers with z-index dependencies, but new usage should rely on native top layer. |

### Heading level (`<h2>` instead of `<h1>`)

| Standard behavior                    | Our behavior                                               | Why                                                                                                                                                                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No spec requirement on heading level | Foundation uses `<h2>`, current implementation uses `<h1>` | Dialogs are overlays on pages that already have an `<h1>`. Using `<h1>` in a dialog breaks the document outline hierarchy. `<h2>` correctly positions the dialog title as a sub-section. Screen reader users navigating by headings get a coherent structure. |

---

## Open Questions

1. **`closedby` attribute adoption timeline:** When can we rely on native `closedby` instead of manual backdrop click detection? Need to check GitHub's browser support policy.
2. **Non-modal dialogs:** This spec covers modal dialogs only. Should Layer 3/4 also support `show()` (non-modal)? The hook layer could support both, with the foundation defaulting to modal.
3. **Animation on close:** Native `<dialog>` doesn't have a built-in close animation. We need CSS `@starting-style` or the `beforetoggle`/`toggle` events to animate close transitions. Browser support for these is still maturing.
4. **ConfirmationDialog:** Should it be a Layer 1 variant of Dialog, or a separate component? Current implementation is separate. Recommendation: Layer 1 variant with `role="alertdialog"` and a `confirm`/`cancel` button pattern.
5. **Nested dialogs and stacking:** Multiple modals open simultaneously — how do layers interact? Native `<dialog>` handles top layer stacking, but we need to coordinate scroll lock, Escape handling, and focus restoration across the stack.

## Resolved Decisions

1. **Controlled close contract:** The dialog is fully controlled by the `open` prop. Native close paths (`cancel` event) are intercepted with `preventDefault()` and routed through `onClose`. `<form method="dialog">` and `returnValue` are explicitly not supported — React state is the source of truth.
2. **Layer 4 scope:** `useDialog` is native-dialog-specific (requires `<dialog>` + `showModal()`). Consumers who need full markup control without `<dialog>` should use individual hooks (`useFocusTrap`, `useScrollLock`, `useOnEscapePress`) directly.
3. **Accessible name requirement:** Every dialog must have an accessible name. `DialogTitle` auto-wires `aria-labelledby`; if no title is present, `aria-label` is required. Dev-mode warning fires if neither is provided.
4. **Focus precedence:** `initialFocusRef` → `autofocus` attribute → first focusable element → dialog itself. Consistent across all layers.
5. **Foundation backdrop:** Transparent by default. Consumers must provide visible backdrop styling to meet ARIA modal requirements. Layer 2 handles this automatically.
6. **Heading level:** `<h2>` in Foundations, not `<h1>`. Dialogs are overlays on pages that already have a top-level heading.
