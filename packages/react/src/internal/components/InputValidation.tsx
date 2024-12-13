import type {IconProps} from '@primer/octicons-react'
import {AlertFillIcon, CheckCircleFillIcon} from '@primer/octicons-react'
import React from 'react'
import Text from '../../Text'
import type {SxProp} from '../../sx'
import type {FormValidationStatus} from '../../utils/types/FormValidationStatus'
import styled from 'styled-components'
import {get} from '../../constants'
import sx from '../../sx'

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
}

const InputValidation: React.FC<React.PropsWithChildren<Props>> = ({children, id, validationStatus, sx}) => {
  const IconComponent = validationStatus ? validationIconMap[validationStatus] : undefined

  // TODO: use `text-caption-lineHeight` token as a custom property when it's available
  // then, we can move this all to CSS and use `calc` to get our height values
  const captionLineHeight = 16 / 12
  const iconSize = 12
  const iconBoxMinHeight = iconSize * captionLineHeight

  return (
    <StyledInputValidation data-validation-status={validationStatus} sx={sx}>
      {IconComponent ? (
        <StyledValidationIcon
          aria-hidden="true"
          style={
            {
              '--inputValidation-iconSize': iconBoxMinHeight,
            } as React.CSSProperties
          }
        >
          <IconComponent size={iconSize} fill="currentColor" />
        </StyledValidationIcon>
      ) : null}
      <StyledValidationText id={id} style={{'--inputValidation-lineHeight': captionLineHeight} as React.CSSProperties}>
        {children}
      </StyledValidationText>
    </StyledInputValidation>
  )
}

const StyledInputValidation = styled(Text)`
  color: var(--inputValidation-fgColor);
  display: flex;
  font-size: ${get('fontSizes.0')};
  font-weight: 600;

  & :where(a) {
    color: currentColor;
    text-dectoration: underline;
  }

  &:where([data-validation-status='success']) {
    --inputValidation-fgColor: ${get('colors.success.fg')};
  }

  &:where([data-validation-status='error']) {
    --inputValidation-fgColor: ${get('colors.danger.fg')};
  }

  ${sx}
`

const StyledValidationIcon = styled.span`
  align-items: center;
  display: flex;
  margin-inline-end: ${get('space.1')};
  min-height: var(--inputValidation-iconSize);
`

const StyledValidationText = styled.span`
  line-height: var(--inputValidation-lineHeight);
`

export default InputValidation
