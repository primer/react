import React from 'react'
import chameleon from './chameleon'
import map, {classifier, valueMapper} from './props'

const classifyBoxProps = classifier({
  bg: value => `bg-${value}`,
  border: valueMapper({
    true: 'border',
    false: 'border-0',
  }, null, value => `border-${value}`),
  fg: value => `text-${value}`
})

const boxProps = props => classifyBoxProps(map(props))

const Box = chameleon('div', boxProps)
Box.span = Box.withComponent('span', false)

export default Box
