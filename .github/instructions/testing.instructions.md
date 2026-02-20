---
applyTo: '**/*.test.tsx,**/*.test.ts'
---

# Project coding standards for Tests

Apply the [general coding guidelines](./general-coding.instructions.md) to all code.

## Unit Tests

Unit tests live in `ComponentName.test.tsx` alongside the component (or in `__tests__/`).

- Use [Vitest](https://vitest.dev/) (`describe`, `it`, `expect`, `vi`) with [React Testing Library](https://testing-library.com/)
- Structure tests with `describe`/`it` blocks
- Use `@testing-library/react` for rendering and `userEvent` for interactions

## Testing Philosophy

- Test the component's interface (what the user sees and does), not implementation details
- Query elements by accessible role, label, or text — not by class name or data attribute
- Use `vi.fn()` for mock callbacks, `userEvent.setup()` for user interactions

## Standard Test Patterns

Every component should include these tests:

```tsx
import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MyComponent} from '../MyComponent'
import {implementsClassName} from '../utils/testing'
import classes from './MyComponent.module.css'

describe('MyComponent', () => {
  // 1. CSS module class is applied to root
  implementsClassName(props => <MyComponent {...props} />, classes.MyComponent)

  // 2. Renders with correct semantic role
  it('should render as the correct element', () => {
    render(<MyComponent />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })

  // 3. Variant behavior
  it('should support the variant prop', () => {
    render(<MyComponent variant="danger" />)
    // Assert accessible label, role, or visual indicator changes
  })

  // 4. Callback props
  it('should call onClick when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<MyComponent onClick={onClick} />)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
```

## Coverage Checklist

- Renders correctly with default props
- `implementsClassName` test for CSS module class on root element
- Each variant/state produces correct accessible roles and labels
- Callback props fire with correct arguments
- Keyboard interactions work (Tab, Enter, Space, Escape, Arrow keys)
- Ref forwarding works
- Conditional rendering (show/hide) works

## Visual Regression Tests (VRT)

VRT tests live in `e2e/components/ComponentName.test.ts` and run with Playwright against Storybook.

```ts
import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {title: 'Default', id: 'components-mycomponent--default'},
  {title: 'Danger', id: 'components-mycomponent-features--danger'},
]

test.describe('MyComponent', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test(`${theme} @vrt`, async ({page}) => {
          await visit(page, {id: story.id, globals: {colorScheme: theme}})
          expect(await page.screenshot()).toMatchSnapshot(`MyComponent.${story.title}.${theme}.png`)
        })
      }
    })
  }
})
```

- Every feature story gets a VRT across all themes
- Add `viewports` array to stories that need responsive screenshot tests
- Tag tests with `@vrt` for visual regression, `@avt` for accessibility verification

## Story Patterns

### `ComponentName.stories.tsx` — Playground and Default

```tsx
import type {Meta, StoryObj} from '@storybook/react-vite'

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
} satisfies Meta<typeof MyComponent>

export default meta

// Minimal static example, no controls
export const Default = () => <MyComponent />

// Interactive demo with controls
export const Playground: StoryObj<typeof MyComponent> = {
  render: args => <MyComponent {...args} />,
  args: {variant: 'default'},
  argTypes: {
    variant: {control: {type: 'radio'}, options: ['default', 'danger']},
  },
}
```

### `ComponentName.features.stories.tsx` — Feature stories

```tsx
const meta = {
  title: 'Components/MyComponent/Features',
  component: MyComponent,
} satisfies Meta<typeof MyComponent>

export default meta

// One story per feature, PascalCase names, no controls
export const Danger = () => <MyComponent variant="danger" />
export const WithIcon = () => <MyComponent icon={<AlertIcon />} />
```

- Define helper components at module scope, not nested inside story functions

### `ComponentName.docs.json` — Documentation metadata

Every component needs a `docs.json` with:

```json
{
  "id": "my-component",
  "name": "MyComponent",
  "status": "alpha",
  "a11yReviewed": "2025-01-08",
  "importPath": "@primer/react",
  "stories": [{"id": "components-mycomponent--default"}],
  "props": [
    {
      "name": "variant",
      "type": "'default' | 'danger'",
      "defaultValue": "'default'",
      "description": "The visual style"
    }
  ],
  "subcomponents": [],
  "passthrough": {"element": "div", "url": "https://developer.mozilla.org/..."}
}
```
