import React from 'react'
import {useMedia} from '../hooks/useMedia'
import {viewportRanges} from '../hooks/useResponsiveValue'

type Viewports = 'narrow' | 'regular' | 'wide'

type HiddenProps = {
  on: Array<Viewports> | Viewports
  children: React.ReactNode
}

export const Hidden = ({on: hiddenViewports, children}: HiddenProps) => {
  const isNarrowViewport = useMedia(viewportRanges.narrow)
  const isRegularViewport = useMedia(viewportRanges.regular)
  const isWideViewport = useMedia(viewportRanges.wide)
  let show = true
  if (isNarrowViewport && (hiddenViewports === 'narrow' || hiddenViewports.indexOf('narrow') > -1)) {
    show = false
  } else if (isRegularViewport && (hiddenViewports === 'regular' || hiddenViewports.indexOf('regular') > -1)) {
    show = false
  } else if (isWideViewport && (hiddenViewports === 'wide' || hiddenViewports.indexOf('wide') > -1)) {
    show = false
  }
  return show ? <>{children}</> : null
}
