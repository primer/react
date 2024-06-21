import styled from 'styled-components'
import type {TokenBaseProps} from './TokenBase'

const TokenTextContainer = styled('span')<Partial<TokenBaseProps>>`
  flex-grow: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  // reset button styles, make the cursor a pointer, and add line-height
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  margin: 0;
  padding: 0;
  width: auto;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  line-height: normal;

  // reset anchor styles
  color: currentColor;
  text-decoration: none;

  // Position psuedo-element above text content, but below the
  // remove button.
  // This ensures the <a> or <button> receives the click no
  // matter where on the token the user clicks.
  &:is(a, button, [tabIndex='0']) {
    cursor: pointer;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }
  }
`

export default TokenTextContainer
