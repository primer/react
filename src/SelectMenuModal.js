import React from 'react'
import styled from 'styled-components'
import {COMMON} from './constants'
import {modalStyles, modalWrapperStyles} from './SelectMenuStyles'
import SelectMenuHeader from './SelectMenuHeader'
import SelectMenuList from './SelectMenuList'
import theme from './theme'

const Modal = styled.div`
  ${modalStyles}
`

const ModalWrapper = styled.div`
  ${modalWrapperStyles}
  ${COMMON}
`

const SelectMenuModal = ({children, title, ...rest}) => {
  return (
    <ModalWrapper {...rest} role="menu">
      <Modal>
        <SelectMenuHeader>{title}</SelectMenuHeader>
        <SelectMenuList>
          {children}
        </SelectMenuList>
      </Modal>
    </ModalWrapper>
  )
}

SelectMenuModal.defaultProps = {
  theme
}

SelectMenu.propTypes = {
  title: PropTypes.string
}

export default SelectMenuModal
