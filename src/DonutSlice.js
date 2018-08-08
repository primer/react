import React from 'react'
import PropTypes from 'prop-types'
import {themeGet} from 'styled-system'
import {withDefaultTheme} from './system-props'

const defaultColor = '#666'
const getStateColors = themeGet('colors.state', {})

function DonutSlice(props) {
  const {children, d, fill, state, value} = props
  const stateColors = getStateColors(props)
  const color = fill || stateColors[state] || stateColors.unknown || defaultColor
  return (
    <path d={d} fill={color} data-value={value}>
      {children}
    </path>
  )
}

DonutSlice.propTypes = {
  // <title> is really the only thing that should be acceptable here
  children: PropTypes.shape({type: 'title'}),
  d: PropTypes.string,
  fill: PropTypes.string,
  state: PropTypes.string,
  /* eslint-disable react/no-unused-prop-types */
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      state: PropTypes.objectOf(PropTypes.string)
    })
  }),
  /* eslint-enable */
  value: PropTypes.number
}

export default withDefaultTheme(DonutSlice)
