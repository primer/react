# Layer Patterns — Modular Component Architecture

Concrete code patterns for each layer. Use these as templates when building new components.

---

## Layer 4 — Hooks

Individual, single-purpose behaviour hooks. Not component-specific. Reusable across any component that needs the behaviour.

### Pattern

```tsx
import {useEffect, useRef} from 'react'

/**
 * <Description of what this hook does.>
 * <When to use it.>
 */
export function use<Behaviour>(enabled: boolean): void {
  // Implementation
}
```

### Example: useScrollLock

```tsx
import {useEffect, useRef} from 'react'

let activeScrollLocks = 0

/**
 * Prevents background scrolling while active.
 * Compensates for scrollbar removal to prevent layout shift.
 * Handles nested usage via ref counting — scroll lock is only
 * removed when the last active lock is released.
 */
export function useScrollLock(enabled: boolean): void {
  const isLocked = useRef(false)

  useEffect(() => {
    if (enabled && !isLocked.current) {
      isLocked.current = true
      activeScrollLocks++

      if (activeScrollLocks === 1) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        document.body.style.setProperty('--dialog-scrollbar-gutter', `${scrollbarWidth}px`)
        document.body.style.paddingRight = `${scrollbarWidth}px`
        document.body.style.overflow = 'hidden'
      }

      return () => {
        isLocked.current = false
        activeScrollLocks--

        if (activeScrollLocks === 0) {
          document.body.style.removeProperty('--dialog-scrollbar-gutter')
          document.body.style.removeProperty('padding-right')
          document.body.style.removeProperty('overflow')
        }
      }
    }
  }, [enabled])
}
```

### Rules

- One behaviour per hook
- No knowledge of which component consumes them
- No styling or markup opinions
- API: takes options, returns refs/callbacks/prop objects
- File: `packages/react/src/hooks/use<Behaviour>.ts`
- Test: `packages/react/src/hooks/__tests__/use<Behaviour>.test.ts`

### Nested/ref-counted hooks

When a hook manages a global side-effect (like scroll lock), use a module-level ref counter so nested usage works correctly. Only apply the side-effect when the count goes from 0→1, and only remove it when the count goes from 1→0.

---

## Layer 3 — Foundations

### 3a: Compound hook with prop-getters

A single hook that composes L4 hooks and returns prop-getter functions. The consumer owns all markup.

#### Pattern

```tsx
import {useCallback, useEffect, useId, useRef} from 'react'

// --- Types ---

type CloseGesture = 'escape' | 'close-button' | 'backdrop'

export interface Use<Component>Options {
  /** Core behavioural props */
  open: boolean
  onClose: (gesture: CloseGesture) => void
  role?: 'dialog' | 'alertdialog'
  'aria-label'?: string
  initialFocusRef?: React.RefObject<HTMLElement | null>
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

export interface Use<Component>Return {
  /** Prop-getter for the root element */
  get<Component>Props: () => <Component>Props
  /** Prop-getter for the title element — auto-wires aria-labelledby */
  getTitleProps: () => TitleProps
  /** Prop-getter for the description element — auto-wires aria-describedby */
  getDescriptionProps: () => DescriptionProps
  /** Prop-getter for the close control */
  getCloseProps: () => CloseProps
  /** Prop-getter for the scrollable body region */
  getBodyProps: () => BodyProps
  /** Whether the component is currently active */
  isOpen: boolean
  /** Programmatically request close */
  close: (gesture: CloseGesture) => void
}

// --- Hook ---

export function use<Component>(options: Use<Component>Options): Use<Component>Return {
  // 1. Compose L4 hooks (useScrollLock, useFocusTrap, etc.)
  // 2. Generate IDs for ARIA cross-referencing
  // 3. Manage lifecycle (open/close, focus save/restore)
  // 4. Return prop-getters that wire everything together

  const titleId = useId()
  const descriptionId = useId()

  // ... implementation ...

  return {
    get<Component>Props,
    getTitleProps,
    getDescriptionProps,
    getCloseProps,
    getBodyProps,
    isOpen: options.open,
    close,
  }
}
```

