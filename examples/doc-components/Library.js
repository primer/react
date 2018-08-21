import React from 'react'
import PropTypes from 'prop-types'
import {join} from 'path'
import {Route, withRouter} from 'react-router-dom'
import {Box, FlexContainer, Heading} from '../../src'
import SideNav from './SideNav'

const Library = withRouter(props => {
  const {basename, examples: exampleMap, children, title, ...rest} = props

  const examples = Object.values(exampleMap)
    .map(({name, element, path}) => ({
      name,
      element,
      path: path || join(basename, name)
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  // this is a StaticRouter render prop; no need to pass it on
  delete rest.staticContext

  return (
    <FlexContainer {...rest}>
      <SideNav basename={basename} title={title} examples={examples} width={1 / 8} mr={4} />
      <Box width={7 / 8}>
        <Route
          exact
          path={basename}
          render={() => <Content title={title}>{children}</Content>}
        />
        {examples.map(({name, element, path}) => (
          <Route
            key={name}
            path={path}
            render={() => <Content title={name} children={element} />}
          />
        ))}
      </Box>
    </FlexContainer>
  )
})

function Content({title, children, ...rest}) {
  return (
    <Box id="content" {...rest}>
      <Heading is="h1" mb={3}>
        {title}
      </Heading>
      {children}
    </Box>
  )
}

const ExampleShape = PropTypes.shape({
  element: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string
})

Library.propTypes = {
  basename: PropTypes.string,
  children: PropTypes.node,
  examples: PropTypes.oneOfType([PropTypes.objectOf(ExampleShape), PropTypes.arrayOf(ExampleShape)]),
  title: PropTypes.node
}

export default Library
