import type {IconProps} from '@primer/octicons-react'
import {AlertFillIcon, CheckCircleFillIcon} from '@primer/octicons-react'
import type React from 'react'
import Text from '../../Text'
import type {SxProp} from '../../sx'
import type {FormValidationStatus} from '../../utils/types/FormValidationStatus'
import classes from './InputValidation.module.css'
import {clsx} from 'clsx'

type Props = {
  className?: string
  id: string
  validationStatus?: FormValidationStatus
  style?: React.CSSProperties
} & SxProp

const validationIconMap: Record<
  NonNullable<Props['validationStatus']>,
  React.ElementType<React.PropsWithChildren<IconProps>>
> = {
  success: CheckCircleFillIcon,
  error: AlertFillIcon,
}

const InputValidation: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  id,
  validationStatus,
  style,
}) => {
  const IconComponent = validationStatus ? validationIconMap[validationStatus] : undefined

  // TODO: use `text-caption-lineHeight` token as a custom property when it's available
  // then, we can move this all to CSS and use `calc` to get our height values
  const captionLineHeight = 16 / 12
  const iconSize = 12
  const iconBoxMinHeight = iconSize * captionLineHeight

  return (
    <Text className={clsx(className, classes.InputValidation)} data-validation-status={validationStatus} style={style}>
      {IconComponent ? (
        <span
          aria-hidden="true"
          className={classes.ValidationIcon}
          style={
            {
              '--inputValidation-iconSize': iconBoxMinHeight,
            } as React.CSSProperties
          }
        >
          <IconComponent size={iconSize} fill="currentColor" />
        </span>
      ) : null}
      <span
        id={id}
        className={classes.ValidationText}
        style={{'--inputValidation-lineHeight': captionLineHeight} as React.CSSProperties}
      >
        {children}
      </span>
    </Text>
  )
}

export default InputValidation
