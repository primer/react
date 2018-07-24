import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import {composeWithPropTypes, oneOrMoreOf} from './props'
import {flex} from './mappers'

export default function FlexContainer(props) {
  const {children, inline, ...rest} = flex(props)
  if (!rest.display) {
    rest.display = inline ? 'inline-flex' : 'flex'
  }
  return (
    <Block {...rest}>
      {children}
    </Block>
  )
}

FlexContainer.propTypes = {
  ...flex.propTypes,
  children: PropTypes.node,
  inline: PropTypes.bool
}
