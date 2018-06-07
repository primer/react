import React from 'react'
import PropTypes from 'prop-types'
import chameleon from './chameleon'
import map, {classifier, expander, oneOrMoreOf, stylizer, valueMapper} from './props'

const classifyBlockProps = classifier({
  bg: value => `bg-${value}`,
  border: expander(valueMapper({
    true: 'border',
    false: 'border-0'
  }, null, value => `border-${value}`)),
  fg: value => `text-${value}`,
  position: value => `position-${value}`,
  round: value => `rounded-${value}`,
  shadow: valueMapper({
    true: 'box-shadow'
  }, null, value => `box-shadow-${value}`)
})

const styleProps = [
  'width', 'minWidth', 'maxWidth',
  'height', 'minHeight', 'maxHeight'
]

const stylize = stylizer(styleProps)

const mapBlockProps = props => classifyBlockProps(map(stylize(props)))

const Block = chameleon('div', mapBlockProps)

Block.propTypes = {
  bg: PropTypes.string,
  border: oneOrMoreOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])),
  fg: PropTypes.string,
  position: PropTypes.oneOf(['absolute', 'fixed', 'relative']),
  round: PropTypes.number,
  shadow: PropTypes.oneOf([true, 'medium', 'large', 'extra-large']),
  ...map.propTypes
}

styleProps.forEach(prop => Block.propTypes[prop] = PropTypes.number)

export default Block