#### Prop-getter pattern

Each prop-getter returns a plain object of HTML/ARIA attributes that the consumer spreads onto their element:

```tsx
const getTitleProps = useCallback((): TitleProps => {
  return {id: titleId}
}, [titleId])

const getCloseProps = useCallback((): CloseProps => {
  return {
    type: 'button',
    onClick: () => onClose('close-button'),
  }
}, [onClose])
```

#### Consumer usage

```tsx
const dialog = useDialog({open, onClose})

<dialog {...dialog.getDialogProps()}>
  <h2 {...dialog.getTitleProps()}>Title</h2>
  <p {...dialog.getDescriptionProps()}>Subtitle</p>
  <div {...dialog.getBodyProps()}>Content</div>
  <button {...dialog.getCloseProps()}>✕</button>
</dialog>
```

### 3b: Foundation CSS

Minimal CSS reset. Zero visual opinion. Uses `:where()` for zero specificity.

```css
/* Foundation reset — no visual opinion.
 * Removes browser defaults that interfere with correct behaviour.
 * Uses :where() for zero specificity so consumer styles always win. */

:where(dialog[data-<component>-foundation]) {
  border: none;
  padding: 0;
  background: transparent;
  max-width: unset;
  max-height: unset;
  color: inherit;
}

:where(dialog[data-<component>-foundation])::backdrop {
  background: transparent;
}
```

The foundation hook adds the `data-<component>-foundation` attribute via its root prop-getter so the reset CSS applies automatically.

### Rules

- Compose L4 hooks internally — don't re-implement behaviours
- Generate stable IDs via `useId()` for ARIA cross-referencing
- Always return `aria-labelledby` and `aria-describedby` referencing generated IDs — if the element doesn't exist, the attribute is silently ignored
- Dev-mode warning (via `queueMicrotask`) if no accessible name is provided
- Intercept native events (e.g., `cancel` on `<dialog>`) to maintain controlled component contract
- Context is internal only — never exposed to consumers
- File: `packages/react/src/foundations/experimental/<Component>/use<Component>.ts`

### Controlled component contract (critical)

For components that wrap native elements with built-in behaviour (like `<dialog>`), the compound hook must maintain a fully controlled contract:

1. **Opening**: Call `showModal()` only when `open === true` and `dialog.open === false`
2. **Closing**: Call `dialog.close()` when `open === false` and `dialog.open === true`
3. **Escape handling**: Intercept the native `cancel` event, call `preventDefault()`, and fire `onClose('escape')` instead of allowing the native close
4. **Close guard**: Listen for the native `close` event. If `open` is still `true` but the dialog was closed externally (e.g., `dialog.close()` called directly), re-open it to maintain the controlled contract
5. **Backdrop click detection**: For `<dialog>`, the backdrop is the dialog element's own area outside its content box. Detect backdrop clicks by checking `e.target === dialog` (click on the dialog itself, not a child), then verify the click coordinates fall outside the content box rect
6. **Focus lifecycle**: Save `document.activeElement` before opening; restore focus to `returnFocusRef` or the previously-focused element on close

These invariants ensure the component cannot be closed or modified except through the controlled `open` prop and `onClose` callback.

### `aria-describedby` wiring pattern

Always assign the generated description ID to `aria-describedby`, regardless of whether `getDescriptionProps()` has been called:

```tsx
props['aria-describedby'] = descriptionId
```

If no element uses the description ID, the attribute is silently ignored by assistive technology. This avoids render-order dependencies between prop-getters.

---

## Layer 2 — Parts

Styled JSX components that wrap L3 foundations and add Primer design tokens.

### Pattern

