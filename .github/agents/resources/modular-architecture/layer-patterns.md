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
  /** Whether clicking the backdrop closes the component. @default false */
  closeOnBackdropClick?: boolean
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

const getBodyProps = useCallback((): BodyProps => {
  return {
    'aria-labelledby': titleId,
    tabIndex: 0,
    role: 'region',
  }
}, [titleId])
```

**Body region:** The body/content area should have `role="region"` and `aria-labelledby` pointing to the title ID. This makes the scrollable content area navigable as a landmark for assistive technology users. Always include `tabIndex: 0` so keyboard users can scroll the body.

**Root prop-getter:** Must include `aria-label` passthrough when provided (for components without a visible title):

```tsx
const getRootProps = useCallback(() => {
  const props = {
    ref: refCallback,
    role,
    'aria-modal': true,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
    onClick: handleClick,
  }
  if (ariaLabel) {
    props['aria-label'] = ariaLabel
  }
  return props
}, [refCallback, role, titleId, descriptionId, handleClick, ariaLabel])
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

### 3b: Unstyled components

React components that wrap the compound hook and enforce structural accessibility via a component tree. No visual styling — consumers bring their own CSS. These mirror the sub-component names from Layer 2 Parts but ship from the `/foundations` entry point.

#### Pattern

```tsx
import React, {createContext, useContext, useMemo} from 'react'
import {use<Component>, type Use<Component>Options, type Use<Component>Return} from './use<Component>'

// --- Context (internal only) ---

interface <Component>FoundationContextValue {
  foundation: Use<Component>Return
}

const <Component>FoundationContext = createContext<<Component>FoundationContextValue | null>(null)

function use<Component>FoundationContext(): <Component>FoundationContextValue {
  const ctx = useContext(<Component>FoundationContext)
  if (!ctx) {
    throw new Error('<Component> foundation components must be used within <<Component>.Root>')
  }
  return ctx
}

// --- Root ---

interface RootProps extends Use<Component>Options {
  children: React.ReactNode
  className?: string
}

function Root({children, className, ...options}: RootProps) {
  const foundation = use<Component>(options)
  const rootProps = foundation.get<Component>Props()

  const ctx = useMemo(() => ({foundation}), [foundation])

  return (
    <<Component>FoundationContext.Provider value={ctx}>
      <<element> {...rootProps} className={className}>
        {children}
      </<element>>
    </<Component>FoundationContext.Provider>
  )
}

// --- Sub-components (Title, Description, Body, Close, etc.) ---

function Title({children, className, ...props}: React.ComponentProps<'h2'>) {
  const {foundation} = use<Component>FoundationContext()
  const titleProps = foundation.getTitleProps()
  return <h2 {...titleProps} className={className} {...props}>{children}</h2>
}

function Description({children, className, ...props}: React.ComponentProps<'p'>) {
  const {foundation} = use<Component>FoundationContext()
  const descriptionProps = foundation.getDescriptionProps()
  return <p {...descriptionProps} className={className} {...props}>{children}</p>
}

function Body({children, className, ...props}: React.ComponentProps<'div'>) {
  const {foundation} = use<Component>FoundationContext()
  const bodyProps = foundation.getBodyProps()
  return <div {...bodyProps} className={className} {...props}>{children}</div>
}

function Close({children, className, ...props}: React.ComponentProps<'button'>) {
  const {foundation} = use<Component>FoundationContext()
  const closeProps = foundation.getCloseProps()
  return <button {...closeProps} className={className} {...props}>{children ?? '✕'}</button>
}
```

#### Consumer usage

```tsx
// Foundation consumer — unstyled, bring your own CSS
import {Dialog} from '@primer/react/foundations/experimental'

;<Dialog.Root open={open} onClose={onClose}>
  <Dialog.Title className={styles.title}>Title</Dialog.Title>
  <Dialog.Description className={styles.desc}>Subtitle</Dialog.Description>
  <Dialog.Body className={styles.body}>Content</Dialog.Body>
  <Dialog.Close className={styles.close}>✕</Dialog.Close>
</Dialog.Root>
```

#### Rules

- Unstyled components **do not add any visual styles** — no Primer tokens, no CSS Modules. Only the foundation CSS reset applies.
- They enforce structural constraints that prop-getters alone cannot (e.g., title must be a descendant of the component root)
- Context is internal — never exposed to consumers
- Sub-component names mirror the Layer 2 Parts names for consistency
- Accept `className` for consumer styling — pass it through, don't merge with anything
- File: `packages/react/src/foundations/experimental/<Component>/<Component>.tsx`

### 3c: Foundation CSS

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
  overflow: visible;
  color: inherit;
}

