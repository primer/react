import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon} from '@primer/octicons-react'
import React, {useRef, useEffect} from 'react'
import styled, {keyframes} from 'styled-components'

import CloseButton from './CloseButton'
import Link from './Link'
import Flex from './Flex'
import PropTypes from 'prop-types'
import StyledOcticon from './StyledOcticon'
import {get} from './constants'
import theme from './theme'
import {TOAST_ANIMATION_LENGTH} from './hooks/useToasts'

const DefaultIcon = <StyledOcticon icon={InfoIcon} color="blue.3" />
const SuccessIcon = <StyledOcticon icon={CheckCircleIcon} color="green.3" />
const WarningIcon = <StyledOcticon icon={AlertIcon} color="yellow.5" />
const ErrorIcon = <StyledOcticon icon={StopIcon} color="red.4" />

const stateMap = {
  default: DefaultIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
}

const toastEnter = keyframes`
  from {
    transform: translateX(-400px);
  }
  to {
    transform: translateX(0);
  }
`

const toastLeave = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-460px);
  }

`

const StyledToast = styled.div.attrs(() => ({
  role: 'status',
}))`
  position: fixed;
  display: flex;
  gap: 8px;
  box-shadow: ${get('toasts.boxShadow')};
  padding: ${get('space.3')};
  background-color: ${get('toasts.bg')};
  border-radius: ${get('radii.2')};
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  max-width: 400px;
  bottom: ${get('space.4')};
  left: ${get('space.4')};

  animation: ${toastEnter} ${TOAST_ANIMATION_LENGTH}ms cubic-bezier(0.25, 1, 0.5, 1);

  &.toast-leave {
    animation: ${toastLeave} ${TOAST_ANIMATION_LENGTH}ms cubic-bezier(0.5, 0, 0.75, 0) forwards;
  }
`

const ToastAction = styled.button`
  background-color: transparent;
  border: none;
  font-weight: ${get('fontWeights.bold')};
  margin-left: ${get('space.2')};
  color: ${get('colors.blue.3')};
  font-size: ${get('fontSizes.1')};
  font-family: inherit;

  &:hover {
    text-decoration: underline;
  }
`

const Toast = ({toast, startRemovingToast, removeToast, cancelAutoDismiss, ...rest}) => {
  const callToActionRef = useRef()

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (callToActionRef.current && event.ctrlKey && event.key === 't') {
        callToActionRef.current.focus()
        cancelAutoDismiss(toast)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleKeyDown)
    }
  }, [callToActionRef, cancelAutoDismiss, toast])

  const handleActionClick = () => {
    toast.action.handleOnClick()
    startRemovingToast(toast.id, false)
  }

  return (
    <StyledToast {...rest} role="alert">
      {stateMap[toast.type]}
      <Flex color="text.white" px={2} flex="1">
        {toast.message}
        {toast.action && (
          <ToastAction ref={callToActionRef} onClick={handleActionClick} aria-label={toast.action.ariaLabel}>
            {toast.action.text}
          </ToastAction>
        )}
      </Flex>
      <CloseButton onClick={() => startRemovingToast(toast.id)} />
    </StyledToast>
  )
}

Toast.defaultProps = {
  type: 'default',
  theme,
}

Toast.propTypes = {
  cancelAutoDismiss: PropTypes.func,
  className: PropTypes.string,
  removeToast: PropTypes.func,
  startRemovingToast: PropTypes.func,
  toast: PropTypes.object,
}

export default Toast
