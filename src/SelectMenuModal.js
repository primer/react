import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import {modalStyles, modalWrapperStyles} from './SelectMenuStyles'
import SelectMenuHeader from './SelectMenuHeader'
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
        {children}
      </Modal>
    </ModalWrapper>
  )
}

SelectMenuModal.defaultProps = {
  theme
}

SelectMenuModal.propTypes = {
  title: PropTypes.string,
  ...COMMON.propTypes
}

export default SelectMenuModal
