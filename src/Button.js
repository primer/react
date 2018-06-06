import React from 'react'
import classnames from 'classnames'

function Button({is: Tag = 'button', children, size, block, linkStyle,  grouped, scheme, ...props}) {
  const className = [linkStyle ? 'btn-link' : 'btn']
  if (scheme) className.push(`btn-${scheme}`)
  if (grouped) className.push('BtnGroup-item')
  if (size === "small") className.push('btn-sm')
  if (size === "large") className.push('btn-large')
  if (block) className.push('block')
  return (
    <Tag {...props} className={className.join(' ')}>{children}
    </Tag>
  )
}

// TODO: set up prop types to only allow
// "is" prop to be a button, link, or summary
export default Button
