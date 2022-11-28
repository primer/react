# Contribution guidelines

1. [Roadmap](#roadmap)
2. [Before Getting Started](#before-getting-started)
3. [Discussing non-public features or products](#discussing-non-public-features-or-products)
4. [Developing Components](#developing-components)
   - [Tools we use](#tools-we-use)
   - [Component patterns](#component-patterns)
   - [Adding the sx prop](#adding-the-sx-prop)
   - [Linting](#linting)
   - [TypeScript support](#typescript-support)
   - [Additional resources](#additional-resources)
5. [Writing documentation](#writing-documentation)
6. [Creating a pull request](#creating-a-pull-request)
   - [What to expect after opening a pull request](#what-to-expect-after-opening-a-pull-request)
   - [What we look for in reviews](#what-we-look-for-in-reviews)
7. [Deploying & publishing](#deploying-and-publishing)
   - [Deploying](#deploying)
   - [Path aliasing](#path-aliasing)
   - [Publishing](#publishing)
8. [Troubleshooting](#troubleshooting)

## Roadmap

If you're looking for something to work on, a great place to start is our issues labeled [up for grabs](https://github.com/primer/react/issues?q=is%3Aopen+is%3Aissue+label%3A%22up+for+grabs%22)! If you've got a feature that you'd like to implement, be sure to check out our [Primer Components Roadmap](https://github.com/primer/react/projects/3) to make sure it hasn't already been started on.

## Before Getting Started

A common question asked about Primer Components is how to know what should be added to Primer Components and what is best left as a local component in a consuming application. Though there are no hard & fast rules about what can and cannot be added to Primer Components, here are a few things we take into consideration:

- Is the new feature an existing pattern in Primer CSS or related to UI built at GitHub? Primer Components is first and foremost a library for building UI at GitHub - patterns that aren't currently being used in GitHub UI (either on github.com or in a GitHub owned project outside of github.com) probably shouldn't be added to Primer Components. Exceptions to this could be helper components that don't necessarily render UI but help with the development process (like `Box`).

- Does the proposed component get used in more than one or two places across GitHub UI? A component that's only meant to be used in one place and doesn't have potential to be reused in many places probably should exist as a local component. An example of something like this might be a component that renders content specific to a single GitHub product.

**In general, we tend to be pretty excited about 99% of feature proposals and contributions!** If you would like to get started with a component proposal, open an issue using the [component proposal template](https://github.com/primer/react/issues/new?template=new_component_proposal_template.md).

## Discussing non-public features or products

As this is a public repo, please be careful not to include details or screenshots from unreleased GitHub products or features. In most cases, a good bug report, feature request, or pull request should be able to describe the work without including business logic or feature details, but if you must discuss context relating to an unreleased feature, please open an issue in the private [Design Systems repo](https://github.com/github/design-systems/issues/new/choose) and link to it in your issue or pull request.

## Developing components

We primarily use our documentation site as a workspace to develop new components or make changes to existing components (stay tuned for a better development environment coming soon!).

Before running the documentation site locally, make sure to install [Node.js](https://nodejs.org/en/) v16 (we recommend using [nvm](https://github.com/nvm-sh/nvm)). Next, run the following command to setup your environment:

```sh
npm run setup
```

Afterwards, you can run the following command to start up the docs site and
storybook environment:

```sh
npm start
```

Navigate to http://localhost:8000/ to see the site in your browser ✨

### Tools we use

1. We use [styled-components](https://www.styled-components.com/) to style our components.
2. We use style functions from [styled-system](https://styled-system.com/) whenever possible, and styled-systems' `style()` function to create new ones.

### Component patterns

With a couple of exceptions, all components should be created with the `styled` function from [styled-components] and should have the appropriate groups of system props attached.

Default values for system props can be set in `Component.defaultProps`.

⚠️ **Do not set the default `theme` prop! This can sometimes override the theme provided by the ThemeProvider and cause unexpected theming issues.**

Additionally, every component should support [the `sx` prop](https://primer.style/components/overriding-styles); remember to add `${sx}` to the style literal.

Here's an example of a basic component written in the style of Primer Components:

```tsx
import sx, {SxProp} from './sx'

const Component = styled.div<SxProp>`
  // additional styles here

  ${sx};
`

Component.defaultProps = {
  m: 0,
  fontSize: 5
}

export default Component
```

### Adding the `sx` prop

Each component should accept a prop called `sx` that allows for setting theme-aware ad-hoc styles. See the [overriding styles](https://primer.style/components/overriding-styles) doc for more information on using the prop.

To add the `sx` prop to your component: import the default export from the `sx` module, add it to your style definition, and add the appropriate prop types. **The `sx` prop should go at the _very end_ of your style definition.**

```tsx
import sx, {SxProp} from './sx'

const Component = styled.div<SxProp>`
  // additional styles here

  ${sx};
`
```

### Linting

We use the [React configuration](https://github.com/github/eslint-plugin-github/blob/master/lib/configs/react.js) from [GitHub's eslint plugin](https://github.com/github/eslint-plugin-github) to lint our JavaScript. To check your work before pushing, run:

```sh
npm run lint
```

Or, you can use [npx] to run eslint on one or more specific files:

```sh
# lint the component and the tests in src/__tests__
npx eslint src/**/MyComponent.js
```

**Protip:** The [eslint `--fix` flag](https://eslint.org/docs/user-guide/command-line-interface#--fix) can automatically fix most linting errors, such as those involving whitespace or incorrect ordering of object keys and imports. You can fix those issues across the entire project with:

```sh
npm run lint -- --fix
```

**Protip:** `npm run lint -- --quiet` (or `npx eslint --quiet ...`) will suppress warnings so that you can focus on fixing errors.

### TypeScript support

Primer React is written in TypeScript. We include type definitions in our built artifacts. To check types, run the `type-check` test script:

```
npm run test:type-check
```

### Additional resources

- [Primer Components Philosophy](https://primer.style/components/philosophy)
- [Primer Components Core Concepts](https://primer.style/components/core-concepts)
- [Styled Components docs](https://styled-components.com/)
- [Styled System docs](https://styled-system.com/)

## Writing documentation

We use [Doctocat](https://github.com/primer/doctocat) to power our documentation site at [https://primer.style/components](https://primer.style/components/).

To add a new component to our documentation site, create a new file with the `.md` extension for your component in `docs/content` (e.g. `docs/content/Button.md`).

## Creating a pull request

When creating a new pull request, please follow the guidelines in the auto-populated pull request template. Be sure to add screenshots of any relevant work and a thoughtful description.

### What to expect after opening a pull request

After opening a pull request, a member of the design systems team will add the appropriate labels (major, minor, patch release labels) and update the base branch to the correct release branch. Usually, you'll receive a response from the design systems team within a day or two. The design systems team member will review the pull request keeping the following items in mind:

### What we look for in reviews

- If it's a new component, does the component make sense to add to Primer Components? (Ideally this is discussed before the pull request stage, please reach out to a DS member if you aren't sure if a component should be added to Primer Components!)
- Does the component follow our [Primer Components code style](#component-patterns)?
- Does the component use theme values for most CSS values?
- Is the component API intuitive?
- Does the component have the appropriate [type definitions in `index.d.ts`](#typescript-support)?
- Is the component documented accurately?
- Does the component have appropriate tests?
- Does the pull request increase the bundle size significantly?

If everything looks great, the design systems team member will approve the pull request and merge when appropriate. Minor and patch changes are released frequently, and we try to bundle up breaking changes and avoid shipping major versions too often. If your pull request is time-sensitive, please let a design systems team member know. You do not need to worry about merging pull requests on your own, we'll take care of that for you :)

## Deploying and publishing

### Deploying

All of our documentation sites use GitHub Pages to deploy documentation changes whenever code is merged into main. The integration also creates a preview site every time you commit code to a branch. To view the preview site, navigate to the PR and find the comment from the `GitHub Actions` bot. This will include a link to the preview site for your branch.

Once you merge your branch into main, any changes to the docs will automatically deploy. No further action is necessary.

### Path aliasing

This site is served as a subdirectory of [primer.style] using a [path alias](https://zeit.co/docs/features/path-aliases) configured in that repo's [`rules.json`](https://github.com/primer/primer.style/tree/master/rules.json). If you change the production deployment URL for this app, you will also need to change it there and re-deploy that app; otherwise, Now will automatically route requests from [primer.style/components](https://primer.style/components/) to the new deployment whenever you alias this one to `https://primer.github.io/react/`.

### Publishing

We use [changesets](https://github.com/atlassian/changesets) to managing versioning, publishing, and release notes. Here's how it works:

#### Using changesets to prepare and publish a release

1. When creating a new PR, changeset-bot will remind you to add a changeset if your change should trigger a new version number for the package.
2. To create a new changeset on your local machine, run `npx changeset` and answer the prompts. If you are introducing multiple features in the PR, add a separate changeset for each.
3. Push your new changes along with the changeset file to your PR; changeset-bot will show that there are valid changesets in the PR.
4. When the PR is ready, merge it to the main branch.
5. The changeset action will automatically create a new PR that bumps the version number appropriately, creates or updates `CHANGELOG.md`, and shows the release notes that will be used in the GitHub Release notes.
6. If you want to release more features, merge them into the main branch and changesets will update the release PR. Note that it does this via force-pushing, so you should not edit the release PR yourself.
7. When you're ready to release, merge the release PR into the main branch and changesets will publish the new version to npm and create a GitHub Release.

#### Flowchart

[![changesets flowchart](https://user-images.githubusercontent.com/4608155/163011963-9de3e8a7-c4af-47ef-91d5-7c534f5066d7.png)](https://www.figma.com/file/UKFvby7MMwBWa7p9aly5JG/Next-major-release-workflow)

## Troubleshooting

**`npm start` fails with an error like `gatsby: command not found`**

Make sure to run `npm install` from inside the `docs/` subfolder _as well as_ the root folder.

**`npm start` fails with a different error**

Ensure you are using the latest minor of Node.js for the major version specified in the `.nvmrc` file. For example, if `.nvmrc` contains `8`, make sure you're using the latest version of Node.js with the major version of 8.

[classnames]: https://www.npmjs.com/package/classnames
[spread syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
[styled-system]: https://styled-system.com
[table]: https://jxnblk.com/styled-system/table
[npx]: https://www.npmjs.com/package/npx
[now]: https://zeit.co/now
[primer.style]: https://primer.style
