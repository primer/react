import {AlertIcon, CheckCircleFillIcon, IconProps} from '@primer/octicons-react'
import React from 'react'
import {Box, Text} from '..'

interface Props {
  id: string
  validationStatus?: 'error' | 'warning' | 'success'
}

const validationIconMap: Record<NonNullable<Props['validationStatus']>, React.ComponentType<IconProps>> = {
  success: CheckCircleFillIcon,
  error: AlertIcon, // TODO: replace with `AlertFillIcon` when it's available
  warning: AlertIcon // TODO: replace with `AlertFillIcon` when it's available
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
      display="flex"
      color={fgColor}
      id={id}
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
      <span>{children}</span>
    </Text>
  )
}

export default InputValidation
