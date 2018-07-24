import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {mapWhitespaceProps} from './props'
import {color, fontSize} from './utils/mapping'
import {compose} from 'ramda'

const mapProps = compose(
  color,
  fontSize,
  mapWhitespaceProps
)

const Text = ({tag: Tag, children, fontWeight, lineHeight, mono, nowrap, ...rest}) => {
  const {className} = mapProps(rest)

  return (
    <Tag
      className={classnames(
        className,
        fontWeight && `text-${fontWeight}`,
        lineHeight && `lh-${lineHeight}`,
        mono && 'text-mono',
        nowrap && 'no-wrap'
      )}
    >
      {children}
    </Tag>
  )
}

Text.defaultProps = {
  tag: 'span'
}

Text.propTypes = {
  ...color.propTypes,
  ...fontSize.propTypes,
  ...mapWhitespaceProps.propTypes,
  fontWeight: PropTypes.oneOf(['normal', 'bold']),
  lineHeight: PropTypes.oneOf(['normal', 'condensed', 'condensed-ultra']),
  mono: PropTypes.bool,
  nowrap: PropTypes.bool,
  tag: PropTypes.string
}

export default Text
