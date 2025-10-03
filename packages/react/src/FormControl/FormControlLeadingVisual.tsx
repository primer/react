import type React from 'react'
import {get} from '../constants'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'
import styled from 'styled-components'
import sx from '../sx'

const FormControlLeadingVisual: React.FC<React.PropsWithChildren<SxProp>> = ({children, sx}) => {
  const {disabled, captionId} = useFormControlContext()
  return (
    <StyledLeadingVisual
      data-control-disabled={disabled ? '' : undefined}
      data-has-caption={captionId ? '' : undefined}
      sx={sx}
    >
      {children}
    </StyledLeadingVisual>
  )
}

const StyledLeadingVisual = styled.div`
  --leadingVisual-size: ${get('fontSizes.2')};

  color: var(--fgColor-default);

  display: flex;
  align-items: center; /* Vertical alignment */

  &:where([data-control-disabled]) {
    color: var(--control-fgColor-disabled);
  }

  & > * {
    min-width: var(--leadingVisual-size);
    min-height: var(--leadingVisual-size);
    fill: currentColor;
  }

  &:where([data-has-caption]) {
    --leadingVisual-size: ${get('fontSizes.4')};
  }

  ${sx}
`

export default FormControlLeadingVisual
