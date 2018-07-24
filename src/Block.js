import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {colors} from './theme'
import {oneOrMoreOf, stylizer} from './props'
import {spacing} from './mappers'

const borderColors = Object.keys(colors.border)

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
  } = spacing(props)

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
        shadow && (shadow === 'small' ? 'box-shadow' : `box-shadow-${shadow}`)
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
  children: PropTypes.node,
  display: PropTypes.oneOf(['inline', 'inline-block', 'none']),
  fg: PropTypes.string,
  position: PropTypes.oneOf(['absolute', 'fixed', 'relative']),
  shadow: PropTypes.oneOf(['small', 'medium', 'large', 'extra-large']),
  ...spacing.propTypes
}

for (const prop of styleProps) {
  Block.propTypes[prop] = PropTypes.number
}

export default Block
