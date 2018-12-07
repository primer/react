import React from 'react'
import PropTypes from 'prop-types'
import {arc as Arc, pie as Pie} from 'd3-shape'
import styled from 'styled-components'
import {themeGet, space} from 'styled-system'
import theme from './theme'

const defaultColor = '#666'
const getStateColors = themeGet('colors.state', {})

function DonutBase(props) {
  const {className, data, children = mapData(data), size} = props

  const radius = size / 2
  const innerRadius = radius - 6

  const pie = Pie().value(child => child.props.value)

  // coerce the children into an array
  const childList = React.Children.toArray(children)
  const arcData = pie(childList)
  const arc = Arc()
    .innerRadius(innerRadius)
    .outerRadius(radius)

  const slices = childList.map((child, i) => {
    return React.cloneElement(child, {d: arc(arcData[i])})
  })

  return (
    <svg width={size} height={size} className={className}>
      <g transform={`translate(${radius},${radius})`}>{slices}</g>
    </svg>
  )
}

function mapData(data) {
  return Object.keys(data).map(key => <Slice key={key} state={key} value={data[key]} />)
}

const Donut = styled(DonutBase)(space)

Donut.defaultProps = {
  size: 30,
  theme
}

Donut.propTypes = {
  // require elements, not mixed content: <Slice>, <title>, etc.
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  data: PropTypes.objectOf(PropTypes.number),
  size: PropTypes.number,
  ...space.propTypes
}

const Slice = props => {
  const {children, d, fill, state, value} = props
  const stateColors = getStateColors(props)
  const color = fill || stateColors[state] || stateColors.unknown || defaultColor
  return (
    <path d={d} fill={color} data-value={value}>
      {children}
    </path>
  )
}

Slice.defaultProps = {
  theme
}

Slice.propTypes = {
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

Donut.Slice = Slice

export default Donut
