import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon} from '@primer/octicons-react'
import React, {forwardRef} from 'react'

import BorderBox from './BorderBox'
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

const Toast = forwardRef(({type, onCloseClick, theme: ProvidedTheme, children}, ref) => {
  return (
    <BorderBox boxShadow={get("toasts.boxShadow")(ProvidedTheme)} p={3} bg={get("toasts.bg")(ProvidedTheme)} borderRadius={2} borderWidth="0" display="flex" alignItems="center" maxWidth="400px">
      {stateMap[type]}
      <Flex color="text.white" px={2} flex="1">
        {children}
      </Flex>
      <CloseButton onClick={onCloseClick} />
    </BorderBox>
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