import styled from 'styled-components'
import {
  space,
  color,
  width,
  fontSize,
  fontWeight,
  borderRadius,
  theme,
} from 'styled-system'

const Button = styled.button`
  appearance: none;
  text-decoration: none;
  font-family: inherit;
  line-height: 1.25;
  display: inline-block;
  padding: 0.5em 0.75em;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background-repeat: repeat-x;
  background-position: -1px -1px;
  background-size: 110% 110%;
  border: 1px solid ${theme('colors.blackfade20')};
  border-radius: 0.25em;
  appearance: none;

  &:focus {}
  &:hover {
    text-decoration: none;
    background-repeat: repeat-x;
    border-color: rgba(27,31 ,35, 0.35);
    filter: brightness(97%);
  }
  &:active {}

  ${space}
  ${width}
  ${color}
  ${fontSize}
  ${fontWeight}
  ${borderRadius}
`

Button.defaultProps = {
  fontSize: 1,
  fontWeight: 600,
  m: 0,
  bg: 'gray.1',
  color: 'bodytext'
}

Button.a = Button.withComponent('a')

export default Button
