import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import {oneOrMoreOf} from './props'
import {common} from './mappers'

const FlexContainer = props => {
  const {className, children, ...rest} = common(props)
  return (
    <Block {...rest} className={className}>
      {children}
    </Block>
  )
}

FlexContainer.propTypes = {
  ...common.propTypes,
  alignContent: oneOrMoreOf(PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'stretch'])),
  alignItems: oneOrMoreOf(PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch'])),
  children: PropTypes.node,
  direction: oneOrMoreOf(PropTypes.oneOf(['row', 'row-reverse', 'column'])),
  display: oneOrMoreOf(PropTypes.oneOf(['flex', 'inline-flex'])),
  justifyContent: oneOrMoreOf(PropTypes.oneOf(['start', 'end', 'center', 'between', 'around'])),
  wrap: oneOrMoreOf(PropTypes.oneOf(['wrap', 'nowrap']))
}

FlexContainer.defaultProps = {
  display: 'flex'
}

export default FlexContainer
