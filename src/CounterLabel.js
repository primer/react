import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {injectGlobal} from 'emotion'
import {withSystemProps, COMMON} from './system-props'
// eslint-disable-next-line no-unused
import sass from 'sass.macro'

injectGlobal(sass`
  @import "primer-support/index.scss";
  @import "primer-labels/lib/counters.scss";
`)

function CounterLabel({scheme, children, className}) {
  return <span className={classnames(className, 'Counter', scheme && `Counter--${scheme}`)}>{children}</span>
}

CounterLabel.propTypes = {
  children: PropTypes.node,
  scheme: PropTypes.oneOf(['gray', 'gray-light'])
}

export default withSystemProps(CounterLabel, COMMON)