:where(dialog[data-<component>-foundation])::backdrop {
  background: transparent;
}
```

The foundation hook adds the `data-<component>-foundation` attribute via its root prop-getter so the reset CSS applies automatically. Note `overflow: visible` and `color: inherit` — these prevent the browser from clipping content and overriding text colour.

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
  max-width: unset;
  max-height: unset;
  overflow: visible;
  color: inherit;

  &::backdrop {
    background-color: var(--overlay-backdrop-bgColor);
    animation: <component>-backdrop-appear 200ms cubic-bezier(0.33, 1, 0.68, 1);
  }
}

.Content {
  display: flex;
  flex-direction: column;
  /* stylelint-disable-next-line primer/responsive-widths */
  width: 640px; /* default = xlarge */
  min-width: 296px;
  max-width: calc(100dvw - 64px);
  height: auto;
  max-height: calc(100dvh - 64px);
  background-color: var(--overlay-bgColor);
  border-radius: var(--borderRadius-large);
  box-shadow: var(--shadow-floating-small);
  opacity: 1;

  /* Width variants via data attributes — use :where() for zero specificity */
  &:where([data-width='small']) {
    width: 296px;
  }
  &:where([data-width='medium']) {
    width: 320px;
  }
  &:where([data-width='large']) {
    /* stylelint-disable-next-line primer/responsive-widths */
    width: 480px;
  }
  /* xlarge is the default (640px) — no override needed */

  /* Height variants */
  &:where([data-height='small']) {
    height: 480px;
  }
  &:where([data-height='large']) {
    height: 640px;
  }
}

.Header {
  z-index: 1; /* Stay above scrolling body */
  display: flex;
  max-height: 35vh; /* Prevent oversized headers */
  padding: var(--base-size-8);
  overflow-y: auto;
  box-shadow: 0 1px 0 var(--borderColor-default);
  flex-shrink: 0;
}

.Title {
  margin: 0;
  padding-inline: var(--base-size-8);
  padding-block: var(--base-size-6);
  font-size: var(--text-body-size-medium);
  font-weight: var(--text-title-weight-large);
  flex-grow: 1;
}

.Subtitle {
  margin: 0;
  margin-top: var(--base-size-4);
  padding-inline: var(--base-size-8);
  font-size: var(--text-body-size-small);
  font-weight: var(--base-text-weight-normal);
  color: var(--fgColor-muted);
}

.Body {
  padding: var(--base-size-16);
  overflow: auto;
  flex-grow: 1;
}

.Footer {
  z-index: 1; /* Stay above scrolling body */
  display: flex;
  flex-flow: wrap;
  justify-content: flex-end;
  padding: var(--base-size-16);
  gap: var(--base-size-8);
  flex-shrink: 0;
}
```

**Key CSS details:**

- Root needs `overflow: visible` and `color: inherit` to prevent browser defaults from clipping content or overriding text colour
- Default width is `640px` (xlarge) — this is the most common dialog size
- Header and Footer get `z-index: 1` to stay above the scrolling body
- Header has `max-height: 35vh` to prevent oversized headers from pushing body off-screen
- **Subtitle is rendered outside the Header** (below the header border), not inside it. This is a structural decision: the header contains Title + CloseButton, while Subtitle sits between header and body

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
&:where([data-width='small']) {
  width: 296px;
}

/* Avoid — unnecessarily high specificity */
&[data-width='small'] {
  width: 296px;
}
```

### Sub-component composability

Sub-components must be independently composable — never bake one sub-component into another. For example:

```tsx
// ✅ Good — Header accepts children, consumer controls layout
;<DialogParts.Header>
  <DialogParts.Title>Title</DialogParts.Title>
  <DialogParts.CloseButton />
</DialogParts.Header>

// ❌ Bad — Header renders CloseButton internally
function Header({children}) {
  return (
    <header>
      {children}
      <CloseButton /> {/* Don't do this */}
    </header>
  )
}
```

This lets consumers control placement, omission, and ordering of sub-components.

### Use existing Primer components

Layer 2 Parts and Layer 1 Ready-made should use existing Primer components wherever appropriate:

- **Buttons:** Use `Button` from `../../Button` (not plain `<button>`). Use the `variant` prop (`'default' | 'primary' | 'danger'`).
- **Close button:** Use `IconButton` from `../../Button` with `XIcon` from `@primer/octicons-react` (not an inline SVG).
- **Text:** Use `Text` from `../../Text` where appropriate.
- **Layout:** Use Primer layout components where they fit.

This ensures consistent styling, theming, and behaviour across the design system.

### Responsive props

For components that support multiple positions or sizes, use responsive value types:

```tsx
import type {ResponsiveValue} from '../../hooks/useResponsiveValue'

interface ContentProps {
  width?: 'small' | 'medium' | 'large' | 'xlarge'
  height?: 'small' | 'large' | 'auto'
  position?: 'center' | 'left' | 'right' | ResponsiveValue<'left' | 'right' | 'bottom' | 'fullscreen' | 'center'>
  align?: 'top' | 'center' | 'bottom'
}
```

Map responsive values to `data-position-{breakpoint}` attributes and style them with CSS media queries:

```css
/* Side sheet positions */
&[data-position-regular='left'] {
  height: 100dvh;
  max-height: unset;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  @media screen and (prefers-reduced-motion: no-preference) {
    animation: dialog-content-slideInRight 0.25s cubic-bezier(0.33, 1, 0.68, 1);
  }
}

&[data-position-regular='right'] {
  height: 100dvh;
  max-height: unset;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  @media screen and (prefers-reduced-motion: no-preference) {
    animation: dialog-content-slideInLeft 0.25s cubic-bezier(0.33, 1, 0.68, 1);
  }
}

/* Narrow viewport overrides */
@media (max-width: 767px) {
  &[data-position-narrow='bottom'] {
    width: 100dvw;
    max-width: 100dvw;
    height: auto;
    max-height: calc(100dvh - 64px);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  &[data-position-narrow='fullscreen'] {
    width: 100%;
    max-width: 100dvw;
    height: 100%;
    max-height: 100dvh;
    border-radius: unset;
    flex-grow: 1;
  }
}
```

Include appropriate `@keyframes` for slide-in animations (slideInLeft, slideInRight, slideUp) and scale-fade for the default center position. Always wrap animations in `@media screen and (prefers-reduced-motion: no-preference)`.

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

| Layer           | Convention          | Example                         |
| --------------- | ------------------- | ------------------------------- |
| 4 — Hooks       | `use<Behaviour>`    | `useScrollLock`, `useFocusTrap` |
| 3 — Foundations | `use<Component>`    | `useDialog`, `useTabs`          |
| 2 — Parts       | `<Component><Part>` | `DialogRoot`, `DialogHeader`    |
| 1 — Ready-made  | `<Component>`       | `Dialog`                        |

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
