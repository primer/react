import React from 'react'
import styled from 'styled-components'
import {maxWidth, MaxWidthProps} from 'styled-system'
import sx, {SxProp} from './sx'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from './utils/polymorphic'
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

const Truncate = React.forwardRef(({expandable = false, inline = false, maxWidth = 125, ...rest}, ref) => (
  <StyledTruncate ref={ref} maxWidth={maxWidth} expandable={expandable} inline={inline} {...rest} />
)) as PolymorphicForwardRefComponent<'div', StyledTruncateProps>

Truncate.displayName = 'Truncate'

export type TruncateProps = ComponentProps<typeof Truncate>
export default Truncate
