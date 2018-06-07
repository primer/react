import React from 'react'
import PropTypes from 'prop-types'
import chameleon from './chameleon'
import map, {classifier, expander, oneOrMoreOf, valueMapper} from './props'

const classifyBlockProps = classifier({
  bg: value => `bg-${value}`,
  border: expander(valueMapper({
    true: 'border',
    false: 'border-0',
  }, null, value => `border-${value}`)),
  fg: value => `text-${value}`,
  round: value => `rounded-${value}`
})

const mapBlockProps = props => classifyBlockProps(map(props))

const Block = chameleon('div', mapBlockProps)

Block.propTypes = {
  bg: PropTypes.string,
  border: oneOrMoreOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])),
  fg: PropTypes.string,
  round: PropTypes.number,
  ...map.propTypes
}

export default Block
