import React from 'react'
import Box from '../../Box'
import type {SxProp} from '../../sx'
import VisuallyHidden from '../../_VisuallyHidden'
// import {VisuallyHidden} from '../../VisuallyHidden'
import {featureFlag} from '../../FormControl/FormControlFeatureFlags'
import {useFeatureFlag} from '../../FeatureFlags'
import {Stack} from '../../Stack'
import {clsx} from 'clsx'
import classes from './InputLabel.module.css'

type BaseProps = SxProp & {
  disabled?: boolean
  required?: boolean
  requiredText?: string
  requiredIndicator?: boolean
  visuallyHidden?: boolean
  id?: string
  className?: string
}

export type LabelProps = BaseProps & {
  htmlFor?: string
  as?: 'label'
}

export type LegendOrSpanProps = BaseProps & {
  as: 'legend' | 'span'
  htmlFor?: undefined
}

type Props = LabelProps | LegendOrSpanProps

const InputLabel: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  disabled,
  htmlFor,
  id,
  required,
  requiredText,
  requiredIndicator,
  visuallyHidden,
  sx,
  as = 'label',
  className,
  ...props
}) => {
  const enabled = useFeatureFlag(featureFlag)

  if (enabled) {
    if (sx) {
      return (
        <VisuallyHidden
          isVisible={!visuallyHidden}
          as={
            as as 'label' /* This assertion is clearly wrong, but it's the only way TS will allow the htmlFor prop to be possibly defined */
          }
          htmlFor={htmlFor}
          id={id}
          className={clsx(className, classes.InputLabel)}
          sx={sx}
          {...props}
        >
          {required || requiredText ? (
            <Stack as="span" direction="horizontal" gap="none">
              <div className={classes.RequiredText}>{children}</div>
              <span aria-hidden={requiredIndicator ? undefined : true}>{requiredText ?? '*'}</span>
            </Stack>
          ) : (
            children
          )}
        </VisuallyHidden>
      )
    }

    const label = (
      <label htmlFor={htmlFor} id={id} className={clsx(className, classes.InputLabel)} {...props}>
        {required || requiredText ? (
          <Stack as="span" direction="horizontal" gap="none">
            <div className={classes.RequiredText}>{children}</div>
            <span aria-hidden={requiredIndicator ? undefined : true}>{requiredText ?? '*'}</span>
          </Stack>
        ) : (
          children
        )}
      </label>
    )

    if (visuallyHidden) {
      return <VisuallyHidden>{label}</VisuallyHidden>
    }

    return label
  }

  return (
    <VisuallyHidden
      isVisible={!visuallyHidden}
      as={
        as as 'label' /* This assertion is clearly wrong, but it's the only way TS will allow the htmlFor prop to be possibly defined */
      }
      htmlFor={htmlFor}
      id={id}
      className={className}
      sx={{
        fontWeight: 'bold',
        fontSize: 1,
        display: 'block',
        color: disabled ? 'fg.muted' : 'fg.default',
        cursor: disabled ? 'not-allowed' : 'pointer',
        alignSelf: 'flex-start',
        ...sx,
      }}
      {...props}
    >
      {required || requiredText ? (
        <Stack as="span" direction="horizontal" gap="none">
          <Box mr={1}>{children}</Box>
          <span aria-hidden={requiredIndicator ? undefined : true}>{requiredText ?? '*'}</span>
        </Stack>
      ) : (
        children
      )}
    </VisuallyHidden>
  )
}

export default InputLabel
