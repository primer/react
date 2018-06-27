import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { generateResponsiveClasses } from './props'

const FlexItem = ({children, flexAuto, alignSelf, breakpoint}) => {
  const classes = classnames(
    {'flex-auto': flexAuto},
    alignSelf ? `flex-self-${alignSelf}` : null,
  );

  return (
    <div className={classes}>{children}</div>
  )
}

FlexItem.propTypes = {
  flexAuto: PropTypes.bool,
  alignSelf: PropTypes.oneOf(['auto', 'start', 'end', 'center', 'baseline', 'stretch']),
  breakpoint: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])

}
export default FlexItem
