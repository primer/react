import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon} from '@primer/octicons-react'
import React, {forwardRef} from 'react'
import styled, {keyframes} from 'styled-components'

import {CSSTransitionGroup} from 'react-transition-group';
import CloseButton from './CloseButton'
import Flex from './Flex'
import PropTypes from 'prop-types'
import StyledOcticon from './StyledOcticon'
import {get} from './constants'
import theme from './theme'

const DefaultIcon = <StyledOcticon icon={InfoIcon} color="blue.3"/>
const SuccessIcon = <StyledOcticon icon={CheckCircleIcon} color="green.3"/>
const WarningIcon = <StyledOcticon icon={AlertIcon} color="yellow.5" />
const ErrorIcon = <StyledOcticon icon={StopIcon} color="red.4" />

const stateMap = {
  default: DefaultIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  loading: ErrorIcon
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

const StyledToast = styled.div.attrs(props => ({
  role: "status"
}))`
  box-shadow: ${get("toasts.boxShadow")};
  padding: ${get("space.3")};
  background-color: ${get("toasts.bg")};
  border-radius: ${get("radii.2")};
  display: flex;
  align-items: center;
  max-width: 400px;
  animation-name: ${toastEnter};
  animation-duration: 300ms;

  .toastAnimation-leave {
    animation-name: ${toastLeave};
    animation-duration: 300ms;
    animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
  }
`

const Toast = forwardRef(({type, onCloseClick, theme: ProvidedTheme, children}, ref) => {
  return (
    <StyledToast>
        {stateMap[type]}
        <Flex color="text.white" px={2} flex="1">
          {children}
        </Flex>
        <CloseButton onClick={onCloseClick} />
    </StyledToast>
  )
})

Toast.defaultProps = {
 type: 'default',
 theme
}

Toast.propTypes = {
  type: PropTypes.oneOf(['default', 'success', 'warning', 'error', 'loading'])
}

export default Toast