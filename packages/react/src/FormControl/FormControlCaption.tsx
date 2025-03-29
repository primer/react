import {clsx} from 'clsx'
import React from 'react'
import styled from 'styled-components'
import {cssModulesFlag} from './feature-flags'
import {useFeatureFlag} from '../FeatureFlags'
import Text from '../Text'
import sx from '../sx'
import type {SxProp} from '../sx'
import classes from './FormControlCaption.module.css'
import {useFormControlContext} from './_FormControlContext'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'

type FormControlCaptionProps = React.PropsWithChildren<
  {
    id?: string
    className?: string
  } & SxProp
>

function FormControlCaption({id, children, sx, className}: FormControlCaptionProps) {
  const enabled = useFeatureFlag(cssModulesFlag)
  const {captionId, disabled} = useFormControlContext()
  return (
    <StyledCaption
      id={id ?? captionId}
      className={clsx(className, {
        [classes.Caption]: enabled,
      })}
      data-control-disabled={disabled ? '' : undefined}
      sx={sx}
    >
      {children}
    </StyledCaption>
  )
}

const StyledCaption = toggleStyledComponent(
  cssModulesFlag,
  Text,
  styled(Text)`
    color: var(--fgColor-muted);
    display: block;
    font-size: var(--text-body-size-small);

    &:where([data-control-disabled]) {
      color: var(--control-fgColor-disabled);
    }

    ${sx}
  `,
)

export {FormControlCaption}
