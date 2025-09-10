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
      setMounted(true)
    }
  }, [])

  return (
    <>
      <div className={clsx(classes.PortalContainer, classes.OuterContainer)}>
        <h3>Using PortalContext</h3>
        <p>This story demonstrates how to use PortalContext to control where Portal content is rendered.</p>

        {/* Default Portal */}
        <div
          className={clsx(classes.PortalContainer, classes.InnerContainer)}
          style={{backgroundColor: '#f0f8ff', margin: '10px', padding: '10px'}}
        >
          <strong>Default Portal (no context):</strong>
          {mounted ? (
            <Portal>
              <div style={{backgroundColor: '#e6f3ff', padding: '8px', border: '1px solid #0366d6'}}>
                Content in default portal
              </div>
            </Portal>
          ) : null}
        </div>

        {/* Portal with Context */}
        <div
          className={clsx(classes.PortalContainer, classes.InnerContainer)}
          style={{backgroundColor: '#fff5f5', margin: '10px', padding: '10px'}}
        >
          <strong>Portal with PortalContext:</strong>
          <PortalContext.Provider value={{portalContainerName: 'custom-portal'}}>
            {mounted ? (
              <Portal>
                <div style={{backgroundColor: '#ffe6e6', padding: '8px', border: '1px solid #d73a49'}}>
                  Content in custom portal (via PortalContext)
                </div>
              </Portal>
            ) : null}
          </PortalContext.Provider>
        </div>

        {/* Override context with containerName prop */}
        <div
          className={clsx(classes.PortalContainer, classes.InnerContainer)}
          style={{backgroundColor: '#f0fff4', margin: '10px', padding: '10px'}}
        >
          <strong>Context + containerName prop override:</strong>
          <PortalContext.Provider value={{portalContainerName: 'custom-portal'}}>
            {mounted ? (
              <Portal containerName="override-portal">
                <div style={{backgroundColor: '#e6ffe6', padding: '8px', border: '1px solid #28a745'}}>
                  Content overriding context with containerName prop
                </div>
              </Portal>
            ) : null}
          </PortalContext.Provider>
        </div>
      </div>

      {/* Custom portal containers */}
      <div
        style={{
          position: 'fixed',
          top: '100px',
          right: '10px',
          backgroundColor: '#fffbf0',
          padding: '10px',
          border: '2px solid #f66a0a',
          borderRadius: '4px',
          maxWidth: '200px',
        }}
      >
        <strong>Custom Portal Container:</strong>
        <div ref={customContainerRef} />
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          backgroundColor: '#f0fff0',
          padding: '10px',
          border: '2px solid #28a745',
          borderRadius: '4px',
          maxWidth: '200px',
        }}
      >
        <strong>Override Portal Container:</strong>
        <div ref={overrideContainerRef} />
      </div>
    </>
  )
}
