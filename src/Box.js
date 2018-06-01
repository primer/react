import React from 'react'
import chameleon from './chameleon'
import map, {classifier, expander, valueMapper} from './props'

const classifyBoxProps = classifier({
  bg: value => `bg-${value}`,
  border: expander(valueMapper({
    true: 'border',
    false: 'border-0',
  }, null, value => `border-${value}`)),
  fg: value => `text-${value}`
})

const mapBoxProps = props => classifyBoxProps(map(props))

const Box = chameleon('div', mapBoxProps)

export default Box
export {mapBoxProps}
