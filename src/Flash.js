import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

injectGlobal(sass`
  @import "primer-alerts/index.scss";
`)

const schemeMap = {
  green: 'success',
  red: 'error',
  yellow: 'warn'
}

function proto({children, className, full, scheme}) {
  const classes = classnames(className, 'flash', full && 'flash-full', scheme && `flash-${schemeMap[scheme]}`)
  return <div className={classes}>{children}</div>
}

const Flash = styled(proto)(COMMON)

Flash.defaultProps = {
  theme
}

Flash.propTypes = {
  children: PropTypes.node,
  full: PropTypes.bool,
  scheme: PropTypes.oneOf(Object.keys(schemeMap)),
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default Flash
