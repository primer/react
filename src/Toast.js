import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon, XIcon} from '@primer/octicons-react'

import BorderBox from './BorderBox'
import PropTypes from 'prop-types'
import React from 'react'
import StyledOcticon from './StyledOcticon'
import Text from './Text'
import {get} from './constants'
import styled from 'styled-components'

const DefaultIcon = <StyledOcticon icon={InfoIcon} color="blue.3"/>
const SuccessIcon = <StyledOcticon icon={CheckCircleIcon} color="green.3"/>
const WarningIcon = <StyledOcticon icon={AlertIcon} color="yellow.5" />
const ErrorIcon = <StyledOcticon icon={StopIcon} color="red.4" />

const CloseButton = styled.button`
  color: ${get('colors.text.white')};
  cursor: pointer;
  background: none;
  border: none;
`

const stateMap = {
  default: DefaultIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  loading: ErrorIcon
}

const Toast = ({state, children}) => {
  return (
    <BorderBox p={3} bg="gray.9" borderRadius={2} borderWidth="0" display="flex" alignItems="center">
      {stateMap[state]}
      <Text color="text.white" px={2} flex="auto">
        {children}
      </Text>
      <CloseButton>
        <XIcon/>
      </CloseButton>
    </BorderBox>
  )
}

Toast.propTypes = {
  state: PropTypes.oneOf[('default', 'success', 'warning', 'error', 'loading')]
}

export default Toast