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

const Truncate = styled.div<StyledTruncateProps>`
  display: ${props => (props.inline ? 'inline-block' : 'inherit')};
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: ${props => (props.inline ? 'top' : 'initial')};
  white-space: nowrap;
  ${maxWidth}
  ${props => (props.expandable ? `&:hover { max-width: 10000px; }` : '')}
  ${sx};
`

Truncate.defaultProps = {
  expandable: false,
  inline: false,
  maxWidth: 125
}

export type TruncateProps = ComponentProps<typeof Truncate>
export default Truncate
