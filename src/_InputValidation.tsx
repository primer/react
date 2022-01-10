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
  error: AlertFillIcon
}

const validationColorMap: Record<NonNullable<Props['validationStatus']>, string> = {
  success: 'success.fg',
  error: 'danger.fg'
}

const InputValidation: React.FC<Props> = ({children, id, validationStatus}) => {
  const IconComponent = validationStatus ? validationIconMap[validationStatus] : undefined
  const fgColor = validationStatus ? validationColorMap[validationStatus] : undefined

  return (
    <Text
      display="flex"
      color={fgColor}
      fontSize={0}
      sx={{
        alignItems: 'baseline',
        a: {
          color: 'currentColor',
          textDecoration: 'underline'
        }
      }}
    >
      {IconComponent && (
        <Box as="span" mr={1}>
          <IconComponent size={12} fill="currentColor" />
        </Box>
      )}
      <span id={id}>{children}</span>
    </Text>
  )
}

export default InputValidation
