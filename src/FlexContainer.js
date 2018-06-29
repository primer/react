import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Block from './Block'

const FlexContainer = ({children, inline, wrap, direction, justifyContent, alignItems, alignContent, ...rest}) => {
  const classes = classnames(
    {
      'd-flex': !inline,
      'd-inline-flex': inline
    },
    wrap ? `flex-${wrap}` : null,
    direction ? `flex-${direction}` : null,
    justifyContent ? `flex-justify-${justifyContent}` : null,
    alignItems ? `flex-items-${alignItems}` : null,
    alignContent ? `flex-content-${alignContent}` : null
  )

  return (
    <Block {...rest} className={classes}>
      {children}
    </Block>
  )
}

FlexContainer.propTypes = {
  inline: PropTypes.bool,
  wrap: PropTypes.oneOf(['wrap', 'nowrap']),
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column']),
  justifyContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
  alignItems: PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch']),
  alignContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'stretch'])
}
export default FlexContainer
