import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, LAYOUT, get} from './constants'
import theme from './theme'
import sx from './sx'
import Text from './Text'
import Flex from './Flex'
import ButtonClose from './Button/ButtonClose'
import useModal from './hooks/useModal'

const StyledDialog = styled.div`
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.35);
  border-radius: ${get('radii.2')};
  position: relative;
  background-color: ${get('colors.white')};
  width: 100%;
  margin: 100%;
  outline: none;

  @media screen and (max-width: 750px) {
    width: 100vw;
    margin: 0;
    border-radius: 0;
    height: 100vh;
  }

  ${LAYOUT};
  ${COMMON};
  ${sx};
`

const ModalHeaderBase = styled(Flex)`
  border-radius: 4px 4px 0px 0px;
  border-bottom: 1px solid #dad5da;

  @media screen and (max-width: 750px) {
    border-radius: 0px;
  }

  ${sx};
`

function ModalHeader({theme, children, ...rest}) {
  if (React.Children.toArray(children).every((ch) => typeof ch === 'string')) {
    children = (
      <Text theme={theme} color="gray.9" fontSize={1} fontWeight="bold" fontFamily="sans-serif">
        {children}
      </Text>
    )
  }

  return (
    <ModalHeaderBase theme={theme} p={3} {...rest}>
      {children}
    </ModalHeaderBase>
  )
}

function Modal({children, dismiss, open, ...props}) {
  const modalRef = useRef(null)
  const {modalProps} = useModal({modalRef, dismiss, open})
  return open ? (
    <StyledDialog ref={modalRef} role="dialog" {...props} {...modalProps}>
      <ButtonClose onClick={() => dismiss()} />
      {children}
    </StyledDialog>
  ) : null
}

Modal.defaultProps = {theme}

Modal.propTypes = {
  ...COMMON.propTypes,
  ...LAYOUT.propTypes,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  ...sx.propTypes,
  theme: PropTypes.object,
}

ModalHeader.defaultProps = {
  backgroundColor: 'gray.1',
  theme,
}

ModalHeader.propTypes = {
  ...Flex.propTypes,
}

ModalHeader.displayName = 'Dialog.Header'

Modal.Header = ModalHeader
export default Modal
