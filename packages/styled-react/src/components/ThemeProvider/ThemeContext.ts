import {createContext} from 'react'

type ThemeContextValue = {}

const ThemeContext = createContext<ThemeContextValue>({
  //
})

export {ThemeContext}
export type {ThemeContextValue}
