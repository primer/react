import React from 'react'
import Text from './Text'

const Heading = props => <Text {...props} />

Heading.defaultProps = {
  tag: 'h1',
  fontSize: 5,
  m: 0
}

Heading.propTypes = {
  ...Text.propTypes
}

export default Heading
