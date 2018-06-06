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

export default Button
