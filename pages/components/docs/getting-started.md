# Getting Started

To get started using Primer Components, run `npm install @primer/components` in your application.

You can now start importing Primer Components! There are a few ways to import Primer Components. You can either:

Import them individually from the main bundle

```
import {Box, Flex} from '@primer/components'
```

or, if you've configured your application to tree-shake with webpack, you can import them indivdually from the `src` folder:

```
import Box from '@primer/components/src/Box'
import Flex from '@primer/components/src/Flex'

```


## Installing Peer Dependencies

Primer Components is shipped with a few libraries labeled as peer dependencies. These libraries are separated because they are commonly already installed in the host project. This keeps the bundle size down and allows you to specify the version number you'd like in your own project.

Before getting started using Primer Components, make sure that the following libraries are installed in your host project:

- `styled-components` at versions 4.0.0 or higher
- `react` at versions 16.8.0 and higher


## BaseStyles

In order to set basic color, font-family, and line-heights across your project, you will need to establish base Primer styles for your app by wrapping all of your Primer components in `<BaseStyles>`:

```jsx
import {BaseStyles, Box, Heading} from '@primer/components'

export default MyApp () => (
  <BaseStyles>
    <Box m={4}>
      <Heading mb={2}>Hello, world!</Heading>
      <p>This will get Primer text styles.</p>
    </Box>
  </BaseStyles>
)
```

This will set the `color`, `font-family`, and `line-height` CSS properties to the same ones used [to style `<body>` in Primer CSS](https://github.com/primer/css/blob/master/src/base/base.scss#L15-L20).
