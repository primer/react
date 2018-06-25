# Primer react

[Primer](https://primer.github.io/) React components

## Status

⚠️ This project is WIP and not ready for production use yet!

Currently we link to the latest built Primer CSS so that we may use current Primer styles to start to build components. This does not include `primer-base` so as to avoid unwanted base overrides.

## Installation

Install primer-react in your project with:

`npm install primer-react`

## Local Development

Run `primer-react` locally when adding or updating components.

Clone this repo: `$ git clone https://github.com/primer/primer-react.git`

To run `primer-react` locally when adding or updating components:

1. Clone this repo: `$ git clone https://github.com/primer/primer-react.git`
1. Install dependencies: `npm install`
1. Run the dev app with: `npm start`

Remember to build docs before publishing with: `npm run build`

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

## Principles

- Everything is a component.
- Aim for total style encapsulation, don't rely on inheritance to provide default styles.
- Build small building blocks with minimal props to keep complexity low.
- Keep system constrained by only including props needed per component.
- Favor extending or wrapping components for more complex operations.
- Maintain design system consistency with utilities as props (for spacing, color, font-size, line-height, widths, and radii).


[npx]: https://www.npmjs.com/package/npx
