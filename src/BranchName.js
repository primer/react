import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {mapWhitespaceProps} from './props'

export default function BranchName({children, href, tag: Tag, ...rest}) {
  const {className} = mapWhitespaceProps(rest)
  // We don't want someone to use href on a non tag
  if (Tag !== 'a') {
    href = null
  }

  return (
    <Tag href={href} className={classnames('branch-name', className)}>
      {children}
    </Tag>
  )
}

BranchName.defaultProps = {
  tag: 'a'
}

BranchName.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}
