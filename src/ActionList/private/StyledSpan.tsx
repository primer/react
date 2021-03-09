import React from 'react'
import styled from 'styled-components'
import sx, {SxProp} from '../../sx'

export const StyledSpan = styled('span')<React.ComponentPropsWithoutRef<'span'> & SxProp>`
  ${sx}
`
