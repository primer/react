import React from 'react'
import styled from 'styled-components'
import {COMMON} from './constants'
import {modalStyles} from './SelectMenuStyles'
import theme from './theme'
import '@github/details-menu-element'

const ModalWrapper = styled.div`
  ${modalStyles}
  ${COMMON}
`

const SelectMenuModal = ({children, ...rest}) => {
  return (
    <details-menu class="details-menu" role="menu">
      <ModalWrapper {...rest}>{children}</ModalWrapper>
    </details-menu>
  )
}

SelectMenuModal.defaultProps = {
  theme
}

export default SelectMenuModal
