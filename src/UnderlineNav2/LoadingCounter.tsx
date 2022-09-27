import React from 'react'
import styled from 'styled-components'

import {useTheme, Theme} from '../ThemeProvider'

export const LoadingCounter = () => {
  const {theme} = useTheme()

  const getLoaderStyle = (currentTheme?: Theme) => {
    return `@keyframes loading {
      from {
        opacity: 0.4;
      }
      to {
        opacity: 0.8;
      }
    }
    animation: loading 1.2s linear infinite alternate;
    background-color: ${currentTheme?.colors.neutral.emphasis};
    border-color: ${currentTheme?.colors.border.default};
    width: 22px;
    height: 16px;
    display: inline-block;
    border-radius: 20px;`
  }

  const StyledLoadingCounter = styled.div`
    ${getLoaderStyle(theme)}
  `

  return <StyledLoadingCounter theme={theme} />
}
