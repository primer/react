import React from 'react'
import PropTypes from 'prop-types'

export default function BranchName({children, href, tag: Tag}) {
  // We don't want someone to use href on a non tag
  if (Tag !== 'a') {
    href = null
  }

  return (
    <Tag href={href} className="branch-name">
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
