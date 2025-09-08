# Contribution guidelines

- [Contribution guidelines](#contribution-guidelines)
  - [Roadmap](#roadmap)
  - [Before Getting Started](#before-getting-started)
    - [Proposing new components](#proposing-new-components)
  - [Discussing non-public features or products](#discussing-non-public-features-or-products)
  - [Developing components](#developing-components)
    - [Tools we use](#tools-we-use)
    - [File structure](#file-structure)
    - [Component patterns](#component-patterns)
    - [SSR compatibility](#ssr-compatibility)
    - [Adding the `className` prop](#adding-the-classname-prop)
    - [Linting](#linting)
      - [ESLint](#eslint)
      - [Markdownlint](#markdownlint)
    - [TypeScript support](#typescript-support)
    - [Additional resources](#additional-resources)
  - [Writing documentation](#writing-documentation)
  - [Creating a pull request](#creating-a-pull-request)
    - [Adding changeset to your pull request](#adding-changeset-to-your-pull-request)
    - [What to expect after opening a pull request](#what-to-expect-after-opening-a-pull-request)
      - [What we look for in reviews](#what-we-look-for-in-reviews)
    - [Previewing your changes](#previewing-your-changes)
  - [Deploying](#deploying)
  - [Troubleshooting](#troubleshooting)

## Roadmap

If you're looking for ways to contribute, a great place to start is our issues labeled [good first issue](https://github.com/primer/react/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)! If you've got a feature that you'd like to implement, be sure to check out our [Primer Roadmap](https://github.com/orgs/github/projects/2759) (GitHub staff only) to make sure it hasn't already been started on.

## Before Getting Started

A common question asked about Primer Components is how to know what should be added to Primer Components and what is best left as a local component in a consuming application. Though there are no hard & fast rules about what can and cannot be added to Primer Components, here are a few things we take into consideration:

- Is the new feature an existing pattern in Primer CSS or related to UI built at GitHub? Primer Components is first and foremost a library for building UI at GitHub - patterns that aren't currently being used in GitHub UI (either on github.com or in a GitHub owned project outside of github.com) probably shouldn't be added to Primer Components. Exceptions to this could be helper components that don't necessarily render UI but help with the development process.

- Does the proposed component get used in more than one or two places across GitHub UI? A component that's only meant to be used in one place and doesn't have potential to be reused in many places probably should exist as a local component. An example of something like this might be a component that renders content specific to a single GitHub product.

### Proposing new components

If you would like to propose an idea for a new component, the best way to get started, especially if your proposal is in its early stages, is to [open a pattern proposal](https://github.com/github/primer/discussions/categories/design-patterns) (GitHub staff only). If you're more certain about what you need, please [open a pattern request issue](https://github.com/github/primer/issues/new?assignees=&labels=needs+triage&template=01-request.md&title=%5BProposal%5D+) (GitHub staff only). We will get back to you after our weekly backlog triaging session.

## Discussing non-public features or products

As this is a public repo, please be careful not to include details or screenshots from unreleased GitHub products or features. In most cases, a good bug report, feature request, or pull request should be able to describe the work without including business logic or feature details, but if you must discuss context relating to an unreleased feature, please open an issue in the private [Primer repo](https://github.com/github/primer/issues) (GitHub staff only) and link to it in your issue or pull request.

## Developing components

We primarily use [Storybook](https://storybook.js.org/) as a workspace to develop new components or make changes to existing components.

Before running storybook locally, make sure to install [Node.js](https://nodejs.org/en/) v20 (we recommend using [nvm](https://github.com/nvm-sh/nvm)). Next, run the following command to setup your environment:

```sh
npm run setup
```

Afterwards, you can run the following command to start up the
storybook environment:

```sh
npm start
```

Navigate to http://localhost:6006/ to see Primer react components in your browser ✨

### Tools we use

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [Storybook](https://storybook.js.org/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Playwright](https://playwright.dev/)

### File structure

```
primer-react/
├─ src/
│  ├─ Breadcrumbs/
│  │  ├─ index.ts                             // Exporting the component
│  │  ├─ Breadcrumbs.tsx                      // Primary component file
│  │  ├─ Breadcrumbs.module.css               // Primary component CSS file
│  │  ├─ BreadcrumbsItem.tsx                  // Subcomponent (include parent component name to increase findability in most IDEs)
│  │  ├─ Breadcrumbs.stories.tsx              // Storybook stories (Default and Playground)
│  │  ├─ Breadcrumbs.features.stories.tsx     // Storybook feature stories
│  │  ├─ Breadcrumbs.examples.stories.tsx     // Storybook examples
│  │  ├─ __tests__/                           // If you have a single test file, no need for a folder
|  |  |  ├─ Breadcrumbs.test.tsx              // Unit tests
│  │  |  ├─ Breadcrumbs.types.test.tsx        // Type tests
│  │  |  ├─ __snapshots__/                    // Snapshots
│  │  |  |  ├─ Breadcrumbs.test.tsx.snap
│  │  ├─ Breadcrumbs.docs.json                // Component metadata to be used in docs
```

Please review the related docs and ADRs below for more information on how to structure your component and the best practices we follow:

- [ADR 1: File structure](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-013-file-structure.md)
- [ADR 2: Snapshot tests](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-011-snapshot-tests.md)
- [ADR 3: Storybook formatting](https://github.com/github/primer/blob/main/adrs/2022-10-07-storybook-lookbook-story-format.md)
- [Testing docs](https://github.com/primer/react/blob/main/contributor-docs/testing.md)

### Component patterns

Here's an example of a basic component written in the style of Primer react components:

```tsx
import type React from 'react'
import styles from './Component.module.css'
import {clsx} from 'clsx'

export type ComponentProps = {
  prop?: 'value1' | 'value2'
  className?: string
} & SxProp

const Component: React.FC<React.PropsWithChildren<ComponentProps>> = ({
  prop = 'value1',
  children,
  className,
  ...props
}) => {
  return (
    <nav className={clsx(className, styles.Nav)} {...props}>
      {children}
    </nav>
  )
}

Component.displayName = 'Component'

export default Component
```

### SSR compatibility

Every Primer React component should be compatible with server-side rendering (SSR).
We consider a component SSR-compatible if it...

1. can be rendered server-side without errors (i.e., doesn’t misuse DOM globals or useLayoutEffect).
1. doesn’t cause layout shift during hydration.

We use [`eslint-plugin-ssr-friendly`](https://github.com/kopiro/eslint-plugin-ssr-friendly) to prevent misuse of DOM globals. If you see an error from this plugin, please fix it before merging your PR.

### Adding the `className` prop

Each component should accept a prop called `className` that allows for consumers to pass along a custom class. Only pass a `className` to the top level dom element of each component and sub component.

For multiple classnames, use `clsx` to merge them together.

```tsx
import {clsx} from 'clsx'
import styles from './Component.module.css'

const Nav = ({className}) => {
  return (
    <nav className={clsx(className, styles.Nav)} {...props}>
      {children}
    </nav>
  )
}
```

### Linting

#### ESLint

We use the [React configuration](https://github.com/github/eslint-plugin-github/blob/master/lib/configs/react.js) from [GitHub's eslint plugin](https://github.com/github/eslint-plugin-github) to lint our code. To check your work before pushing, run:

```sh
npm run lint
```

Or, you can use [npx] to run eslint on one or more specific files:

```sh
npx eslint src/**/MyComponent.tsx
```

**Protip:** The [eslint `--fix` flag](https://eslint.org/docs/user-guide/command-line-interface#--fix) can automatically fix most linting errors, such as those involving whitespace or incorrect ordering of object keys and imports. You can fix those issues across the entire project with:

```sh
npm run lint -- --fix
```

**Protip:** `npm run lint -- --quiet` (or `npx eslint --quiet ...`) will suppress warnings so that you can focus on fixing errors.

#### Markdownlint

We use [markdownlint](https://github.com/markdownlint/markdownlint) to lint Markdown files, using [GitHub's markdownlint-github configuration](https://github.com/github/markdownlint-github). To check your work before pushing, run:

```sh
npm run lint:md
```

#### Stylelint

We use the [Primer stylelint config](https://github.com/primer/stylelint-config) to lint CSS files. To check your work before pushing, run:

```sh
npm run lint:css
```

Some CSS rules can be autofixed by running the following command:

```sh
npm run lint:css:fix
```

### TypeScript support

Primer React is written in TypeScript. We include type definitions in our built artifacts. To check types, run the `type-check` test script:

```
npm run test:type-check
```

### Additional resources

- [Primer Components Philosophy](https://primer.style/guides/react/philosophy)
- [Primer Components Core Concepts](https://primer.style/guides/react/core-concepts)
- [Authoring CSS](./authoring-css.md)

## Writing documentation

We use [Doctocat](https://github.com/primer/doctocat) to power our documentation site at [https://primer.style/react](https://primer.style/react/).

To add a new component to our documentation site, create a new file with the `.mdx` extension for your component in `docs/content` (e.g. `docs/content/Component.mdx`) and make sure to import the component's metadata from the component's `docs.json` file:

```
primer-react/
├─ docs/
│  ├─ content/
│  │  ├─ Component.mdx
```

```
import data from '../../../src/Component/Component.docs.json'
```

## Creating a pull request

When creating a new pull request, please follow the guidelines in the auto-populated pull request template. Be sure to add screenshots of any relevant work, including their alt texts and a thoughtful description.

### Adding changeset to your pull request

We use [changesets](https://github.com/changesets) to manage our releases. When creating a new pull request, `changeset-bot` will remind you to add a changeset if your change should trigger a new version number for the package.

To create a new changeset on your local machine, run `npx changeset` and answer the prompts. Please refer to our [versioning docs](https://github.com/primer/react/blob/37cfd07fb1eef4c0655157a0c9025cec94abaed5/contributor-docs/versioning.md) if you are not sure what kind of change you are making.

If you are introducing multiple features in the PR, add a separate changeset for each.

Push your new changes along with the changeset file to your PR; changeset-bot will show that there are valid changesets in the PR.

### What to expect after opening a pull request

After opening a pull request, you should be receiving a response from Primer team within a day or two. A contributor of Primer React will review the pull request keeping the following items in mind:

#### What we look for in reviews

- Does the component follow our [Primer Components code style](#component-patterns)?
- Does the component use theme values for most CSS values?
- Is the component API intuitive?
- Does the component have the appropriate [type definitions in `index.d.ts`](#typescript-support)?
- Is the component documented accurately?
- Does the component have sufficient tests?
- Does the pull request increase the bundle size significantly?
- Do all the checks pass?

If everything looks great, the reviewer will approve the pull request and feel free to merge it afterwards. Minor and patch changes are released weekly, and we bundle up breaking changes and release a major version of `@primer/react` twice a year. If your pull request is time-sensitive, please let Primer team know.

### Previewing your changes

We have a GitHub Action that creates a preview of the docs site and the storybook everytime you commit code to a branch. To view the preview site and the preview storybook, navigate to the PR and find the comment from the `github-actions` bot for storybook and `primer` bot for the docs preview. This will include a link to the preview site and the storybook for your branch.

## Deploying

All of our documentation sites use GitHub Pages to deploy documentation changes whenever code is merged into main.
Once you merge your branch into main, any changes to the docs and the storybook will automatically deploy when a new release of `@primer/react` is published. No further action is necessary.

## Troubleshooting

**`npm start` fails with an error like `gatsby: command not found`**

Make sure to run `npm install` from inside the `docs/` subfolder _as well as_ the root folder.

**`npm start` fails with a different error**

Ensure you are using the latest minor of Node.js for the major version specified in the `.nvmrc` file. For example, if `.nvmrc` contains `8`, make sure you're using the latest version of Node.js with the major version of 8.
