import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {withSystemProps, COMMON} from './system-props'


function CounterLabel({scheme, children, className, ...rest}) {
  return <span className={classnames(className, 'Counter', scheme && `Counter--${scheme}`)}>{children}</span>
}

CounterLabel.propTypes = {
  children: PropTypes.node,
  scheme: PropTypes.oneOf(['gray', 'gray-light'])
}

export default withSystemProps(CounterLabel, COMMON)
