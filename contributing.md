# Contribution guidelines

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

## Code Style

We use the [React configuration](https://github.com/github/eslint-plugin-github/blob/master/lib/configs/react.js) from [GitHub's eslint plugin](https://github.com/github/eslint-plugin-github) to lint our JavaScript. To check your work before pushing, run:

```
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

## Testing

We test our components with [Jest](https://facebook.github.io/jest/) and [react-test-renderer](https://reactjs.org/docs/test-renderer.html). You can run the tests locally with `npm test` (or `npm t`). To run the tests as you work, run Jest in watch mode with:

```
npm t -- --watch
```

See [`src/__tests__/example.js`](src/__tests__/example.js) for examples of ways that we test our components.

### Code coverage

A code coverage report is included in the `npm test` output, and test coverage data is generated in the `coverage/` directory.

## Tools we use

1. We use [emotion] to style our components, and [emotion-theming] as the theme provider.
2. We use style functions from [styled-system] whenever possible, and styled-systems' `style()` function to create new ones.
3. We use [system-components] to reduce the amount of boilerplate needed to implement styled-system functions.

## Component patterns

With a couple of exceptions, all components should be created by the `withSystemProps()` function from `src/system-props.js`. This function takes a "component-ish" value as its first argument, and an array of [system props](#system-props) as the second:

```jsx
import {withSystemProps, POSITION} from './system-props'

function Component(props) {
  /* implementation */
}

export default withSystemProps(Component, POSITION)

// equivalent:
export default withSystemProps({is: Component}, POSITION)

// with more default props:
export default withSystemProps(
  {
    is: Component,
    m: 2
  },
  POSITION
)
```

Categories of system props are exported from `src/system-props`:

* `COMMON` includes color and spacing (margin and padding) props
* `TYPOGRAPHY` includes font family, font weight, and line-height
* `POSITION` includes positioning props
* `FLEX_CONTAINER` includes flexbox props for containers
* `FLEX_ITEM` includes flexbox props for items in a flex container

### Components with only system props

Components with only system props should be created by passing the default tag to `withSystemProps()`:

```jsx
import {withSystemProps, LAYOUT} from './system-props'

const Block = withSystemProps('div', LAYOUT)
```

### Primer CSS components
If you're just adding Primer CSS class names, you can pass the `className` prop to another component created with `withSystemProps()`, and it will be combined with any generated classes automatically:

```jsx
import Box from './Box'

function FancyBox({flashing, ...rest}) {
  return <Box className={flashing && 'Box--flashing'} {...rest} />
}

FancyBox.propTypes = {
  flashing: PropTypes.bool,
  // be sure to spread Box's prop-types
  ...Box.propTypes
}

FancyBox.defaultProps = {
  ...Box.defaultProps
}

// if you don't spread defaultProps from another system component,
// you will need to wrap the export in withDefaultTheme()
export default FancyBox
```

> **⚠️ If you use this pattern, passing the component to `withSystemProps()` should throw an error because system-components has an issue (_TODO: ref_) with calling the underlying component render function twice.**

With the above pattern, it's possible to control whether users may pass additional class names to your component. If you want to allow this, the `className` prop should be listed in `propTypes` and combined with your own classes using the [classnames] function:

```jsx
import classnames from 'classnames'
import Box from './Box'

export default function FancyBox({flashing, className, ...rest}) {
  const classes = classnames(className, flashing && 'Box--flashing')
  return <Box className={classes} {...rest} />
}

FancyBox.propTypes = {
  className: PropTypes.string,
  flashing: PropTypes.bool,
  ...Box.propTypes
}
```

Alternatively, you can create the component from scratch using `withSystemProps()`, and pass it the same system props:

```jsx
import classnames from 'classnames'
import {withSystemProps, LAYOUT, COMMON} from './system-props'

function FancyBox({flashing, className, is: Tag, ...rest}) {
  return (
    <Tag
      className={classnames(className, flashing && 'Box--flashing')}
      {...rest}
    />
  )
}

FancyBox.propTypes = {
  flashing: PropTypes.bool
}

export default withSystemProps(FancyBox, [...LAYOUT, ...COMMON])
```

In this case, you will need to deal explicitly with two props passed down from [emotion] and [system-components], respectively:

  * `className`: You _must_ render this prop, otherwise **your component will not be styled.**
  * `is`: This is what allows your component to render with arbitrary elements, and even other components. If you don't respect this prop, you should `delete Component.propTypes.is` to signal that it's not available.

## Writing documentation

We use [Next.js](https://github.com/zeit/next.js/) and [MDX Docs](https://github.com/jxnblk/mdx-docs/) to power our documentation site at [https://primer.style/components](https://primer.style/components/).

To add a new component to our documentation site:

1. Create a new file with the `.md` extension for your component in `pages/components/docs`.
2. Copy & paste the template from `doc-template.md` & replace placeholder brackets with relevant information.
3. Add the new file to the `index.js` in `pages/components/docs`

## Deployment
We deploy the Primer Components site using [Now]. Install the Now CLI and log in with:

```sh
npm i -g now
now login
```

Once you're logged in, sync your local git repo with the `master` branch and run:

```sh
script/deploy
```

This will create a new deployment and alias it to its production URL, [primer-components.now.sh](https://primer-components.now.sh).

### Path aliasing
This site is served as a subdirectory of [primer.style] using a [path alias](https://zeit.co/docs/features/path-aliases) configured in that repo's [`rules.json`](https://github.com/primer/primer.style/tree/master/rules.json). If you change the production deployment URL for this app, you will also need to change it there and re-deploy that app; otherwise, Now will automatically route requests from [primer.style/components](https://primer.style/components/) to the new deployment whenever you alias this one to `primer-components.now.sh`.


## Glossary

### System props
System props are style functions that provide on or more props, and can be passed directly the return value of [emotion]'s `styled()` function:

```jsx
import {styled} from 'react-emotion'
import {space} from 'styled-system'
const SpaceDiv = styled('div')(space)
```

System props come with `propTypes` that can be mixed into your own with ES6 [spread syntax]:

```jsx
SpaceDiv.propTypes = {
  stellar: PropTypes.bool,
  ...space.propTypes
}
```

[classnames]: https://www.npmjs.com/package/classnames
[emotion]: https://emotion.sh/
[emotion-theming]: https://github.com/emotion-js/emotion/tree/master/packages/emotion-theming
[spread syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
[styled-system]: https://jxnblk.com/styled-system/getting-started
[system-components]: https://jxnblk.com/styled-system/system-components
[table]: https://jxnblk.com/styled-system/table
[npx]: https://www.npmjs.com/package/npx
[Now]: https://zeit.co/now
[primer.style]: https://primer.style
