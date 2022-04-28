import {css} from 'styled-components'
import {get} from './constants'

const globalFocusStyles = css`
  box-shadow: none;
  outline: 2px solid ${get('colors.accent.fg')};
  outline-offset: 2px;
`

export default globalFocusStyles
