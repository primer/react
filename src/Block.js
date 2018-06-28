import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {mapWhitespaceProps, oneOrMoreOf, stylizer} from './props'

const styleProps = ['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight']

const stylize = stylizer(styleProps)

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
  const {tag: Tag = 'div', children, className, bg, border, fg, position, round, shadow, ...rest} = mapWhitespaceProps(
    props
  )

  const {style} = stylize(rest)

  return (
    <Tag
      className={classnames(
        className,
        getBorderClass(border),
        bg && `bg-${bg}`,
        fg && `text-${fg}`,
        position && `position-${position}`,
        typeof round === 'number' && `rounded-${round}`,
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
  border: oneOrMoreOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number])),
  display: PropTypes.oneOf(['inline', 'inline-block']),
  fg: PropTypes.string,
  position: PropTypes.oneOf(['absolute', 'fixed', 'relative']),
  round: PropTypes.number,
  shadow: PropTypes.oneOf([true, 'medium', 'large', 'extra-large']),
  ...mapWhitespaceProps.propTypes
}

for (const prop of styleProps) {
  Block.propTypes[prop] = PropTypes.number
}

export default Block
