import React from 'react'
import styled from 'styled-components'
import {COMMON} from './constants'
import {modalStyles} from './SelectMenuStyles'
import theme from './theme'

const ModalWrapper = styled.div`
  ${modalStyles}
  ${COMMON}
`

const SelectMenuModal = ({children,...rest}) => {
  return (
    <ModalWrapper {...rest}>
      <details-menu class='modal' role='menu'>
        {children}
      </details-menu>
    </ModalWrapper>
  )
}

SelectMenuModal.defaultProps = {
  theme
}

export default SelectMenuModal