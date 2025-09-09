import type {Meta} from '@storybook/react-vite'
import {Portal, PortalContext, registerPortalRoot} from './Portal'
import classes from './Portal.stories.module.css'
import {clsx} from 'clsx'
import {useEffect} from 'react'

export default {
  title: 'Behaviors/Portal',
  component: Portal,
} as Meta<typeof Portal>

export const Default = () => (
  <>
    Root position
    <div className={clsx(classes.PortalContainer, classes.OuterContainer)}>
      Outer container
      <div className={clsx(classes.PortalContainer, classes.InnerContainer)}>
        Inner container
        <Portal>
          Portaled content rendered at <code>&lt;BaseStyles&gt;</code> root.
        </Portal>
      </div>
    </div>
  </>
)

export const WithPortalContext = () => {
  useEffect(() => {
    // Create and register custom portal containers for the story
    let customContainer = document.getElementById('storybook-custom-portal')
    let overrideContainer = document.getElementById('storybook-override-portal')

    if (!customContainer) {
      // If containers don't exist yet, create them manually
      customContainer = document.createElement('div')
      customContainer.id = 'storybook-custom-portal'
      document.body.appendChild(customContainer)
    }

    if (!overrideContainer) {
      overrideContainer = document.createElement('div')
      overrideContainer.id = 'storybook-override-portal'
      document.body.appendChild(overrideContainer)
    }

    registerPortalRoot(customContainer, 'storybook-custom')
    registerPortalRoot(overrideContainer, 'storybook-override')

    return () => {
      // Clean up on unmount
      if (document.body.contains(customContainer)) {
        document.body.removeChild(customContainer)
      }
      if (document.body.contains(overrideContainer)) {
        document.body.removeChild(overrideContainer)
      }
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
          <Portal>
            <div style={{backgroundColor: '#e6f3ff', padding: '8px', border: '1px solid #0366d6'}}>
              Content in default portal
            </div>
          </Portal>
        </div>

        {/* Portal with Context */}
        <div
          className={clsx(classes.PortalContainer, classes.InnerContainer)}
          style={{backgroundColor: '#fff5f5', margin: '10px', padding: '10px'}}
        >
          <strong>Portal with PortalContext:</strong>
          <PortalContext.Provider value={{portalContainerName: 'storybook-custom'}}>
            <Portal>
              <div style={{backgroundColor: '#ffe6e6', padding: '8px', border: '1px solid #d73a49'}}>
                Content in custom portal (via PortalContext)
              </div>
            </Portal>
          </PortalContext.Provider>
        </div>

        {/* Override context with containerName prop */}
        <div
          className={clsx(classes.PortalContainer, classes.InnerContainer)}
          style={{backgroundColor: '#f0fff4', margin: '10px', padding: '10px'}}
        >
          <strong>Context + containerName prop override:</strong>
          <PortalContext.Provider value={{portalContainerName: 'storybook-custom'}}>
            <Portal containerName="storybook-override">
              <div style={{backgroundColor: '#e6ffe6', padding: '8px', border: '1px solid #28a745'}}>
                Content overriding context with containerName prop
              </div>
            </Portal>
          </PortalContext.Provider>
        </div>
      </div>

      {/* Custom portal containers */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: '#fffbf0',
          padding: '10px',
          border: '2px solid #f66a0a',
          borderRadius: '4px',
          maxWidth: '200px',
        }}
      >
        <strong>Custom Portal Container:</strong>
        <div id="storybook-custom-portal" />
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
        <div id="storybook-override-portal" />
      </div>
    </>
  )
}
