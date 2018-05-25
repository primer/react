import React from 'react'
import chameleon from './chameleon'
import map, {classifier, valueMapper} from './props'

const classifyTextProps = classifier({
  color: value => `text-${value}`,
  fontSize: valueMapper({
    0: '6',
    1: '5',
    2: '4',
    3: '3',
    4: '2',
    5: '1',
    6: '0',
  }, value => `f${value}`, true),
  fontWeight: value => `font-weight-${value}`,
  lineHeight: value => `lh-${value}`,
})

const textProps = props => classifyTextProps(map(props))

const Text = chameleon('span', textProps, true)

export default Text
