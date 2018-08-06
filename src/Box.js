import React from 'react'
import Block from './Block'
import {withDefaultTheme} from './system-props'

const Box = props => <Block {...props} />

Box.defaultProps = {
  bg: 'white',
  border: 1,
  borderColor: 'gray.2',
  borderRadius: 1
}

Box.propTypes = {
  ...Block.propTypes
}

export default withDefaultTheme(Box)
