import styled, {keyframes} from 'styled-components'
import {get} from '../constants'

const loading = keyframes`
  from { opacity: 1; }
  to { opacity: 0.2; }
`

export const LoadingCounter = styled.span`
  animation: ${loading} 1.2s ease-in-out infinite alternate;
  background-color: ${get('colors.neutral.muted')};
  border-color: ${get('colors.border.default')};
  width: 1.5rem;
  height: 1rem; // 16px
  display: inline-block;
  border-radius: 20px;
`
