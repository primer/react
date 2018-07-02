import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {mapWhitespaceProps, oneOrMoreOf, stylizer} from './props'

const borderColors = [
  'black-fade',
  'blue',
  'blue-light',
  'gray-dark',
  'gray-light',
  'green',
  'green-light',
  'purple',
  'red',
  'red-light',
  'yellow'
]

const styleProps = ['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight']

const stylize = stylizer(styleProps)

function unique(values) {
  return values.filter((v, i) => values.indexOf(v) === i)
}

function getBorderClass(value, colorValue) {
  if (Array.isArray(value)) {
    return unique(value.map(getBorderClass))
  } else if (typeof value === 'boolean') {
    return value ? 'border' : 'border-0'
  } else if (value) {
    return `border-${value}`
  } else if (colorValue) {
    return 'border'
  }
}

const Block = props => {
  const {
    tag: Tag = 'div',
    children,
    className,
    bg,
    border,
    borderColor,
    borderRadius,
    display,
    fg,
    position,
    shadow,
    ...rest
  } = mapWhitespaceProps(props)

  const {style} = stylize(rest)

  return (
    <Tag
      className={classnames(
        className,
        getBorderClass(border, borderColor),
        borderColor && `border-${borderColor}`,
        display && `d-${display}`,
        bg && `bg-${bg}`,
        fg && `text-${fg}`,
        typeof borderRadius === 'number' && `rounded-${borderRadius}`,
        position && `position-${position}`,
        shadow && (shadow === true ? 'box-shadow' : `box-shadow-${shadow}`)
      )}
      style={style}
    >
      {children}
    </Tag>
  )
}

Block.propTypes = {
  bg: PropTypes.string,
  border: PropTypes.oneOfType([PropTypes.bool, oneOrMoreOf(PropTypes.oneOf(['top', 'right', 'bottom', 'left']))]),
  borderColor: PropTypes.oneOf(borderColors),
  borderRadius: PropTypes.oneOf([0, 1, 2]),
  children: PropTypes.element,
  display: PropTypes.oneOf(['inline', 'inline-block', 'none']),
  fg: PropTypes.string,
  position: PropTypes.oneOf(['absolute', 'fixed', 'relative']),
  shadow: PropTypes.oneOf([true, 'medium', 'large', 'extra-large']),
  ...mapWhitespaceProps.propTypes
}

for (const prop of styleProps) {
  Block.propTypes[prop] = PropTypes.number
}

export default Block
