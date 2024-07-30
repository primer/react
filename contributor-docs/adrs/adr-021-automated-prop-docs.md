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
- Parse component source code and generate a `components.json` file with data we can use for generating docs ([example components.json](https://unpkg.com/browse/@primer/react@36.24.0/generated/components.json))

#### Suggested metadata documented with JSDoc tags:

- `@alias`: May be used when the name we use to refer to the component is different from the name React calculates using the component function's name or the `displayName` function property (for example: `Item` being named `ActionList.Item`).
- `@deprecated`: Marks a component as deprecated.
- `@primerid`: The unique ID of the component. Not used for subcomponents (for example: `ActionList.Item`).
- `@primerstatus`: The [lifecycle status](https://primer.style/guides/component-lifecycle) of the component.
- `@primera11yreviewed`: Whether it has passed a11y design and a11y engineering reviews. If this tag is not set, it defaults to `false`.
- `@primerparentid`: The ID of the parent component that this subcomponent belongs to. Required for subcomponents (for example: `ActionList.Item`).
- `@primerstories`: An optional list of Storybook story IDs to override the story IDs we dynamically calculate in the build script by using the component name, status, and file path.

#### Gotchas

If a component's file name doesn't match the Storybook files, our script won't be able to find the Storybook files and parse the data for the `stories` property. For example: ActionList has `List.tsx` and `ActionList.stories.tsx`.

We may be able to fix this by making our story-parsing script a little smarter so it just picks up any `.stories.tsx` files in the directory.

**Workaround:** For the `stories` field to be properly populated, we need the following:
- A story filed named with the component name. Example: `ActionMenu.stories.tsx`
- A story named `Default` exported from `{ComponentName}.stories.tsx`
- (optional) A story filed named `{ComponentName}.features.stories.tsx`
- (optional) A story filed named `{ComponentName}.examples.stories.tsx`

---

If you want a component to be documented, it must be exported from the `.tsx` file. So far this only causes problems for compount components that we export like this: `export const Root = Object.assign(RootComponent, {Item: ItemComponent})`.

This is a problem with `react-typescript-docgen`. TypeDoc will associate subcomponents as "properties" of the exported parent function component.

**Workarounds:**
- Instead of `export const Root = Object.assign(RootComponent, {Item: ItemComponent})` in the component's `.tsx` file, export each component from the `.tsx` file and then import into the component's `index.ts` file, then export with `Object.assign` from `index.ts`.
- Export each subcomponent even if you're not actually importing it anywhere else

#### Other challenges

- Prop docs for components like `Button` that accept all relevant HTML props could get _all_ possible props that can be passed to a `<button>` element of just a subset of the most relevant props
- Generic types are not always written out. For example: `ResponsiveValue<T>` will be rendered instead of `{narrow?: T, regular?: T, wide?: T}`.
- Still haven't figured out how to skip parsing utility functions (for example: [isNumeric](https://github.com/primer/react/blob/219868e65214d6667c855c22d5c586b2f6b3348d/packages/react/src/utils/isNumeric.tsx)) for inclusion in `components.json`
- Still haven't figured out how to get Docgen to parse components that are cast using `as PolymorphicForwardRefComponent<E, P>`
- Still haven't figured out how to get Storybook Docgen data to build the exact same way we build Docgen data for `components.json`

### Comparing third-party tools

I explored the following tools to help us extract component API data:

- [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript)
- [TypeDoc](https://typedoc.org/)
- [react-docgen](https://react-docgen.dev/)
- [api-extractor](https://api-extractor.com/)

Alternatively, we could go lower-level and build our own tool from scratch. I have not yet attempted this. See the following examples:

- [Adobe Spectrum DocsTransformer](https://github.com/adobe/react-spectrum/blob/main/packages/dev/parcel-transformer-docs/DocsTransformer.js)
- [MUI ComponentApiBuilder](https://github.com/mui/material-ui/blob/next/packages/api-docs-builder/ApiBuilders/ComponentApiBuilder.ts)

I found [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript) and [TypeDoc](https://typedoc.org/) to be the most viable tools to consider.

Currently, I'd prefer to move forward with [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript) because it has given me the best results so far, and it seems possible to customize and improve to better suit our needs.

#### [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript)

##### react-docgen-typescript pros

- Made specifically for extracting type data from React components
- I'm able to get almost all (about 95%) components and prop data parsed into a `components.json` file (example of existing JSON file: [components.json](https://unpkg.com/browse/@primer/react@36.27.0/generated/components.json))
- The `shouldIncludeExpression` option opens us up to further customization because it has the option to return expression data with output
- Is the same tool Storybook uses to show prop types, so Storybook will be better aligned with component docs

##### react-docgen-typescript cons

- Requires some minor changes to source code to be able to parse all components and their props. The biggest change is that a component function needs to be exported in order to be picked up
- Releases and contributions have slowed down in the repo
- Having trouble handling a file with multiple components and multiple `.displayName` assignments
- Props on components cast using `as PolymorphicForwardRefComponent<El, Props>` are not picked up
- I can't just point to `src/index.ts`, `src/drafts/index.ts`, and `src/deprecated/index.ts` to only get exported components and hooks. Doing this only gets some components parsed. Instead, I have to parse all `.tsx` files (excluding `*.story.tsx` and `*.test.tsx`)
- Cannot handle subcomponents like ActionList that are exported like this: `export const ActionList = Object.assign(List, Item: ActionListItem, etc...)`

##### Example component

`primer-react-docgen` and other tools I've tested only document components and props that are exported.

The following code style has given me the best results with `react-typescript-docgen`, and is very close to what we already do.

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


#### [TypeDoc](https://typedoc.org/)

##### TypeDoc pros

- Able to run it and get type data with very few changes to component source
- Can handle subcomponents like ActionList that are exported like this: `export const ActionList = Object.assign(List, Item: ActionListItem, etc...)`
- Able to point to `src/index.ts`, `src/drafts/index.ts`, and `src/deprecated/index.ts` to only documented exported components and hooks
- Customizable through [plugins](https://typedoc.org/guides/plugins/)

##### TypeDoc cons

- I haven't been able to parse the TypeDoc output into a `components.json` file (example of existing JSON file: [components.json](https://unpkg.com/browse/@primer/react@36.27.0/generated/components.json))
- I'm not able to get it to work without some updates to our `tsconfig` that I'm not sure we actually want
- Props on components cast using `as PolymorphicForwardRefComponent<El, Props>` are not picked up
- Not well-documented and hard to debug
- There are no existing plugins to help document React components
- Seems like the point of this tool is to generate a static site for documentation. It's less useful for extracting type data and doing something custom with it.
- I'm not sure how to print the returned statements/expressions (in the format of a TypeScript Symbol) in a way that will make it easier to debug. `JSON.stringify()` fails due to circular references.

## Impact

- We don't need to manually create `{ComponentName}.docs.json` for each component files for each component
- Component metadata such as prop types and their descriptions will always be in sync with what's in the source code
  - We only use this data for component docs on primer.style right now ([DataTable example](https://primer.style/components/data-table/react/draft#props)), but the possibilities are endless. This may even be useful for keeping Figma components in sync.
- More thorough JSDoc comments provide more context when:
  - working directly in PRC
  - using PRC imports in an IDE

## Decision

TBD:
- Will we move forward with automating prop docs?
- If so, how? What are the suggested tools and process?

### Potential paths forward

- Move forward with `react-typescript-docgen` (preferred)
  - Could be handled by @mperrotti with minimal help from an engineer
- Move forward with TypeDoc
  - Would require more time from one or more engineers
- Build our own tooling to extract API data from component source code
  - Would take a significant amount of high-effort work and would require more assistance from one or more engineer who are well-versed in TypeScript and ASTs
- Manually maintain `.docs.json` files temporarily, figure out automation later
  - If we're not comfortable with the previous directions, we could punt on this ADR and spend time updating `.docs.json` files for accuracy
- Continue to manually maintain `.docs.json` files long-term
  - Keep handling component API docs as we do today, but update this ADR to document how and why we document components this way


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
