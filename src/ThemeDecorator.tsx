import React from 'react'
import {ThemeProvider} from './ThemeProvider'
import BaseStyles from './BaseStyles'

export const ThemeDecorator = (Component: React.FC) => {
  return (
    <ThemeProvider>
      <BaseStyles>
        <Component />
      </BaseStyles>
    </ThemeProvider>
  )
}
