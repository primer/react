import {BaseStyles, theme, ThemeProvider} from '@primer/components'
import SkipLink from '@primer/gatsby-theme-doctocat/src/components/skip-link'
import primitives from '@primer/primitives'
import deepmerge from 'deepmerge'
import React from 'react'

// Temporarily shadowing this file to wrap the page in our custom ThemeProvider.
// We can remove this file when Doctocat uses the custom ThemeProvider.

// Doctocat still uses presentional color variables.
// We can remove this customTheme when Doctocat uses functional color variables
const customTheme = deepmerge(theme, {colors: primitives.colors.light.scale})

function wrapPageElement({element}) {
  return (
    <ThemeProvider theme={customTheme}>
      <BaseStyles>
        <SkipLink />
        {element}
      </BaseStyles>
    </ThemeProvider>
  )
}

export default wrapPageElement
