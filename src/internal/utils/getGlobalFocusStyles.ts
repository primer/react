import {CSSProperties} from 'react'
import {css} from 'styled-components'
import {get} from '../../constants'

export const globalFocusStyle = (outlineOffset?: CSSProperties['outlineOffset']) => css`
  box-shadow: none;
  outline: 2px solid ${get('colors.accent.fg')};
  outline-offset: ${typeof outlineOffset === 'undefined' ? '2px' : outlineOffset};
`

const getGlobalFocusStyles = (outlineOffset?: CSSProperties['outlineOffset']) => css`
  /* fallback :focus state */
  &:focus:not(:disabled) {
    ${globalFocusStyle(outlineOffset)};

    // remove fallback :focus if :focus-visible is supported
    &:not(:focus-visible) {
      outline: solid 1px transparent;
    }
  }

  /* default focus state */
  &:focus-visible:not(:disabled) {
    ${globalFocusStyle(outlineOffset)};
  }
`

export default getGlobalFocusStyles
