import {AlertIcon, CheckCircleFillIcon, IconProps} from '@primer/octicons-react'
import React from 'react'
import {Box, Text} from '..'
import {InputFieldContext, Slot} from './InputField'

const validationIconMap: Record<NonNullable<InputFieldContext['validationStatus']>, React.ComponentType<IconProps>> = {
  success: CheckCircleFillIcon,
  error: AlertIcon, // TODO: replace with `AlertFillIcon` when it's available
  warning: AlertIcon // TODO: replace with `AlertFillIcon` when it's available
}

const validationColorMap: Record<NonNullable<InputFieldContext['validationStatus']>, string> = {
  success: 'success.fg',
  error: 'danger.fg',
  warning: 'attention.fg'
}

const InputFieldValidation: React.FC = ({children}) => (
  <Slot name="Validation">
    {({validationStatus, validationMessageId}: InputFieldContext) => {
      const IconComponent = validationStatus ? validationIconMap[validationStatus] : undefined
      const fgColor = validationStatus ? validationColorMap[validationStatus] : undefined

      return (
        <Text
          display="flex"
          color={fgColor}
          id={validationMessageId}
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
    }}
  </Slot>
)

export default InputFieldValidation
