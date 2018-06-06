import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import map, { classifier } from './props'

function Button({tag: Tag = 'button', children, size, block, linkStyle, grouped, scheme, ...props}) {
  const classes = classnames(
    {
      'btn': !linkStyle,
      'btn-link': linkStyle,
      'btn-small': size === 'small',
      'btn-large': size === 'large',
      'btn-block': block,
      'BtnGroup-item': grouped,
    },
    scheme ? `btn-${scheme}` : null
  );

  return (
    <Tag {...props} className={classes}>
      {children}
    </Tag>
  )
}

Button.propTypes = {
  block: PropTypes.bool,
  grouped: PropTypes.bool,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large']),
  tag: PropTypes.oneOf(['button', 'a', 'summary']),
  linkStyle: PropTypes.bool,
}

export default Button
