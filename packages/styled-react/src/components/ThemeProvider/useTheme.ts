import {useContext} from 'react'
import {ThemeContext} from './ThemeContext'
import type {ThemeContextValue} from './ThemeContext'

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
