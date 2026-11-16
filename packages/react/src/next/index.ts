'use client'

// next entrypoint is used to export the latest version of the components that have conflicts with the main bundle.
export {Tooltip} from '../TooltipV2'
export type {TooltipProps} from '../TooltipV2'
export {default as ThemeProvider} from './ThemeProvider'
export type {ThemeProviderProps} from '../ThemeProvider'
export {useTheme, useColorSchemeVar} from '../useTheme'
