import React from 'react'
import PropTypes from 'prop-types'
import {arc as Arc, pie as Pie} from 'd3-shape'
import DonutSlice from './DonutSlice'
import {oneOrMoreOf} from './props'
import {spacing} from './mappers'

function mapData(data) {
  return Object.keys(data).map(key => <DonutSlice key={key} state={key} value={data[key]} />)
}

const DonutChart = props => {
  const {data, children = mapData(data), size = 30, ...rest} = props
  const {className} = spacing(rest)

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

DonutChart.propTypes = {
  // require elements, not mixed content: <DonutSlice>, <title>, etc.
  children: oneOrMoreOf(PropTypes.element),
  data: PropTypes.objectOf(PropTypes.number),
  size: PropTypes.number
}

export default DonutChart
