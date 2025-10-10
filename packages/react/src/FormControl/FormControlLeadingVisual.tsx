import type React from 'react'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'
import styled from 'styled-components'
import sx from '../sx'

const FormControlLeadingVisual: React.FC<React.PropsWithChildren<SxProp & {style?: React.CSSProperties}>> = ({
  children,
  sx,
  style,
}) => {
  const {disabled, captionId} = useFormControlContext()
  return (
    <StyledLeadingVisual
      data-control-disabled={disabled ? '' : undefined}
      style={style}
      data-has-caption={captionId ? '' : undefined}
      sx={sx}
    >
      {children}
    </StyledLeadingVisual>
  )
}

const StyledLeadingVisual = styled.div`
  --leadingVisual-size: var(--text-title-size-small);

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
    --leadingVisual-size: var(--base-size-24);
  }

  ${sx}
`

// @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
FormControlLeadingVisual.__SLOT__ = Symbol('FormControl.LeadingVisual')

export default FormControlLeadingVisual
