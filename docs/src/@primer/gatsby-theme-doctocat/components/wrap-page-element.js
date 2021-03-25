import {BaseStyles, ThemeProvider} from '@primer/components'
import React from 'react'
import SkipLink from '@primer/gatsby-theme-doctocat/src/components/skip-link'

// Temporarily shadowing this file to wrap the page in our custom ThemeProvider.
// We can remove this file when Doctocat uses the custom ThemeProvider.

function wrapPageElement({element}) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <SkipLink />
        {element}
      </BaseStyles>
    </ThemeProvider>
  )
}

export default wrapPageElement
