import React from 'react'
import {Portal} from '@primer/react-tailwind'
import {BasePortalProvider, type BasePortalProviderProps, type PortalContainer} from '@primer/react-tailwind/base'
import {
  usePortalContainer,
  usePortalRoot,
  type PortalContainer as BehaviorPortalContainer,
} from '@primer/react-tailwind/behaviors'

const element: PortalContainer = {} as HTMLElement
const ref: PortalContainer = React.createRef<HTMLElement>()
const waiting: BehaviorPortalContainer = null
const providerProps: BasePortalProviderProps = {container: ref, children: null}

// @ts-expect-error A named registry is not a portal container.
const named: PortalContainer = 'issue-viewer'

export function HostRouting({children}: {children: React.ReactNode}) {
  const resolved: PortalContainer | undefined = usePortalContainer(waiting)
  const root: HTMLElement | null = usePortalRoot()
  return (
    <BasePortalProvider container={resolved ?? root}>
      <Portal.Provider container={element}>{children}</Portal.Provider>
    </BasePortalProvider>
  )
}

void providerProps
void named
