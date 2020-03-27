import React from 'react'
import styled from 'styled-components'
import {tabWrapperStyles} from './SelectMenuStyles'
import {COMMON} from '../constants'
import theme from '../theme'

const Tabs = ({className, children, ...rest}) => {
  return (
    <div role="tablist" className={className} {...rest}>
      {children}
    </div>
  )
}

const SelectMenuTabs = styled(Tabs)`
  ${tabWrapperStyles}
  ${COMMON}
`

SelectMenuTabs.defaultProps = {
  theme
}

SelectMenuTabs.propTypes = {
  ...COMMON.propTypes
}

export default SelectMenuTabs
