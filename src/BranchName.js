import React from 'react'

const BranchName = ({ children, href }) => {

  const Tag = href ? 'a' : 'span'

  return <Tag
    href={href}
    className='branch-name'>
    { children }
  </Tag>
}

export default BranchName
