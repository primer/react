import React from 'react'
import styled from 'styled-components'
import {COMMON} from './constants'
import {modalStyles, modalWrapperStyles} from './SelectMenuStyles'
import theme from './theme'

const Modal = styled.div`
  ${modalStyles}
`

const ModalWrapper = styled.div`
  ${modalWrapperStyles}
  ${COMMON}
`

const SelectMenuModal = ({children, ...rest}) => {
  return (
    <ModalWrapper {...rest} role="menu">
      <Modal>{children}</Modal>
    </ModalWrapper>
  )
}

SelectMenuModal.defaultProps = {
  theme
}

export default SelectMenuModal
