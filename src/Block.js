import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {composeWithPropTypes, oneOrMoreOf, stylizer} from './props'
import {bg, borderColor, borderRadius, color, display, fontSize, position, spacing} from './mappers'

const stylize = stylizer(['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight'])
const mapProps = composeWithPropTypes(bg, borderColor, borderRadius, color, display, fontSize, position, spacing, stylize)

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

export default function Block(props) {
  const providedBorderColor = props.borderColor
  const {tag: Tag, children, className, border, shadow, ...rest} = mapProps(props)

  const {style} = stylize(rest)

  return (
    <Tag
      className={classnames(
        className,
        getBorderClass(border, providedBorderColor),
        shadow && (shadow === 'small' ? 'box-shadow' : `box-shadow-${shadow}`)
      )}
      style={style}
    >
      {children}
    </Tag>
  )
}

Block.defaultProps = {
  tag: 'div'
}

Block.propTypes = {
  ...mapProps.propTypes,
  border: PropTypes.oneOfType([PropTypes.bool, oneOrMoreOf(PropTypes.oneOf(['top', 'right', 'bottom', 'left']))]),
  children: PropTypes.node,
  shadow: PropTypes.oneOf(['small', 'medium', 'large', 'extra-large'])
}
