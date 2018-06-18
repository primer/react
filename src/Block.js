import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import map, {oneOrMoreOf, stylizer} from './props'

const styleProps = [
  'width', 'minWidth', 'maxWidth',
  'height', 'minHeight', 'maxHeight'
]

const stylize = stylizer(styleProps)

const exclusiveBorderValues = new Set([
  'top',
  'right',
  'bottom',
  'left',
  0
])

function unique(values) {
  return values.filter((v, i) => values.indexOf(v) === i)
}

function getBorderClass(value) {
  if (Array.isArray(value)) {
    return unique(value.map(getBorderClass))
  } else if (typeof value === 'boolean') {
    return value ? 'border' : 'border-0'
  } else if (value) {
    return `border-${value}`
  }
}

const Block = props => {
  const {
    tag: Tag = 'div',
    children,
    className,
    bg,
    border,
    fg,
    position,
    round,
    shadow,
    ...rest
  } = map(props)

  const {style} = stylize(rest)

  return (
    <Tag className={classnames(
      className,
      getBorderClass(border),
      bg && `bg-${bg}`,
      fg && `text-${fg}`,
      position && `position-${position}`,
      (typeof round === 'number') && `rounded-${round}`,
      shadow && ((shadow === true) ? 'box-shadow' : `box-shadow-${shadow}`)
    )} style={style}>
      {children}
    </Tag>
  )
}

Block.propTypes = {
  bg: PropTypes.string,
  border: oneOrMoreOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number
  ])),
  fg: PropTypes.string,
  position: PropTypes.oneOf(['absolute', 'fixed', 'relative']),
  round: PropTypes.number,
  shadow: PropTypes.oneOf([true, 'medium', 'large', 'extra-large']),
  display: PropTypes.oneOf(['inline', 'inline-block']),
  ...map.propTypes
}

styleProps.forEach(prop => Block.propTypes[prop] = PropTypes.number)

export default Block
