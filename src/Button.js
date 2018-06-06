import React from 'react'
import classnames from 'classnames'

function Button({is: Tag = 'button', children, grouped, scheme, ...props}) {
  const className = ['btn']
  if (scheme) className.push(`btn-${scheme}`)
  if (grouped) className.push('BtnGroup-item')
  return (
    <Tag {...props} className={className.join(' ')}>{children}
    </Tag>
  )
}

// TODO: set up prop types to only allow
// "is" prop to be a button, link, or summary
export default Button
