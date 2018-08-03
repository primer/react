import React from 'react'
import PropTypes from 'prop-types'
import {colors} from './theme'
import {themeGet} from 'styled-system'
import system from './system-props'

// FIXME: this sets default state colors to our theme,
// but this is probably not good practice!
const getStateColors = themeGet('colors.state', colors.state)

const DonutSlice = props => {
  const {children, d, fill, state, value} = props
  const stateColors = getStateColors(props)
  const color = fill || stateColors[state || 'unknown']
  return (
    <path d={d} fill={color} data-value={value}>
      {children}
    </path>
  )
}

DonutSlice.states = Object.keys(colors.state)

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

export default DonutSlice
