import React from 'react'
import DonutSlice from './DonutSlice'
import PropTypes from 'prop-types'
import {arc as Arc, pie as Pie} from 'd3-shape'

function mapData(data) {
  return Object.keys(data).map((key, i) => <DonutSlice key={key} state={key} value={data[key]} />)
}

const DonutChart = props => {
  const {data, children = mapData(data), size = 30} = props

  const radius = size / 2
  const innerRadius = radius - 6

  const pie = Pie().value(child => child.props.value)

  // coerce the children into an array
  const childList = React.Children.map(children, d => d)
  const arcData = pie(childList)
  const arc = Arc()
    .innerRadius(innerRadius)
    .outerRadius(radius)

  const slices = childList.map((child, i) => {
    return <DonutSlice {...child.props} d={arc(arcData[i])} key={i} />
  })

  return (
    <svg width={size} height={size}>
      <g transform={`translate(${radius},${radius})`}>{slices}</g>
    </svg>
  )
}

// see: <https://github.com/facebook/react/issues/2979>
const DonutPropType = PropTypes.shape({
  type: PropTypes.oneOf([DonutSlice])
})

DonutChart.propTypes = {
  children: PropTypes.oneOfType([DonutPropType, PropTypes.arrayOf(DonutPropType)]),
  data: PropTypes.objectOf(PropTypes.number),
  size: PropTypes.number
}

export default DonutChart
