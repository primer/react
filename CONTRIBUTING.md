# Contribution guidelines
1. [Roadmap](#roadmap)
1. [Code style](#code-style)
2. [Testing](#testing)
    * [Code coverage](#code-coverage)
3. [Tools we use](#tools-we-use)
4. [Component patterns](#component-patterns)
    * [Components with only system props](#components-with-only-system-props)
    * [Primer CSS components](#primer-css-components)
5. [Writing Documentation](#writing-documentation)
6. [Deployment](#deployment)
7. [Glossary](#glossary)

## Roadmap
If you're looking for something to work on, a great place to start is our issues labeled [up for grabs](https://github.com/primer/components/issues?q=is%3Aopen+is%3Aissue+label%3A%22up+for+grabs%22)! If you've got a feature that you'd like to implement, be sure to check out our [Primer Components Roadmap](https://github.com/primer/components/projects/3) to make sure it hasn't already been started on.

## Code Style

We use the [React configuration](https://github.com/github/eslint-plugin-github/blob/master/lib/configs/react.js) from [GitHub's eslint plugin](https://github.com/github/eslint-plugin-github) to lint our JavaScript. To check your work before pushing, run:

```
yarn run lint
```

Or, you can use [npx] to run eslint on one or more specific files:


```sh
# lint the component and the tests in src/__tests__
npx eslint src/**/MyComponent.js
```

**Protip:** The [eslint `--fix` flag](https://eslint.org/docs/user-guide/command-line-interface#--fix) can automatically fix most linting errors, such as those involving whitespace or incorrect ordering of object keys and imports. You can fix those issues across the entire project with:

```sh
yarn run lint -- --fix
```

**Protip:** `yarn run lint -- --quiet` (or `npx eslint --quiet ...`) will suppress warnings so that you can focus on fixing errors.

## Testing

We test our components with [Jest](https://facebook.github.io/jest/) and [react-test-renderer](https://reactjs.org/docs/test-renderer.html). You can run the tests locally with `yarn test`. To run the tests as you work, run Jest in watch mode with:

```
yarn test -- --watch
```

See [`src/__tests__/example.js`](src/__tests__/example.js) for examples of ways that we test our components.

### Code coverage

A code coverage report is included in the `yarn test` output, and test coverage data is generated in the `coverage/` directory.

## Tools we use

1. We use [styled-components](https://www.styled-components.com/) to style our components.
2. We use style functions from [styled-system](https://styled-system.com/) whenever possible, and styled-systems' `style()` function to create new ones.


## Component patterns

With a couple of exceptions, all components should be created with the `styled` function from [styled-components] and should have the appropriate groups of system props attached.

Default values for system props can be set in `Component.defaultProps`.

Prop Types from system props such as `COMMON` or `TYPOGRAPHY` as well as styled-system functions can be spread in the component's prop types declaration (see example below).

 ⚠️ **Make sure to always set the default `theme` prop to our [theme](https://github.com/primer/components/blob/master/src/theme.js)! This allows consumers of our components to access our theme values without a ThemeProvider.**


```jsx
import {TYPOGRAPHY, COMMON} from './constants'
import theme from './theme'

const Component = styled.div`
  ${TYPOGRAPHY}
  ${COMMON};
`

Component.defaultProps = {
  theme, // make sure to always set the default theme!
  m: 0,
  fontSize: 5,
}

Component.propTypes = {
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes
}

export default Component
```

Categories of system props are exported from `src/constants.js`:

* `COMMON` includes color and spacing (margin and padding) props
* `TYPOGRAPHY` includes font family, font weight, and line-height props
* `POSITION` includes positioning props
* `FLEX_CONTAINER` includes flexbox props for containers
* `FLEX_ITEM` includes flexbox props for items in a flex container


## Writing documentation

We use [Doctocat](https://github.com/primer/doctocat) to power our documentation site at [https://primer.style/components](https://primer.style/components/).

To add a new component to our documentation site, create a new file with the `.md` extension for your component in `docs/content/components`.


## Deployment
We deploy the Primer Components site using [Now]. Install the Now CLI and log in with:

```sh
yarn global now
now login
```

Once you're logged in, sync your local git repo with the `master` branch and run:

```sh
script/deploy
```

This will create a new deployment and alias it to its production URL, [primer-components.now.sh](https://primer-components.now.sh).

### Path aliasing
This site is served as a subdirectory of [primer.style] using a [path alias](https://zeit.co/docs/features/path-aliases) configured in that repo's [`rules.json`](https://github.com/primer/primer.style/tree/master/rules.json). If you change the production deployment URL for this app, you will also need to change it there and re-deploy that app; otherwise, Now will automatically route requests from [primer.style/components](https://primer.style/components/) to the new deployment whenever you alias this one to `primer-components.now.sh`.

## Troubleshooting

**`yarn start` fails with an error like `gatsby: command not found`**

Make sure to run `yarn` from inside the `docs/` subfolder *as well as* the root folder.

** `yarn start` fails with a different error**

Ensure you are using the latest minor of Node.js for the major version specified in the `.nvmrc` file. For example, if `.nvmrc` contains `8`, make sure you're using the latest version of Node.js with the major version of 8.

## Glossary

### System props
System props are style functions that provide one or more props, and can be passed directly the return value of [styled-components]'s `styled()` function:

```jsx
import {styled} from 'styled-components'
import {space} from 'styled-system'
const SpaceDiv = styled.div`
  ${space}
`
```

System props come with `propTypes` that can be mixed into your own with ES6 [spread syntax]:

```jsx
SpaceDiv.propTypes = {
  stellar: PropTypes.bool,
  ...space.propTypes
}
```

[classnames]: https://www.npmjs.com/package/classnames
[spread syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
[styled-system]: https://styled-system.com
[table]: https://jxnblk.com/styled-system/table
[npx]: https://www.npmjs.com/package/npx
[Now]: https://zeit.co/now
[primer.style]: https://primer.style
