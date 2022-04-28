import {CSSProperties} from 'react'
import {css} from 'styled-components'
import {get} from './constants'

const getGlobalFocusStyles = (outlineOffset?: CSSProperties['outlineOffset']) => css`
  box-shadow: none;
  outline: 2px solid ${get('colors.accent.fg')};
  outline-offset: ${outlineOffset || '2px'};
`

export default getGlobalFocusStyles