```tsx
import React, {createContext, useCallback, useContext, useMemo} from 'react'
import {clsx} from 'clsx'
import {use<Component>, type Use<Component>Options, type Use<Component>Return} from '../../foundations/experimental/<Component>'
import classes from './<Component>.module.css'

// --- Context (internal only) ---

interface <Component>ContextValue {
  foundation: Use<Component>Return
}

const <Component>Context = createContext<<Component>ContextValue | null>(null)

function use<Component>Context(): <Component>ContextValue {
  const ctx = useContext(<Component>Context)
  if (!ctx) {
    throw new Error('<Component> compound components must be used within <<Component>Root>')
  }
  return ctx
}

// --- Root ---

interface <Component>RootProps extends Use<Component>Options {
  children: React.ReactNode
  className?: string
}

const Root = React.forwardRef<HTML<Element>Element, <Component>RootProps>(
  function <Component>Root({children, className, ...options}, forwardedRef) {
    const foundation = use<Component>(options)
    const rootProps = foundation.get<Component>Props()

    // Merge foundation ref with forwarded ref
    const foundationRef = rootProps.ref
    const mergedRef = useCallback(
      (node: HTML<Element>Element | null) => {
        foundationRef(node)
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [foundationRef, forwardedRef],
    )

    const ctx = useMemo(() => ({foundation}), [foundation])

    return (
      <<Component>Context.Provider value={ctx}>
        <<element> {...rootProps} ref={mergedRef}
          className={clsx(className, classes.Root)}
          data-component="<Component>">
          {children}
        </<element>>
      </<Component>Context.Provider>
    )
  },
)

// --- Sub-components ---

function Title({className, ...props}: React.ComponentProps<'h2'>) {
  const {foundation} = use<Component>Context()
  const titleProps = foundation.getTitleProps()

  return (
    <h2 {...titleProps}
      className={clsx(className, classes.Title)}
      data-component="<Component>.Title"
      {...props}
    />
  )
}
Title.displayName = '<Component>.Title'

// ... more sub-components following the same pattern ...

// --- Composed export ---

export const <Component>Parts = Object.assign(Root, {
  Content,
  Header,
  Title,
  Subtitle,
  Body,
  Footer,
  CloseButton,
})
```

### CSS Module pattern

```css
/* Layer 2: Parts — Primer-styled <Component> */

.Root {
  /* Reset + Primer tokens */
  border: none;
  padding: 0;
  background: transparent;

  &::backdrop {
    background-color: var(--overlay-backdrop-bgColor);
    animation: <component>-backdrop-appear 200ms cubic-bezier(0.33, 1, 0.68, 1);
  }
}

.Content {
  display: flex;
  flex-direction: column;
  background-color: var(--overlay-bgColor);
  border-radius: var(--borderRadius-large);
  box-shadow: var(--shadow-floating-small);

  /* Width variants via data attributes */
  &:where([data-width='small']) { width: 296px; }
  &:where([data-width='medium']) { width: 320px; }
  &:where([data-width='large']) { width: 480px; }
}

.Header {
  display: flex;
  padding: var(--base-size-8);
  box-shadow: 0 1px 0 var(--borderColor-default);
  flex-shrink: 0;
}

.Title {
  margin: 0;
  font-size: var(--text-body-size-medium);
  font-weight: var(--text-title-weight-large);
  flex-grow: 1;
}

.Body {
  padding: var(--base-size-16);
  overflow: auto;
  flex-grow: 1;
}

.Footer {
  display: flex;
  flex-flow: wrap;
  justify-content: flex-end;
  padding: var(--base-size-16);
  gap: var(--base-size-8);
  flex-shrink: 0;
}
```

### Rules

- Every sub-component reads from context, never receives foundation via props
- `data-component` on every rendered element (root + sub-components)
- Use `clsx` for className merging — always accept `className` prop
- Use CSS Modules with Primer design tokens (`var(--*)`)
- Width/height/position variants via `data-*` attributes, styled with `:where([data-*])` for zero specificity
- Use `:where()` for variant selectors to avoid specificity wars
- `displayName` on every sub-component for DevTools
- Flat named exports for RSC compatibility (but composed via `Object.assign` for convenience)
- Animation: respect `prefers-reduced-motion` with `@media screen and (prefers-reduced-motion: no-preference)`

