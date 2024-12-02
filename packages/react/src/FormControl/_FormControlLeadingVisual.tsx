import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'
import styled from 'styled-components'
import sx from '../sx'

const StyledLeadingVisual = styled.div`
  color: var(--fgColor-default);
  margin-left: ${get('space.2')};

  &[data-disabled] {
    color: var(--fgColor-muted);
  }

  & > * {
    fill: currentColor;
    min-width: ${get('fontSizes.2')};
    min-height: ${get('fontSizes.2')};
  }

  &[data-has-caption] > * {
    min-width: ${get('fontSizes.4')};
    min-height: ${get('fontSizes.4')};
  }

  ${sx}
`

const FormControlLeadingVisual: React.FC<React.PropsWithChildren<SxProp>> = ({children, sx}) => {
  const {disabled, captionId} = useFormControlContext()
  return (
    <StyledLeadingVisual data-disabled={disabled ? '' : undefined} data-has-caption={!!captionId} sx={sx}>
      {children}
    </StyledLeadingVisual>
  )
}

export default FormControlLeadingVisual
