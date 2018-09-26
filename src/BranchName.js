import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import {withSystemProps, COMMON} from './system-props'

injectGlobal(sass`
  @import "primer-branch-name/index.scss";
`)

function BranchName({children, href, is: Tag, className}) {
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
  is: 'a'
}

BranchName.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}

export default withSystemProps(BranchName, COMMON)
