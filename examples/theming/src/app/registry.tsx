'use client'

import {useServerInsertedHTML} from 'next/navigation'
import type React from 'react'
import {useState} from 'react'
import {ServerStyleSheet, StyleSheetManager} from 'styled-components'

/**
 * @see https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components
 */
export function StyledComponentsRegistry({children}: React.PropsWithChildren) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  // @ts-expect-error - styled-components@5.x is not compatible type-wise with
  // React 19
  return <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>
}
