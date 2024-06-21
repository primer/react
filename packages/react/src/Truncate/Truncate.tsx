import React from 'react'
import styled from 'styled-components'
import type {MaxWidthProps} from 'styled-system'
import {maxWidth} from 'styled-system'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

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

const Truncate = React.forwardRef(function Truncate(
  {as, expandable = false, inline = false, maxWidth = 125, ...rest},
  ref,
) {
  return <StyledTruncate ref={ref} as={as} expandable={expandable} inline={inline} maxWidth={maxWidth} {...rest} />
}) as PolymorphicForwardRefComponent<'div', TruncateProps>

if (__DEV__) {
  Truncate.displayName = 'Truncate'
}

export default Truncate
