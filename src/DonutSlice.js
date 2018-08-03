import React from 'react'
import PropTypes from 'prop-types'
import {themeGet} from 'styled-system'
import system from './system-props'

const getUnknownColor = themeGet('colors.state.unknown', '#666')

const DonutSlice = props => {
  const {children, d, fill, state, value} = props
  const unknownColor = getUnknownColor(props)
  const color = fill || themeGet(`colors.state.${state}`, unknownColor)(props)
  return (
    <path d={d} fill={color} data-value={value}>
      {children}
    </path>
  )
}

DonutSlice.states = ['error', 'failure', 'pending', 'queued', 'success', 'unknown']

DonutSlice.propTypes = {
  // <title> is really the only thing that should be acceptable here
  children: PropTypes.shape({type: 'title'}),
  d: PropTypes.string,
  fill: PropTypes.string,
  state: PropTypes.oneOf(DonutSlice.states),
  /*
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      state: PropTypes.objectOf(PropTypes.string)
    })
  }),
  */
  value: PropTypes.number
}

export default system({is: DonutSlice})