### CSS specificity rules

Distinguish three types of selectors:

- **`data-component`** = stable identity for testing and agents (not for styling)
- **`data-*` state/variant attributes** (`data-width`, `data-position-*`) = variant selectors, always wrap in `:where()` for zero specificity
- **CSS Module classes** (`.Root`, `.Header`) = primary styling hook, normal specificity

When targeting `data-component` or state attributes in CSS, use `:where()`:

```css
/* Good — zero specificity */
&:where([data-width='small']) { width: 296px; }

/* Avoid — unnecessarily high specificity */
&[data-width='small'] { width: 296px; }
```

---

## Layer 1 — Ready-made

Thin props-based wrapper over Parts.

### Pattern

```tsx
import React from 'react'
import {<Component>Parts} from './<Component>'

export interface <Component>Props {
  open: boolean
  title: React.ReactNode
  subtitle?: React.ReactNode
  onClose: (gesture: 'escape' | 'close-button' | 'backdrop') => void
  // ... convenience props that map to Parts children
  children: React.ReactNode
  className?: string
}

export const <Component> = React.forwardRef<HTML<Element>Element, <Component>Props>(
  function <Component>({open, title, subtitle, onClose, children, className, ...rest}, ref) {
    return (
      <<Component>Parts ref={ref} open={open} onClose={onClose} className={className} {...rest}>
        <<Component>Parts.Content>
          <<Component>Parts.Header>
            <<Component>Parts.Title>{title}</<Component>Parts.Title>
            <<Component>Parts.CloseButton />
          </<Component>Parts.Header>
          {subtitle && <<Component>Parts.Subtitle>{subtitle}</<Component>Parts.Subtitle>}
          <<Component>Parts.Body>{children}</<Component>Parts.Body>
        </<Component>Parts.Content>
      </<Component>Parts>
    )
  },
)
```

### Rules

- No new behaviour — everything delegates to Parts
- Props map directly to Parts children
- May translate convenience props into lower-layer behavioural options (e.g., `footerButtons[].autoFocus` → `initialFocusRef` via a ref forwarded to the rendered button)
- This is the default recommendation for most consumers (when L1 exists)
- Not every component needs this layer — surface the decision to the user

---

## Naming conventions summary

| Layer | Convention | Example |
|-------|-----------|---------|
| 4 — Hooks | `use<Behaviour>` | `useScrollLock`, `useFocusTrap` |
| 3 — Foundations | `use<Component>` | `useDialog`, `useTabs` |
| 2 — Parts | `<Component><Part>` | `DialogRoot`, `DialogHeader` |
| 1 — Ready-made | `<Component>` | `Dialog` |

## Source folder structure

```
packages/react/src/
├── hooks/                          # Layer 4
│   ├── use<Behaviour>.ts
│   ├── __tests__/
│   │   └── use<Behaviour>.test.ts
│   └── experimental/
│       └── index.ts
├── foundations/                     # Layer 3
│   └── experimental/
│       └── <Component>/
│           ├── use<Component>.ts
│           ├── <Component>Foundation.css
│           ├── index.ts
│           └── __tests__/
│               └── use<Component>.test.tsx
├── experimental/                    # Layer 2 + Layer 1 (while experimental)
│   └── <Component>/
│       ├── <Component>.tsx          # Parts (Layer 2)
│       ├── ReadyMade<Component>.tsx  # Ready-made (Layer 1)
│       ├── <Component>.module.css
│       ├── <Component>.spec.md      # Component specification
│       ├── index.ts
│       └── *.stories.tsx
└── <Component>/                     # After graduation from experimental
    └── ...
```
