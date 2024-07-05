# NPM Workspaces

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | 🚧     |

## Context

> tl;dr
>
> We have workspaces within the project but no official way of connecting them or managing dependencies from the top-level. Similarly, scripts that grow in size or complexity have no dedicated home or ability to manage dependencies outside of the top-level workspace.

The `primer/react` repo is composed of several workspaces that use `npm` to manage dependencies. In order to install these dependencies, a contributor needs to visit each directory and run `npm install`. The project also has a convenience script for this task, invoked through `npm run setup`, that goes through this process for contributors.

These distinct workspaces may sometimes depend on each other. For example, the `docs` workspace depends on the `@primer/react` package which is defined at the top-level of the project. Similarly, examples in the `examples/*` folders may also depend on `@primer/react`. Currently these dependencies are expressed either through relative paths, file dependencies in `package.json`, or symlinks through `npm link`.

There is also a collection of scripts under the `script` directory that exist in the project that involve varying levels of complexity and depth.

## Looking forward

As the project grows, we may look into supporting additional workspaces within the project in the form of experimental components or internal workspaces for projects the team is working on. We may also want a tighter integration between workspaces with respect to the `@primer/react` dependency so contributors don't have to worry about resolving or linking to the correct package during development.

## Decision

Setup the project to use [`npm` workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces). This will require changing the project to have a top-level `package.json` file which will use `workspaces` to reference child workspaces. The layout for the project would then be:

```
- root
  # Root package.json, defines workspaces
  - package.json

  # Workspaces
  - docs
  - packages
    - react
    - *
  - examples
    - nextjs
    - consumer-test
    - *

  # Top-level scripts
  - script

  # Testing & Development
  - .storybook
  - .playwright

  # Repo config
  - .github
  - .vscode
```

The following items will be installed and ran at the root-level:

- Linting
  - `eslint`
  - `markdownlint`
- Testing
  - Jest
  - Playwright
- Development
  - Storybook
- Type checking
  - TypeScript

Certain configuration items, like for TypeScript or Babel, may need configuration defined at the top-level and extended by child workspaces.

The current `@primer/react` package will move to the `packages/react` package. Workspaces that depend on `@primer/react` should reference the version of that package.

### Impact

- Scripts need to be updated
- GitHub Action paths need to be updated
- TypeScript refactor for base config
- Changeset support
- Performance from installing node modules for entire workspace
- Find workarounds in cases where legacy-peer-deps is required as an option

### Explorations

- Exploration into https://nx.dev/ for build tooling as npm workspaces does not support topological script ordering
