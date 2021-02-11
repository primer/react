import {css} from 'styled-components'
import {get} from '../constants'

export default css`
  position: relative;
  display: inline-block;
  padding: 6px 16px;
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
`
