import React, {useRef, forwardRef} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, LAYOUT, get} from './constants'
import theme from './theme'
import sx from './sx'
import Text from './Text'
import Flex from './Flex'
import ButtonClose from './Button/ButtonClose'
import useDialog from './hooks/useDialog'

const StyledDialog = styled.div`
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.35);
  border-radius: ${get('radii.2')};
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-height: 80vh;
  z-index: 999;
  margin: 10vh auto;
  background-color: ${get('colors.white')};
  width: ${(props) => (props.narrow ? '320px' : props.wide ? '640px' : '440px')};
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

const DialogHeaderBase = styled(Flex)`
  border-radius: 4px 4px 0px 0px;
  border-bottom: 1px solid #dad5da;

  @media screen and (max-width: 750px) {
    border-radius: 0px;
  }

  ${sx};
`

function DialogHeader({theme, children, ...rest}) {
  if (React.Children.toArray(children).every((ch) => typeof ch === 'string')) {
    children = (
      <Text theme={theme} color="gray.9" fontSize={1} fontWeight="bold" fontFamily="sans-serif">
        {children}
      </Text>
    )
  }

  return (
    <DialogHeaderBase theme={theme} p={3} {...rest}>
      {children}
    </DialogHeaderBase>
  )
}

const Overlay = styled.span`
  &:before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 80;
    display: block;
    cursor: default;
    content: ' ';
    background: transparent;
    z-index: 99;
    background: rgba(27, 31, 35, 0.5);
  }
`

const Dialog = forwardRef(({children, onDismiss, isOpen, initialFocusRef, returnFocusRef, ...props}, forwardedRef) => {
  const backupRef = useRef(null)
  const modalRef = forwardedRef ?? backupRef
  const closeButtonRef = useRef(null)

  const {getDialogProps} = useDialog({modalRef, onDismiss, isOpen, initialFocusRef, closeButtonRef, returnFocusRef})
  return isOpen ? (
    <>
      <Overlay />
      <StyledDialog ref={modalRef} role="dialog" {...props} {...getDialogProps()}>
        <ButtonClose
          ref={closeButtonRef}
          onClick={() => onDismiss()}
          sx={{position: 'absolute', top: '16px', right: '16px'}}
        />
        {children}
      </StyledDialog>
    </>
  ) : null
})

Dialog.defaultProps = {theme}

Dialog.propTypes = {
  ...COMMON.propTypes,
  ...LAYOUT.propTypes,
  initialFocusRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({current: PropTypes.any})]),
  isOpen: PropTypes.bool.isRequired,
  narrow: PropTypes.bool,
  onDismiss: PropTypes.func.isRequired,
  ...sx.propTypes,
  returnFocusRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({current: PropTypes.any})]),
  theme: PropTypes.object,
  wide: PropTypes.bool,
}

DialogHeader.defaultProps = {
  backgroundColor: 'gray.1',
  theme,
}

DialogHeader.propTypes = {
  ...Flex.propTypes,
}

DialogHeader.displayName = 'Dialog.Header'
Dialog.displayName = 'Dialog'

Dialog.Header = DialogHeader
export default Dialog
