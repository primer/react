import React from 'react'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'
import Text from '../Text'
import styled from 'styled-components'
import {get} from '../constants'
import sx from '../sx'

const StyledCaption = styled(Text)`
  color: var(--fgColor-muted);
  display: block;
  font-size: ${get('fontSizes.0')};

  &:where([data-control-disabled]) {
    color: var(--control-fgColor-disabled);
  }

  ${sx}
`

type FormControlCaptionProps = React.PropsWithChildren<
  {
    id?: string
  } & SxProp
>

function FormControlCaption({id, children, sx}: FormControlCaptionProps) {
  const {captionId, disabled} = useFormControlContext()
  return (
    <StyledCaption id={id ?? captionId} data-control-disabled={disabled ? '' : undefined} sx={sx}>
      {children}
    </StyledCaption>
  )
}

export {FormControlCaption}
