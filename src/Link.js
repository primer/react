import React from 'react'
import classnames from 'classnames'

const Link = ({children, className, muted, gray, graydark, nounderline, ...rest}) => (
  <a className={classnames(
      className,
      'text-blue',
      {
        'muted-link': muted,
        'link-gray': gray,
        'link-gray-dark': graydark,
        'no-underline': nounderline
      }
    )} {...rest}>
    {children}
  </a>
)

export default Link
