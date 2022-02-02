import {AlertFillIcon, CheckCircleFillIcon, IconProps} from '@primer/octicons-react'
import React from 'react'
import {Box, Text} from '.'
import {FormValidationStatus} from './utils/types/FormValidationStatus'

interface Props {
  id: string
  validationStatus?: FormValidationStatus
}

const validationIconMap: Record<NonNullable<Props['validationStatus']>, React.ComponentType<IconProps>> = {
  success: CheckCircleFillIcon,
  error: AlertFillIcon,
  warning: AlertFillIcon
}

const validationColorMap: Record<NonNullable<Props['validationStatus']>, string> = {
  success: 'success.fg',
  error: 'danger.fg',
  warning: 'attention.fg'
}

const InputValidation: React.FC<Props> = ({children, id, validationStatus}) => {
  const IconComponent = validationStatus ? validationIconMap[validationStatus] : undefined
  const fgColor = validationStatus ? validationColorMap[validationStatus] : undefined

  return (
    <Text
      fontSize={0}
      sx={{
        alignItems: 'center',
        color: fgColor,
        display: 'flex',
        a: {
          color: 'currentColor',
          textDecoration: 'underline'
        }
      }}
    >
      {IconComponent && (
        <Box as="span" mr={1} sx={{display: 'flex'}}>
          <IconComponent size={12} fill="currentColor" />
        </Box>
      )}
      <span id={id}>{children}</span>
    </Text>
  )
}

export default InputValidation
