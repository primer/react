import styled, {keyframes} from 'styled-components'
import {get} from '../constants'

const loading = keyframes`
  from { opacity: 0.4; }
  to { opacity: 0.8; }
`

export const LoadingCounter = styled.span`
  animation: ${loading} 1.2s linear infinite alternate;
  background-color: ${get('colors.neutral.emphasis')};
  border-color: ${get('colors.border.default')};
  width: 1.5rem;
  height: 1rem; // 16px
  display: inline-block;
  border-radius: 20px;
`
