import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {bg, color, fontSize, spacing} from './mappers'
import {composeWithPropTypes} from './props'

const mapProps = composeWithPropTypes(bg, color, fontSize, spacing)

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
  ...mapProps.propTypes,
  fontWeight: PropTypes.oneOf(['normal', 'bold']),
  lineHeight: PropTypes.oneOf(['normal', 'condensed', 'condensed-ultra']),
  mono: PropTypes.bool,
  nowrap: PropTypes.bool,
  tag: PropTypes.string
}

export default Text
