import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon} from '@primer/octicons-react'

import BorderBox from './BorderBox'
import PropTypes from 'prop-types'
import React from 'react'
import StyledOcticon from './StyledOcticon'
import Text from './Text'

const DefaultIcon = <StyledOcticon icon={InfoIcon} color="blue.3"/>
const SuccessIcon = <StyledOcticon icon={CheckCircleIcon} color="blue.3"/>
const WarningIcon = <StyledOcticon icon={AlertIcon} color="blue.3" />
const ErrorIcon = <StyledOcticon icon={StopIcon} color="red.4" />

const CloseButton = styled.button`
// reset styles here
`

const stateMap = {
  default: DefaultIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  loading: ErrorIcon,
}

const Toast = ({state, children}) => {
  return (
    <BorderBox p={3} bg="gray.9" borderRadius={2} borderWidth="0">
      {stateMap[state]}
      <Text color="text.white">{children}</Text>
    </BorderBox>
  )
}

Toast.propTypes = {
  state: PropTypes.oneOf['default', 'success', 'warning', 'error', 'loading']
}

export default Toast