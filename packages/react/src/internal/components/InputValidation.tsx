import type {IconProps} from '@primer/octicons-react'
import {AlertFillIcon, CheckCircleFillIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import React from 'react'
import styled from 'styled-components'
import Text from '../../Text'
import sx from '../../sx'
import type {SxProp} from '../../sx'
import {cssModulesFlag} from '../../FormControl/feature-flags'
import type {FormValidationStatus} from '../../utils/types/FormValidationStatus'
import {useFeatureFlag} from '../../FeatureFlags'
import classes from './InputValidation.module.css'

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
  const enabled = useFeatureFlag(cssModulesFlag)
  const IconComponent = validationStatus ? validationIconMap[validationStatus] : undefined

  // TODO: use `text-caption-lineHeight` token as a custom property when it's available
  // then, we can move this all to CSS and use `calc` to get our height values
  const captionLineHeight = 16 / 12
  const iconSize = 12
  const iconBoxMinHeight = iconSize * captionLineHeight

  return (
    <StyledInputValidation
      className={clsx({
        [classes.InputValidation]: enabled,
      })}
      data-validation-status={validationStatus}
      sx={sx}
    >
      {IconComponent ? (
        <StyledValidationIcon
          aria-hidden="true"
          className={clsx({
            [classes.ValidationIcon]: enabled,
          })}
          style={
            {
              '--inputValidation-iconSize': iconBoxMinHeight,
            } as React.CSSProperties
          }
        >
          <IconComponent size={iconSize} fill="currentColor" />
        </StyledValidationIcon>
      ) : null}
      <StyledValidationText
        id={id}
        className={clsx({
          [classes.ValidationText]: enabled,
        })}
        style={{'--inputValidation-lineHeight': captionLineHeight} as React.CSSProperties}
      >
        {children}
      </StyledValidationText>
    </StyledInputValidation>
  )
}

const StyledInputValidation = styled(Text)`
  color: var(--inputValidation-fgColor);
  display: flex;
  font-size: var(--text-body-size-small);
  font-weight: 600;

  & :where(a) {
    color: currentColor;
    text-dectoration: underline;
  }

  &:where([data-validation-status='success']) {
    --inputValidation-fgColor: var(--fgColor-success);
  }

  &:where([data-validation-status='error']) {
    --inputValidation-fgColor: var(--fgColor-danger);
  }

  ${sx}
`

const StyledValidationIcon = styled.span`
  align-items: center;
  display: flex;
  margin-inline-end: var(--base-size-4);
  min-height: var(--inputValidation-iconSize);
`

const StyledValidationText = styled.span`
  line-height: var(--inputValidation-lineHeight);
`

export default InputValidation
