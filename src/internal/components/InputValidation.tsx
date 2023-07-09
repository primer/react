import {AlertFillIcon, CheckCircleFillIcon, IconProps} from '@primer/octicons-react'
import React from 'react'
import Box from '../../Box'
import Text from '../../Text'
import {SxProp} from '../../sx'
import {FormValidationStatus} from '../../utils/types/FormValidationStatus'

type Props = {
  id: string
  validationStatus?: FormValidationStatus
} & SxProp

const validationIconMap: Record<
  NonNullable<Props['validationStatus']>,
  React.ElementType<React.PropsWithChildren<IconProps>>
> = {
  success: CheckCircleFillIcon,
  error: AlertFillIcon,
  warning: AlertFillIcon,
}

const validationColorMap: Record<NonNullable<Props['validationStatus']>, string> = {
  success: 'success.fg',
  error: 'danger.fg',
  warning: 'attention.fg',
}

const InputValidation: React.FC<React.PropsWithChildren<Props>> = ({children, id, validationStatus, sx}) => {
  const IconComponent = validationStatus ? validationIconMap[validationStatus] : undefined
  const fgColor = validationStatus ? validationColorMap[validationStatus] : undefined

  // TODO: use `text-caption-lineHeight` token as a custom property when it's available
  // then, we can move this all to CSS and use `calc` to get our height values
  const captionLineHeight = 16 / 12
  const iconSize = 12
  const iconBoxMinHeight = iconSize * captionLineHeight

  return (
    <Text
      sx={{
        fontSize: 0,
        fontWeight: 'bold',
        alignItems: 'start',
        color: fgColor,
        display: 'flex',
        a: {
          color: 'currentColor',
          textDecoration: 'underline',
        },
        ...sx,
      }}
      aria-live="polite"
    >
      {IconComponent && (
        <Box as="span" alignItems="center" display="flex" minHeight={iconBoxMinHeight} mr={1} aria-hidden="true">
          <IconComponent size={iconSize} fill="currentColor" />
        </Box>
      )}
      <Box as="span" id={id} sx={{lineHeight: captionLineHeight}}>
        {children}
      </Box>
    </Text>
  )
}

export default InputValidation
