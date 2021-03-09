import React from 'react'
import styled from 'styled-components'
import sx, {SxProp} from '../../sx'

export const StyledDiv = styled('div')<React.ComponentPropsWithoutRef<'div'> & SxProp>`
  ${sx}
`
