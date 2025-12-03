import React, {useEffect} from 'react'
import type {Meta} from '@storybook/react-vite'
import {Portal, PortalContext, registerPortalRoot} from './Portal'
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

export const WithPortalContext = () => {
  const customContainerRef = React.useRef<HTMLDivElement>(null)
  const overrideContainerRef = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)
  useEffect(() => {
    if (customContainerRef.current instanceof HTMLElement && overrideContainerRef.current instanceof HTMLElement) {
      registerPortalRoot(customContainerRef.current, 'custom-portal')
      registerPortalRoot(overrideContainerRef.current, 'override-portal')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true)
    }
  }, [])

  return (
    <>
      <div className={clsx(classes.PortalContainer, classes.OuterContainer)}>
        <h3>Using PortalContext</h3>
        <p>This story demonstrates how to use PortalContext to control where Portal content is rendered.</p>

        {/* Default Portal */}
        <div className={clsx(classes.PortalContainer, classes.DefaultSection)}>
          <strong>Default Portal (no context):</strong>
          {mounted ? (
            <Portal>
              <div className={classes.DefaultPortalContent}>Content in default portal</div>
            </Portal>
          ) : null}
        </div>

        {/* Portal with Context */}
        <div className={clsx(classes.PortalContainer, classes.ContextSection)}>
          <strong>Portal with PortalContext:</strong>
          <PortalContext.Provider value={{portalContainerName: 'custom-portal'}}>
            {mounted ? (
              <Portal>
                <div className={classes.ContextPortalContent}>Content in custom portal (via PortalContext)</div>
              </Portal>
            ) : null}
          </PortalContext.Provider>
        </div>

        {/* Override context with containerName prop */}
        <div className={clsx(classes.PortalContainer, classes.OverrideSection)}>
          <strong>Context + containerName prop override:</strong>
          <PortalContext.Provider value={{portalContainerName: 'custom-portal'}}>
            {mounted ? (
              <Portal containerName="override-portal">
                <div className={classes.OverridePortalContent}>Content overriding context with containerName prop</div>
              </Portal>
            ) : null}
          </PortalContext.Provider>
        </div>
      </div>

      {/* Custom portal containers */}
      <div className={classes.CustomPortalContainer}>
        <strong>Custom Portal Container:</strong>
        <div ref={customContainerRef} />
      </div>

      <div className={classes.OverridePortalContainer}>
        <strong>Override Portal Container:</strong>
        <div ref={overrideContainerRef} />
      </div>
    </>
  )
}
