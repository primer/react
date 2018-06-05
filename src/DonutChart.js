import React from 'react'
import PropTypes from 'prop-types'
import {arc as Arc, pie as Pie} from 'd3-shape'
import theme from './theme'

const {colors} = theme

const fillForState = {
  'error': colors.red[5],
  'pending': colors.yellow[5],
  'failure': colors.red[5],
  'success': colors.green[5]
}

const DEFAULT_FILL = colors.gray[5]

function mapData(data) {
  return Object.keys(data)
    .map((key, i) => (
      <DonutSlice key={key} state={key} value={data[key]} />
    ))
}

const DonutChart = props => {
  const {
    data,
    children = mapData(data),
    size = 40,
  } = props

  const radius = size / 2
  const {
    innerRadius = radius / 2
  } = props

  const pie = Pie()
    .value(child => child.props.value)

  const arcData = pie(children)
  const arc = Arc()
    .innerRadius(innerRadius)
    .outerRadius(radius)

  const arcs = React.Children.map(children, (child, i) => {
    const {
      state,
      fill = fillForState[state] || DEFAULT_FILL
    } = child.props
    return React.cloneElement(child, {
      d: arc(arcData[i]),
      fill,
      key: i
    })
  })

  return (
    <svg width={size} height={size}>
      <g transform={`translate(${radius},${radius})`}>
        {arcs}
      </g>
    </svg>
  )
}

const DonutSlice = ({children, d, fill}) => {
  return <path d={d} fill={fill}>{children}</path>
}

DonutChart.propTypes = {
  children: PropTypes.arrayOf(DonutSlice)
}

DonutSlice.propTypes = {
  d: PropTypes.string,
  fill: PropTypes.string,
  state: PropTypes.oneOf(Object.keys(fillForState)),
  value: PropTypes.number
}

export default DonutChart
export {DonutSlice}
