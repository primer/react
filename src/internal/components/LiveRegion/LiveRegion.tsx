import React, {useState} from 'react'
import './live-region-element/define'
import {LiveRegionElement, templateContent} from './live-region-element'
import {OutletContext, useOutlet} from './OutletContext'
import {LiveRegionContext} from './LiveRegionContext'
import {canUseDOM} from '../../../utils/environment'

type LiveRegionProviderProps = React.PropsWithChildren

// The LiveRegion component leverages two different context providers in order
// to coordinate finding a live-region and providing it for context consumers to
// use.
//
// - LiveRegionContext: provides a reference to the `live-region` element
// - OutletContext: used specifically for the `LiveRegionOutlet` component in
//   order to provide a reference to the `live-region` element
//
// This component can be used standalone within a component for a dedicated live
// region or the `useLiveRegion()` hook may be used to find, or create, a
// corresponding live region.
function LiveRegionProvider({children}: LiveRegionProviderProps) {
  const [liveRegion, setLiveRegion] = useState<LiveRegionElement | null>(null)

  return (
    <LiveRegionContext.Provider value={liveRegion}>
      <OutletContext.Provider value={setLiveRegion}>{children}</OutletContext.Provider>
    </LiveRegionContext.Provider>
  )
}

const innerHTML = {
  __html: templateContent,
}

// The `LiveRegionOutlet` component is used to create a `live-region` element
// and set it as the active live region. This component must be used within a
// `LiveRegion` in order for this to occur.
//
// If possible, we use a declarative shadow dom for `live-region` during
// server-side rendering
function LiveRegion() {
  const setLiveRegion = useOutlet()
  return (
    <live-region ref={setLiveRegion} suppressHydrationWarning>
      {canUseDOM ? null : (
        <template
          // @ts-expect-error shadowrootmode does exist on `template`
          // eslint-disable-next-line react/no-unknown-property
          shadowrootmode="open"
          dangerouslySetInnerHTML={innerHTML}
        />
      )}
    </live-region>
  )
}

export {LiveRegionProvider, LiveRegion}
