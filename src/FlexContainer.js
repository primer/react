import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { generateResponsiveClasses } from './props'

const FlexContainer = ({ children ,inline, wrap, direction, flexAuto, justifyContent, alignItems, alignContent, alignSelf, breakpoint }) => {
  let classes = classnames(
    {
      'd-flex': !inline,
      'd-inline-flex': inline,
      'flex-auto': flexAuto,

    },
    wrap ? `flex-${wrap}` : null,
    direction ? `flex-${direction}` : null,
    justifyContent ? `flex-justify-${justifyContent}` : null,
    alignItems ? `flex-items-${alignItems}` : null,
    alignContent ? `flex-content-${alignContent}` : null,
    alignSelf ? `flex-self-${alignSelf}` : null,
  );

  return (
    <div className={classes}>{children}</div>
  )
}

FlexContainer.propTypes = {
  inline: PropTypes.bool,
  wrap: PropTypes.oneOf(['wrap', 'nowrap']),
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column']),
  justifyContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
  alignItems: PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch']),
  alignContent: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'stretch']),
  flexAuto: PropTypes.bool,
  alignSelf: PropTypes.oneOf(['auto', 'start', 'end', 'center', 'baseline', 'stretch']),
  breakpoint: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])

}
export default FlexContainer
