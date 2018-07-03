import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Block from './Block'
import {mapFlexProps} from './props'

const FlexContainer = props => {

  const {className, children, ...rest} = mapFlexProps(
    props
  )

  return (
    <Block {...rest} className={className}>
      {children}
    </Block>
  )
}

FlexContainer.propTypes = {
  flex: PropTypes.oneOf(['flex', 'inline-flex']),
  wrap: PropTypes.oneOf(['wrap', 'nowrap']),
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column']),
  justifyContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
  alignItems: PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch']),
  alignContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'stretch'])
}
export default FlexContainer
