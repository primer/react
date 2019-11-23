import React, {createContext, useState} from 'react'
import styled from 'styled-components'
import {COMMON} from './constants'
import {modalStyles} from './SelectMenuStyles'
import theme from './theme'

const ModalWrapper = styled.div`
  ${modalStyles}
  ${COMMON}
`

const SelectMenuModal = ({children, initialTab, ...rest}) => {
  return (
    <div class="details-menu" role="menu">
      <ModalWrapper {...rest}>{children}</ModalWrapper>
    </div> // does this need to wrap the modal wrapper?
  )
}

SelectMenuModal.defaultProps = {
  theme
}

export default SelectMenuModal
