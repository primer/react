import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon} from '@primer/octicons-react'
import React, {forwardRef, useRef, useEffect} from 'react'
import styled from 'styled-components'

import CloseButton from './CloseButton'
import Flex from './Flex'
import PropTypes from 'prop-types'
import StyledOcticon from './StyledOcticon'
import {get} from './constants'
import theme from './theme'

const DefaultIcon = <StyledOcticon icon={InfoIcon} color="blue.3" />
const SuccessIcon = <StyledOcticon icon={CheckCircleIcon} color="green.3" />
const WarningIcon = <StyledOcticon icon={AlertIcon} color="yellow.5" />
const ErrorIcon = <StyledOcticon icon={StopIcon} color="red.4" />

const stateMap = {
  default: DefaultIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  loading: ErrorIcon,
}

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

const Toast = forwardRef(({toast, removeToast, cancelAutoDismiss, ...rest}, ref) => {
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

  return (
    <StyledToast {...rest} ref={ref} role="alert">
      {stateMap[toast.type]}
      <Flex color="text.white" px={2} flex="1">
        {toast.message}
        {toast.action && (
          <ToastAction ref={callToActionRef} onClick={toast.action.handleOnClick} aria-label={toast.action.ariaLabel}>
            {toast.action.text}
          </ToastAction>
        )}
      </Flex>
      <CloseButton onClick={removeToast} />
    </StyledToast>
  )
})

Toast.defaultProps = {
  type: 'default',
  theme,
}

Toast.propTypes = {
  type: PropTypes.oneOf(['default', 'success', 'warning', 'error', 'loading']),
}

export default Toast
