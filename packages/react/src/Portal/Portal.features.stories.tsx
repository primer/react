import React from 'react'
import type {Meta} from '@storybook/react-vite'
import {Portal, registerPortalRoot} from './Portal'
import classes from './Portal.stories.module.css'
import {clsx} from 'clsx'

export default {
  title: 'Behaviors/Portal/Features',
  component: Portal,
} as Meta<typeof Portal>

export const CustomPortalRootById = () => (
  <>
    Root position
    <div className={clsx(classes.PortalContainer, classes.OuterContainer)} id="__primerPortalRoot__">
      Outer container
      <div className={clsx(classes.PortalContainer, classes.InnerContainer)}>
        Inner container
        <Portal>Portaled content rendered at the outer container.</Portal>
      </div>
    </div>
  </>
)

export const CustomPortalRootByRegistration: React.FC<React.PropsWithChildren<Record<string, never>>> = () => {
  const outerContainerRef = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    if (outerContainerRef.current instanceof HTMLElement) {
      registerPortalRoot(outerContainerRef.current)
      setMounted(true)
    }
  }, [])
  return (
    <>
      Root position
      <div className={clsx(classes.PortalContainer, classes.OuterContainer)} ref={outerContainerRef}>
        {mounted ? (
          <>
            Outer container
            <div className={clsx(classes.PortalContainer, classes.InnerContainer)}>
              Inner container
              <Portal>Portaled content rendered at the outer container.</Portal>
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export const MultiplePortalRoots: React.FC<React.PropsWithChildren<Record<string, never>>> = () => {
  const outerContainerRef = React.useRef<HTMLDivElement>(null)
  const innerContainerRef = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    if (outerContainerRef.current instanceof HTMLElement && innerContainerRef.current instanceof HTMLElement) {
      registerPortalRoot(outerContainerRef.current, 'outer')
      registerPortalRoot(innerContainerRef.current, 'inner')
      setMounted(true)
    }
  }, [outerContainerRef])
  return (
    <>
      Root position
      <div className={clsx(classes.PortalContainer, classes.OuterContainer)} ref={outerContainerRef}>
        Outer container
        <div className={clsx(classes.PortalContainer, classes.InnerContainer)} ref={innerContainerRef}>
          {mounted ? (
            <>
              <Portal containerName="outer">Portaled content rendered at the outer container.</Portal>
              <Portal containerName="inner">Portaled content rendered at the end of the inner container.</Portal>
              <Portal>
                Portaled content rendered at <code>&lt;BaseStyles&gt;</code> root.
              </Portal>
            </>
          ) : null}
          Inner container
        </div>
      </div>
    </>
  )
}
