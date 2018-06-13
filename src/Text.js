import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import map from './props'

const fontSizeMap = {
  0: 6,
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1,
  6: 0
}

const Text = props => {
  const {
    tag: Tag = 'span',
    children,
    className,
    color,
    fontSize,
    fontWeight,
    lineHeight,
    mono,
    nowrap
  } = map(props)

  const fontSizeClass = (fontSize in fontSizeMap)
    ? `f${fontSizeMap[fontSize]}`
    : (typeof fontSize === 'string') ? `f${fontSize}` : null

  return (
    <Tag className={classnames(
      className,
      color && `text-${color}`,
      fontSizeClass,
      lineHeight && `lh-${lineHeight}`,
      mono && 'text-mono',
      nowrap && 'no-wrap',
    )}>
      {children}
    </Tag>
  )
}

Text.propTypes = {
  tag: PropTypes.string,
  // TODO: constrain with PropTypes.oneOf()
  color: PropTypes.string,
  // TODO constrain with PropTypes.oneOf()
  fontSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  fontWeight: PropTypes.oneOf(['normal', 'bold']),
  lineHeight: PropTypes.oneOf(['normal', 'condensed', 'condensed-ultra']),
  mono: PropTypes.bool
}

export default Text
