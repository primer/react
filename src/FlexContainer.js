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
    wrap && `flex-${wrap}`,
    direction && `flex-${direction}`,
    justifyContent && `flex-justify-${justifyContent}`,
    alignItems && `flex-items-${alignItems}`,
    alignContent && `flex-content-${alignContent}`
  )

  return (
    <Block {...rest} className={classes}>
      {children}
    </Block>
  )
}

FlexContainer.propTypes = {
  alignContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'stretch']),
  alignItems: PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch']),
  children: PropTypes.node,
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column']),
  inline: PropTypes.bool,
  justifyContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
  wrap: PropTypes.oneOf(['wrap', 'nowrap'])
}

export default FlexContainer
