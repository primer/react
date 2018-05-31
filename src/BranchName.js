import React from 'react'

const BranchName = ({ children, href, tag }) => {

  const Tag = tag === 'a' ? 'a' : 'span'

  // We don't want someone to use href on a non tag
  if (tag != 'a') {
    href = null
  }

  return <Tag
    href={href}
    className='branch-name'>
    { children }
  </Tag>
}

export default BranchName
