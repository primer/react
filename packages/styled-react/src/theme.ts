import {theme as baseTheme} from '@primer/react'
import {colorSchemes} from './legacy-theme/ts/color-schemes'

/**
 * The default theme used by `@primer/styled-react`. This extends the base theme
 * from `@primer/react` with the legacy `colorSchemes` object required by the
 * styled-components based `ThemeProvider`, `sx`, and `themeGet` APIs.
 */
export const theme = {
  ...baseTheme,
  colorSchemes,
}
