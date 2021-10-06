import styled, {css} from 'styled-components'
import {TokenBaseProps} from './TokenBase'

const TokenTextContainer = styled('span')<Partial<TokenBaseProps>>`
  flex-grow: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${props => {
    if (props.as === 'a') {
      return css`
        color: currentColor;
        text-decoration: none;
      `
    }

    if (props.as === 'button') {
      // reset button styles, make the cursor a pointer, and add line-height
      return css`
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        margin: 0;
        overflow: visible;
        padding: 0;
        width: auto;
        -webkit-font-smoothing: inherit;
        -moz-osx-font-smoothing: inherit;
        -webkit-appearance: none;

        cursor: pointer;
        line-height: 1;
      `
    }

    // position psuedo-element above text content
    // so it gets the click
    if (props.as !== 'span') {
      return css`
        &:after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
        }
      `
    }
  }}
`

export default TokenTextContainer
