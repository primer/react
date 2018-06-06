import React from 'react'
import classnames from 'classnames'

function Button({is: Tag = 'button', children, size, block, linkStyle,  grouped, scheme, ...props}) {
  const classes = classnames(
    {
      'btn': !linkStyle,
      'btn-link': linkStyle,
      'btn-small': size === 'small',
      'btn-large': size === 'large',
      'btn-block': block,
      'BtnGroup-item': grouped,
    }
    scheme ? `btn-${scheme}`
  );

  return (
    <Tag {...props} className={classes}>{children}
    </Tag>
  )
}

// TODO: set up prop types to only allow
// "is" prop to be a button, link, or summary
export default Button
