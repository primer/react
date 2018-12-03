import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

injectGlobal(sass`
  @import "primer-support/index.scss";
  @import "primer-labels/lib/counters.scss";
`)

function proto({scheme, children, className}) {
  return <span className={classnames(className, 'Counter', scheme && `Counter--${scheme}`)}>{children}</span>
}

const CounterLabel = styled(proto)`
  ${COMMON}
`

CounterLabel.defaultProps = {
  theme
}

CounterLabel.propTypes = {
  children: PropTypes.node,
  scheme: PropTypes.oneOf(['gray', 'gray-light']),
  ...COMMON.propTypes
}

export default CounterLabel
