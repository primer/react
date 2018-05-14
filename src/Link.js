import React from 'react'
import classnames from 'classnames'

const Link = props => (
    <a
      {...props}
      className={classnames(
        props.className,
        'text-blue', {
          'muted-link': props.muted,
          'link-gray': props.gray,
          'link-gray-dark': props.graydark,
          'no-underline': props.nounderline,
        }
      )}
    />
)

export default Link
