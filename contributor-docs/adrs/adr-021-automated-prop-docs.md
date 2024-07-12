# Automated Prop Documentation

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | —     |
| Adopted  | —     |

## Context

**Draft PR: https://github.com/primer/react/pull/4466**

### Current process

This is the process I've used in the past. Please correct me if I made any mistakes.

- Write props type in TypeScript source
- Add JSDoc comments to describe each prop (optional - nicer IDE experience)
- Manually update `{ComponentName}.docs.json` in the format described in the following ([schema](https://github.com/primer/react/blob/main/packages/react/script/components-json/component.schema.json)):
  - id
  - name
  - status
  - a11yReviewed
  - stories
  - props (needs to match the prop's type in the TypeScript source)
    - name (required)
    - type (required)
    - defaultValue
    - required
    - deprecated
    - description
  - subcomponents
  - passthrough (when a component passes through any additional props to an underlying element)
    - element
    - url
- Use the data from each `{ComponentName}.docs.json` to generate a `components.json` file with data we can use for generating docs ([example components.json](https://unpkg.com/browse/@primer/react@36.24.0/generated/components.json))

### Proposed process

- Write props type in TypeScript source
- Add JSDoc comments to describe each prop
- Add JSDoc comments with metadata for each component
  - component ID or parent component ID (if applicable)
  - status
  - a11yReviewed
- Use Docgen to parse component source code and generate a `components.json` file with data we can use for generating docs ([example components.json](https://unpkg.com/browse/@primer/react@36.24.0/generated/components.json))

This will take some work upfront, and we'll need to keep some ["gotchas"](#gotchas) in mind going forward.

#### Suggested metadata documented with JSDoc tags:

- `@alias`: May be used when the name we use to refer to the component is different from the `displayName` (for example: `Item` being named `ActionList.Item`)
- `@deprecated`: Marks a component as deprecated
- `@primerid`: The unique ID of the component
- `@primerstatus`: The [lifecycle status](https://primer.style/guides/component-lifecycle) of the component
- `@primera11yreviewed`: Whether it has passed a11y design and a11y engineering reviews. If this tag is not set, it defaults to `false`
- `@primerparentid`: The ID of the parent component that this subcomponent belongs to. Only relevant for "child" components (for example: `ActionList.Item`).
- `@primerstories`: An optional list of Storybook story IDs to override the story IDs we dynamically calculate in the build script by using the component name, status, and file path.


#### Example component

The following code style has given me the best results with Docgen.

```tsx
// --------------------------------------------------
// packages/react/src/TestComponent/TestComponent.tsx
// --------------------------------------------------
import React from 'react'

export type TestComponentProps = {
  /** Unique identifier associated with this instance of the test component */
  id: string

  /** Status of the test component */
  status?: 'not-started' | 'in-progress' | 'done'
}

/**
 * A fake component that doesn't actually do anything.
 * @primerid test_component
 * @primerstatus alpha
 * @primera11yreviewed true
 */
export const TestComponent: React.FC<React.PropsWithChildren<TestComponentProps>> = ({children, id, status}) => (
  <div data-status={status} id={id}>{children}</div>
)

export type TestComponentHeadingProps = {
  /**
   * Status of the test component
   * @default moderate // NOTE: mostly optional because the `default` tag can usually be inferred by Docgen if you set a default in the props parameter of the Function Component
  */
  variant?: 'gigantic' | 'big' | 'moderate' | 'quiet'
}

/**
 * The heading rendered in TestComponent.
 * @alias TestComponent.Heading
 * @primerparentid test_component
 */
export const TestComponentHeading: React.FC<React.PropsWithChildren<TestComponentHeadingProps>> = ({children, variant = 'moderate'}) => (
  <div data-variant={variant}>{children}</div>
)

export type TestComponentBodyProps = {
  /** Whether the body content can scroll vertically */
  scrollable?: boolean
}

/**
 * The content rendered in the body of TestComponent.
 * @alias TestComponent.Body
 * @primerparentid test_component
 */
export const TestComponentBody: React.FC<React.PropsWithChildren<TestComponentBodyProps>> = ({children, scrollable}) => (
  <div data-scrollable={scrollable} id={id}>{children}</div>
)
```

```ts
// -----------------------------------------
// packages/react/src/TestComponent/index.ts
// -----------------------------------------
import {TestComponent as TestComponentImpl, TestComponentHeading, TestComponentBody} from './TestComponent'
import type {TestComponentProps, TestComponentHeadingProps, TestComponentBodyProps} from './TestComponent'

export const TestComponent = Object.assign(TestComponentImpl, {
  Heading: TestComponentHeading,
  Body: TestComponentBody,
})
export type {TestComponentProps, TestComponentHeadingProps, TestComponentBodyProps}
```

#### Gotchas

Exporting a component and its children directly from the `.tsx` file causes the child components to not be associated with its parent.

If you want a component to be documented, it must be exported from the `.tsx` file.

**Workaround:** Instead of `export const Root = Object.assign(RootComponent, {Item: ItemComponent})` in the component's `.tsx` file, export it each component from the `.tsx` file and then import into the component's index.ts, then export with `Object.assign` from there.

---

If a component's file name doesn't match the Storybook files, our script won't be able to find the Storybook files and parse the data for the `stories` property. For example: ActionList has `List.tsx` and `ActionList.stories.tsx`.

We may be able to fix this by making our story-parsing script a little smarter so it just picks up any `.stories.tsx` files in the directory.

**Workaround:** For the `stories` field to be properly populated, we need the following:
- A story filed named with the component name. Example: `ActionMenu.stories.tsx`
- A story named `Default` exported from `{ComponentName}.stories.tsx`
- (optional) A story filed named `{ComponentName}.features.stories.tsx`
- (optional) A story filed named `{ComponentName}.examples.stories.tsx`

#### Other challenges

- Prop docs for components like `Button` that accept all relevant HTML props could get _all_ possible props that can be passed to a `<button>` element of just a subset of the most relevant props
- Generic types are not always written out. For example: `ResponsiveValue<T>` will be rendered instead of `{narrow?: T, regular?: T, wide?: T}`.
- Still haven't figured out how to skip parsing utility functions (for example: [isNumeric](https://github.com/primer/react/blob/219868e65214d6667c855c22d5c586b2f6b3348d/packages/react/src/utils/isNumeric.tsx)) for inclusion in `components.json`
- Still haven't figured out how to get Docgen to parse components that are cast using `as PolymorphicForwardRefComponent<E, P>`
- Still haven't figured out how to get Storybook Docgen data to build the exact same way we build Docgen data for `components.json`

## Impact

- We don't need to manually create `{ComponentName}.docs.json` for each component files for each component
- Component metadata such as prop types and their descriptions will always be in sync with what's in the source code
  - We only use this data for component docs on primer.style right now ([DataTable example](https://primer.style/components/data-table/react/draft#props)), but the possibilities are endless. This may even be useful for keeping Figma components in sync.
- More thorough JSDoc comments provide more context when:
  - working directly in PRC
  - using PRC imports in an IDE

## Decision

TBD:
- Will we move forward with this?
- What are the suggested tools and process?

## Open questions

- Do we want to generate docs for internal component props? If so, where would they be rendered?
- What should we do about hooks? It would be useful to have their data for docs, but it might be strange to keep that data in a file named **components**.json
- What do we want to do about components with passthrough props? For example: [Button](https://github.com/primer/react/blob/219868e65214d6667c855c22d5c586b2f6b3348d/packages/react/src/Button/types.ts#L50)
- Do we want to build `components.json` in CI the same way we do now? Also, it is explictly `gitignore`d in `packages/react/.gitignore`. For reference, here is the [step in our CI configuration](https://github.com/primer/react/blob/8629a4beade4821cf92da231a40a8b5106458680/.github/workflows/ci.yml#L254).
- Should we set up some logic to throw errors if a component's generated docs are missing or incomplete? For example...
  - Throw an error if the component doesn't have an entry in `components.json`
  - Throw an error if the component doesn't have an ID (set using `@primerid` JSDoc tag) unless it's a subcomponent (like `ActionList.Item`)
  - Throw an error if the prop doesn't have a `type` property
  - Other requirements TBD
- How might we check for regressions? For example, if somebody changes a component's source code and it can no longer be parsed by Docgen.
- Is it too much to ask folks to understand the ["gotchas"](#gotchas)? If so, what are some ways we can make it easier?

## Suggested roll-out plan

- Merge this ADR
- Merge a PR that adds documentation to [contributor-docs](https://github.com/primer/react/tree/main/contributor-docs) to help contributors understand how to write components in a way that they can be automatically documented
- Update https://github.com/primer/react/pull/4466 to flag components we haven't figured out how to get Docgen to parse correctly. For example: components cast using `as PolymorphicForwardRefComponent<E, P>`
  - Maybe we can use a field like `@primeroverridedocgen path/to/ComponentName.docs.json`
- Merge https://github.com/primer/react/pull/4466, but continue relying on the current build script which pulls data from `*.docs.json` files.
  - This PR _should not_ result in any changes to our components or `@primer/react` packages
  - Add a new action that runs the new `components.json` build script on PRs without shipping the results to `generated/components.json` so we can monitor how the new build script is working in a real environment. This will allow us to find bugs and other opportunities for improvement.
- Iterate on the new build script until we're happy with the results. Ideally >90% of component docs can be generated without falling back on a `.docs.json` file.
- Fully commit to this new way to generate `components.json`
  - Replace "old" build script ([components-json/build.ts](https://github.com/primer/react/blob/219868e65214d6667c855c22d5c586b2f6b3348d/packages/react/script/components-json/build.ts)) with new build script
  - Remove `.docs.json` files
