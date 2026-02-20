---
description: 'Add slot support to a Primer React component using useSlots, context, and the __SLOT__ symbol pattern'
tools: ['edit/editFiles', 'search/codebase']
---

# Add Slots to a Primer React Component

You are an expert in the Primer React design system. The user wants to add slot-based child composition to a component.

## When to use slots

Use `useSlots` when the **parent controls where children render** — the parent has a fixed layout with named regions (header, body, footer, leading visual, etc.) and needs to place specific children into those positions.

Do NOT use slots when:

- The component is a simple wrapper that renders `{children}` as-is
- Children don't need to be placed in specific positions
- A data prop (`items={[...]}`) would be clearer because the parent needs to iterate, sort, or filter

If children need **data from the parent** (variant, size, disabled) but the parent doesn't control their position, use **React context** instead of slots.

## Implementation steps

### 1. Define sub-components with `__SLOT__` symbols

Each slot needs a sub-component with a unique `__SLOT__` symbol. Use `FCWithSlotMarker` for typing:

```tsx
import type {FCWithSlotMarker} from '../utils/types'

const Header: FCWithSlotMarker<HeaderProps> = ({children, className, ...rest}) => {
  return (
    <div {...rest} className={clsx(classes.Header, className)}>
      {children}
    </div>
  )
}
Header.displayName = 'MyComponent.Header'
Header.__SLOT__ = Symbol('MyComponent.Header')
```

### 2. Extract slots in the parent with `useSlots`

```tsx
import {useSlots} from '../hooks/useSlots'

function MyComponent({children, ...rest}: MyComponentProps) {
  const [slots, childrenWithoutSlots] = useSlots(children, {
    header: Header,
    footer: Footer,
  })

  return (
    <div {...rest}>
      {slots.header}
      <div className={classes.Body}>{childrenWithoutSlots}</div>
      {slots.footer}
    </div>
  )
}
```

### 3. Assemble the compound component in `index.ts`

```tsx
import {MyComponent as MyComponentImpl, Header, Footer} from './MyComponent'

export const MyComponent = Object.assign(MyComponentImpl, {
  Header,
  Footer,
})
```

### 4. Add slot symbol matching for wrapper support

The `__SLOT__` symbol allows consumers to wrap sub-components and still have them detected:

```tsx
// Consumer code
const CustomHeader = (props) => <MyComponent.Header {...props} extra="stuff" />
CustomHeader.__SLOT__ = MyComponent.Header.__SLOT__

// This still gets extracted as the header slot:
<MyComponent>
  <CustomHeader>Title</CustomHeader>
  <p>Body content</p>
</MyComponent>
```

### 5. Conditional props matching (advanced)

For components where the same sub-component type fills different slots based on props:

```tsx
const [slots] = useSlots(children, {
  blockDescription: [Description, props => props.variant === 'block'],
  inlineDescription: [Description, props => props.variant !== 'block'],
})
```

## If the component currently uses React.Children or cloneElement

Migrate to slots + context:

1. **Replace `React.Children.map/filter`** with `useSlots` for positional extraction
2. **Replace `cloneElement` prop injection** with React context — the parent provides context, children consume it
3. **Replace `React.Children.count`** with data props or CSS-only solutions

## Files to modify

For a component named `${input:ComponentName}`:

1. `packages/react/src/${input:ComponentName}/${input:ComponentName}.tsx` — add sub-components with `__SLOT__`, use `useSlots` in parent
2. `packages/react/src/${input:ComponentName}/index.ts` — assemble compound component with `Object.assign`
3. `packages/react/src/${input:ComponentName}/${input:ComponentName}.module.css` — add styles for slot containers
4. `packages/react/src/${input:ComponentName}/${input:ComponentName}.test.tsx` — add tests for slot extraction, wrapper support, missing slots
5. `packages/react/src/${input:ComponentName}/${input:ComponentName}.stories.tsx` — update stories to use compound pattern
6. `packages/react/src/${input:ComponentName}/${input:ComponentName}.docs.json` — add subcomponents to metadata

## Reference files

Look at these existing implementations for patterns to follow:

- `packages/react/src/Dialog/Dialog.tsx` — header/body/footer slots
- `packages/react/src/hooks/useSlots.ts` — the hook implementation
- `packages/react/src/utils/is-slot.ts` — slot symbol matching logic
- `packages/react/src/utils/types/Slots.ts` — `SlotMarker`, `FCWithSlotMarker` types
- `packages/react/src/hooks/__tests__/useSlots.test.tsx` — test patterns including wrapper support
