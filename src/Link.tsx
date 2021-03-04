import styled from 'styled-components'
import {system} from 'styled-system'
import {COMMON, get, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

type StyledLinkProps = {
  hoverColor?: string
  muted?: boolean
  underline?: boolean
} & SystemCommonProps &
  SxProp &
  SystemTypographyProps

const buttonStyles = `
  display: inline-block;
  padding: 0;
  font-size: inherit;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 0;
  appearance: none;
`

const hoverColor = system({
  hoverColor: {
    property: 'color',
    scale: 'colors'
  }
})

const Link = styled.a<StyledLinkProps>`
  color: ${props => (props.muted ? get('colors.text.secondary')(props) : get('colors.text.link')(props))};
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: ${props => (props.muted ? 'none' : 'underline')};
    ${props => (props.hoverColor ? hoverColor : props.muted ? `color: ${get('colors.text.link')(props)}` : '')};
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
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

export type LinkProps = ComponentProps<typeof Link>
export default Link
