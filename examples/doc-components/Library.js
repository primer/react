import React from 'react'
import PropTypes from 'prop-types'
import {Route, withRouter} from 'react-router-dom'
import {Box, FlexContainer, Heading} from '../../src'
import SideNav from './SideNav'

const Library = withRouter(function({examples, title, basename, children, ...rest}) {
  delete rest.staticContext
  return (
    <FlexContainer {...rest}>
      <SideNav basename={basename} title={title} examples={examples} mr={4} />
      <Box>
        <Route
          path={basename}
          exact
          render={() => (
            <React.Fragment>
              <Heading is="h1" mb={3}>
                {title}
              </Heading>
              {children}
            </React.Fragment>
          )}
        />
        {examples.map(example => (
          <Route
            key={example.name}
            path={example.path || '/'}
            render={() => (
              <React.Fragment>
                <Heading is="h1" mb={3}>
                  {example.name}
                </Heading>
                {example.element}
              </React.Fragment>
            )}
          />
        ))}
      </Box>
    </FlexContainer>
  )
})

Library.propTypes = {
  basename: PropTypes.string,
  children: PropTypes.node,
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      element: PropTypes.element,
      name: PropTypes.string,
      path: PropTypes.string
    })
  ),
  title: PropTypes.node
}

export default Library
