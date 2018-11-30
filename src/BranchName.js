import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import theme from './theme'
import {COMMON} from './constants'

injectGlobal(sass`
  @import "primer-branch-name/index.scss";
`)

function proto({children, href, is: Tag, className}) {
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

const BranchName = styled(proto)`
  ${COMMON}
`

BranchName.defaultProps = {
  is: 'a',
  theme
}

BranchName.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  ...COMMON.propTypes
}

export default BranchName
