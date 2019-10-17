import styled from 'styled-components'
import {COMMON, LAYOUT, TYPOGRAPHY, get} from './constants'
import theme from './theme'

const ButtonTableList = styled.summary`
  display: inline-block;
  padding: 0;
  font-size: ${get('fontSizes.1')}px;
  color: ${get('colors.gray.6')};
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 0;
  appearance: none; // Corrects inability to style clickable input types in iOS.

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    &,
    &:hover {
      color: rgba(${get('colors.gray.6')}, 0.5);
      cursor: default;
    }
  }

  &:after {
    display: inline-block;
    margin-left: ${get('space.1')}px;
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
  }
  ${COMMON}
  ${TYPOGRAPHY}
  ${LAYOUT}
`

ButtonTableList.defaultProps = {
  theme
}

export default ButtonTableList
