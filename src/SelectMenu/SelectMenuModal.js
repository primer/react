import React from 'react'
import styled from 'styled-components'
import {COMMON} from '../constants'
import {modalStyles, modalWrapperStyles} from './SelectMenuStyles'
import theme from '../theme'

const Modal = styled.div`
  ${modalStyles}
`

const ModalWrapper = styled.div`
  ${modalWrapperStyles}
  ${COMMON}
`

const SelectMenuModal = ({children, theme, ...rest}) => {
  return (
    <ModalWrapper theme={theme} {...rest} role="menu">
      <Modal theme={theme}>{children}</Modal>
    </ModalWrapper>
  )
}

SelectMenuModal.defaultProps = {
  theme
}

SelectMenuModal.propTypes = {
  ...COMMON.propTypes
}

export default SelectMenuModal
