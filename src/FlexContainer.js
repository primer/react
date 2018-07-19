import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Block from './Block'
import {mapAllProps} from './props'

const FlexContainer = props => {

  const {className, children, ...rest} = mapAllProps(
    props
  )

  return (
    <Block {...rest} className={className}>
      {children}
    </Block>
  )
}

FlexContainer.propTypes = {
  display: PropTypes.oneOf(['flex', 'inline-flex']),
  wrap: PropTypes.oneOf(['wrap', 'nowrap']),
  alignContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'stretch']),
  alignItems: PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch']),
  children: PropTypes.node,
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column']),
  inline: PropTypes.bool,
  justifyContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
  wrap: PropTypes.oneOf(['wrap', 'nowrap'])
}

FlexContainer.defaultProps = {
  display: 'flex'
}

export default FlexContainer
