import {css} from 'styled-components'
import {get} from '../constants'

export default css`
  position: relative;
  display: grid;
  grid-template-areas: "leadingIcon text trailingIcon";
  font-family: inherit;
  font-weight: ${get('fontWeights.bold')};
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border-radius: ${get('radii.2')};
  appearance: none;
  text-decoration: none;
  text-align: center;
  > :not(:last-child) {
    margin-right: 8px;
  }

  &:hover {
    // needed to override link styles
    text-decoration: none;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: default;
  }

  &:disabled svg {
    opacity: 0.6;
  }

  '[data-component="leadingIcon"]' {
    grid-area: leadingIcon
  }
  '[data-component="text"]' {
    grid-area: text
  }
  '[data-component="trailingIcon"]' {
    grid-area: trailingIcon
  }


`
