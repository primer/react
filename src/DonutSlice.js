import React from 'react'
import PropTypes from 'prop-types'
import theme from './theme'

const {colors} = theme

const defaultFill = colors.gray[4]

const fillForState = {
  'error': colors.red[5],
  'queued': colors.yellow[7],
  'pending': colors.yellow[7],
  'failure': colors.red[5],
  'success': colors.green[5],
  'unknown': defaultFill
}

const DonutSlice = props => {
  const {
    children,
    d,
    state,
    fill = fillForState[state] || defaultFill,
  } = props
  return <path d={d} fill={fill}>{children}</path>
}

DonutSlice.states = Object.keys(fillForState)

DonutSlice.propTypes = {
  d: PropTypes.string,
  fill: PropTypes.string,
  state: PropTypes.oneOf(DonutSlice.states),
  value: PropTypes.number
}

export default DonutSlice
export {defaultFill, fillForState}
