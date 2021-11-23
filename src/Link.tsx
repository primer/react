import styled from 'styled-components'
import {system} from 'styled-system'
import {get} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

type StyledLinkProps = {
  hoverColor?: string
  muted?: boolean
  underline?: boolean
} & SxProp

const hoverColor = system({
  hoverColor: {
    property: 'color',
    scale: 'colors'
  }
})

const Link = styled.a<StyledLinkProps>`
  color: ${props => (props.muted ? get('colors.fg.muted')(props) : get('colors.accent.fg')(props))};
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: ${props => (props.muted ? 'none' : 'underline')};
    ${props => (props.hoverColor ? hoverColor : props.muted ? `color: ${get('colors.accent.fg')(props)}` : '')};
  }
  &:is(button) {
    display: inline-block;
    padding: 0;
    font-size: inherit;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 0;
    appearance: none;
  }
  ${sx};
`

export type LinkProps = ComponentProps<typeof Link>
export default Link
