import React from 'react'
import styled from 'styled-components'
import {maxWidth, MaxWidthProps} from 'styled-system'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

type StyledTruncateProps = {
  title: string
  inline?: boolean
  expandable?: boolean
} & MaxWidthProps &
  SxProp

const StyledTruncate = styled.div<StyledTruncateProps>`
  display: ${props => (props.inline ? 'inline-block' : 'inherit')};
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: ${props => (props.inline ? 'top' : 'initial')};
  white-space: nowrap;
  ${maxWidth}
  ${props => (props.expandable ? `&:hover { max-width: 10000px; }` : '')}
  ${sx};
`

export type TruncateProps = ComponentProps<typeof StyledTruncate>
const Truncate = ({expandable = false, inline = false, maxWidth = 125, ...rest}: TruncateProps) => (
  <StyledTruncate maxWidth={maxWidth} expandable={expandable} inline={inline} {...rest} />
)

export default Truncate
