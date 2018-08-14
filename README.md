# Primer react

[Primer](https://primer.github.io/) React components

## Status

**⚠️ This project is WIP and not ready for production use yet!**

Currently we link to the latest build of [Primer CSS] so that we may use current Primer styles to start to build components. This does not include `primer-base` so as to avoid unwanted base overrides.

## Installation

Install primer-react in your project with npm:

```
npm install primer-react
```

## Usage

**If you are upgrading from a version before `1.0.0-beta`, please read the [migration docs](migrating.md).**

All of our components are exported by name from `primer-react`, so you can import them with:

```js
import {
  Box,
  Button,
  Heading,
  Text
} from 'primer-react'
```

### Styling

This project uses [emotion] under the hood to generate static CSS from _some_ component styles, but still relies on [Primer CSS] for some component styles that haven't yet been ported over.

To ensure proper styling, you'll need to link to the most recent build of [Primer CSS] in one of the following ways:

1. If you're using webpack, you can install [style-loader](https://github.com/webpack-contrib/style-loader) and [css-loader](), `import 'primer/build/build.css'` in your bundle, and include the following in your webpack config's `module.rules` list:

    ```js
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
    ```

1. **For pre-production applications**, you can link directly to [the build on unpkg.com](https://unpkg.com/primer/build/build.css).

1. Otherwise, you can `npm install --save primer` and either or link `node_modules/primer/build/build.css` to your source directory.

## Local Development

To run `primer-react` locally when adding or updating components:

1. Clone this repo: `git clone https://github.com/primer/primer-react`
1. Install dependencies: `npm install`
1. Run the dev app: `npm start`

Remember to build the documentation before publishing with `npm run build:docs`

### Code Style

We use the [React configuration](https://github.com/github/eslint-plugin-github/blob/master/lib/configs/react.js)
from [GitHub's eslint plugin](https://github.com/github/eslint-plugin-github)
to lint our JavaScript. To check your work before pushing, run:

```
npm run lint
```

Or, you can use [npx] to run eslint on one or more specific files:


```sh
# lint the component and the tests in src/__tests__
npx eslint src/**/MyComponent.js
```

**Protip:** The [eslint `--fix` flag](https://eslint.org/docs/user-guide/command-line-interface#--fix)
can automatically fix most linting errors, such as those involving whitespace
or incorrect ordering of object keys and imports. You can fix those issues
across the entire project with:

```sh
npm run lint -- --fix
```

**Protip:** `npm run lint -- --quiet` (or `npx eslint --quiet ...`) will
suppress warnings so that you can focus on fixing errors.

### Testing

We test our components with [Jest](https://facebook.github.io/jest/) and
[react-test-renderer](https://reactjs.org/docs/test-renderer.html). You can run
the tests locally with `npm test` (or `npm t`). To run the tests as you work,
run Jest in watch mode with:

```
npm t -- --watch
```

See [`src/__tests__/example.js`](src/__tests__/example.js) for an
example of how we're testing our components.

#### Code coverage

A code coverage report is included in the `npm test` output, and
test coverage data is generated in the `coverage/` directory.

## Principles

- Everything is a component.
- Aim for total style encapsulation; don't rely on inheritance to provide default styles.
- Build small building blocks with minimal props to keep complexity low.
- Keep system constrained by only including props needed per component.
- Favor extending or wrapping components for more complex operations.
- Maintain design system consistency with utilities as props (for spacing, color, font-size, line-height, widths, and radii).


[emotion]: https://emotion.sh/
[npx]: https://www.npmjs.com/package/npx
[Primer CSS]: https://github.com/primer/primer
