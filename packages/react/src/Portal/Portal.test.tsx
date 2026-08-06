import {describe, expect, it, vi} from 'vitest'
import Portal, {registerPortalRoot, PortalContext} from '../Portal/index'

import {render} from '@testing-library/react'
import BaseStyles from '../BaseStyles'
import React, {act} from 'react'
import {hydrateRoot, type Root} from 'react-dom/client'
import {renderToString} from 'react-dom/server'

const renderOnServer = (children: React.ReactNode) => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  try {
    return renderToString(children)
  } finally {
    consoleErrorSpy.mockRestore()
  }
}

describe('Portal', () => {
  it('renders nothing without creating a DOM element during server rendering', () => {
    const createElementSpy = vi.spyOn(document, 'createElement')

    try {
      expect(renderOnServer(<Portal>portal content</Portal>)).toEqual('')
      expect(createElementSpy).not.toHaveBeenCalled()
    } finally {
      createElementSpy.mockRestore()
    }
  })

  it('preserves generated IDs during hydration', async () => {
    const Id = ({name}: {name: string}) => {
      const id = React.useId()
      return <div id={id} data-name={name} />
    }
    const App = () => (
      <>
        <Id name="before" />
        <Portal>
          <Id name="portal" />
        </Portal>
        <Id name="after" />
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderOnServer(<App />)
    document.body.appendChild(container)

    const serverIds = Array.from(container.querySelectorAll('[data-name]'), element => element.id)
    const recoverableErrors: unknown[] = []
    let root: Root | undefined

    try {
      await act(async () => {
        root = hydrateRoot(container, <App />, {
          onRecoverableError: error => recoverableErrors.push(error),
        })
      })

      expect(recoverableErrors).toEqual([])
      expect(Array.from(container.querySelectorAll('[data-name]'), element => element.id)).toEqual(serverIds)
      expect(document.querySelector('[data-name="portal"]')).toBeInstanceOf(HTMLElement)
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('renders a default portal into document.body (no BaseStyles present)', () => {
    const {baseElement} = render(<Portal>123test123</Portal>)
    const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')
    expect(generatedRoot).toBeInstanceOf(HTMLElement)
    expect(generatedRoot?.textContent.trim()).toEqual('123test123')

    const portalNode = generatedRoot?.querySelector('[data-component="Portal"]')
    expect(portalNode).toBeInstanceOf(HTMLElement)

    baseElement.innerHTML = ''
  })

  it('renders a default portal into nearest BaseStyles element', () => {
    const toRender = (
      <div id="renderedRoot">
        <BaseStyles>
          <div id="baseStylesRoot">
            <Portal>123test123</Portal>
          </div>
        </BaseStyles>
      </div>
    )

    const {baseElement} = render(toRender)
    const baseStylesRoot = baseElement.querySelector('#baseStylesRoot')
    const baseStylesElement = baseStylesRoot?.parentElement
    const generatedRoot = baseStylesElement?.querySelector('#__primerPortalRoot__')

    expect(baseStylesRoot).toBeInstanceOf(HTMLElement)
    expect(baseStylesElement).toBeInstanceOf(HTMLElement)
    expect(generatedRoot).toBeInstanceOf(HTMLElement)
    expect(generatedRoot?.textContent.trim()).toEqual('123test123')

    const portalNode = generatedRoot?.querySelector('[data-component="Portal"]')
    expect(portalNode).toBeInstanceOf(HTMLElement)

    baseElement.innerHTML = ''
  })

  it('renders into the custom portal root (default root name - declarative)', () => {
    const toRender = (
      <div id="renderedRoot">
        <div id="__primerPortalRoot__"></div>
        <Portal>123test123</Portal>
      </div>
    )
    const {baseElement} = render(toRender)
    const renderedRoot = baseElement.querySelector('#renderedRoot')
    const portalRoot = renderedRoot?.querySelector('#__primerPortalRoot__')

    expect(portalRoot).toBeInstanceOf(HTMLElement)
    expect(portalRoot?.textContent.trim()).toEqual('123test123')

    const portalNode = portalRoot?.querySelector('[data-component="Portal"]')
    expect(portalNode).toBeInstanceOf(HTMLElement)

    baseElement.innerHTML = ''
  })

  it('renders into the custom portal root (default root name - imperative)', () => {
    const portalRootJSX = <div id="myPortalRoot"></div>
    let {baseElement} = render(portalRootJSX)
    const portalRoot = baseElement.querySelector('#myPortalRoot')
    expect(portalRoot).toBeInstanceOf(HTMLElement)

    registerPortalRoot(baseElement.querySelector('#myPortalRoot')!)

    const toRender = <Portal>123test123</Portal>
    ;({baseElement} = render(toRender))
    expect(portalRoot?.textContent.trim()).toEqual('123test123')

    const portalNode = portalRoot?.querySelector('[data-component="Portal"]')
    expect(portalNode).toBeInstanceOf(HTMLElement)

    baseElement.innerHTML = ''
  })

  it('renders into multiple custom portal roots (named)', () => {
    const portalRootJSX = (
      <main>
        <div id="myPortalRoot1"></div>
        <div id="myPortalRoot2"></div>
      </main>
    )
    let {baseElement} = render(portalRootJSX)
    const fancyPortalRoot1 = baseElement.querySelector('#myPortalRoot1')
    const fancyPortalRoot2 = baseElement.querySelector('#myPortalRoot2')
    expect(fancyPortalRoot1).toBeInstanceOf(HTMLElement)
    expect(fancyPortalRoot2).toBeInstanceOf(HTMLElement)

    registerPortalRoot(baseElement.querySelector('#myPortalRoot1')!, 'fancyPortal1')
    registerPortalRoot(baseElement.querySelector('#myPortalRoot2')!, 'fancyPortal2')

    const toRender = (
      <>
        <Portal>123test123</Portal>
        <Portal containerName="fancyPortal1">456test456</Portal>
        <Portal containerName="fancyPortal2">789test789</Portal>
      </>
    )
    ;({baseElement} = render(toRender))
    const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')
    expect(generatedRoot?.textContent.trim()).toEqual('123test123')
    expect(fancyPortalRoot1?.textContent.trim()).toEqual('456test456')
    expect(fancyPortalRoot2?.textContent.trim()).toEqual('789test789')

    const portalNodeDefault = generatedRoot?.querySelector('[data-component="Portal"]')
    expect(portalNodeDefault).toBeInstanceOf(HTMLElement)
    const portalNode1 = fancyPortalRoot1?.querySelector('[data-component="Portal"]')
    expect(portalNode1).toBeInstanceOf(HTMLElement)
    const portalNode2 = fancyPortalRoot2?.querySelector('[data-component="Portal"]')
    expect(portalNode2).toBeInstanceOf(HTMLElement)

    baseElement.innerHTML = ''
  })

  it('renders into custom portal when PortalContext is supplied with portalContainerName', () => {
    // Create and register a custom portal root
    const customPortalRoot = document.createElement('div')
    customPortalRoot.id = 'customContextPortal'
    document.body.appendChild(customPortalRoot)
    registerPortalRoot(customPortalRoot, 'customContext')

    const toRender = (
      <PortalContext.Provider value={{portalContainerName: 'customContext'}}>
        <Portal>context-portal-content</Portal>
      </PortalContext.Provider>
    )

    render(toRender)

    expect(customPortalRoot.textContent.trim()).toEqual('context-portal-content')
    expect(customPortalRoot.querySelector('[data-component="Portal"]')).toBeInstanceOf(HTMLElement)

    // Cleanup
    document.body.removeChild(customPortalRoot)
  })

  it('renders into default portal when PortalContext does not specify portalContainerName', () => {
    const toRender = (
      <PortalContext.Provider value={{}}>
        <Portal>default-portal-content</Portal>
      </PortalContext.Provider>
    )

    const {baseElement} = render(toRender)
    const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')

    expect(generatedRoot).toBeInstanceOf(HTMLElement)
    expect(generatedRoot?.textContent.trim()).toEqual('default-portal-content')
    expect(generatedRoot?.querySelector('[data-component="Portal"]')).toBeInstanceOf(HTMLElement)

    baseElement.innerHTML = ''
  })

  it('renders into default portal when PortalContext portalContainerName is undefined', () => {
    const toRender = (
      <PortalContext.Provider value={{portalContainerName: undefined}}>
        <Portal>undefined-context-content</Portal>
      </PortalContext.Provider>
    )

    const {baseElement} = render(toRender)
    const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')

    expect(generatedRoot).toBeInstanceOf(HTMLElement)
    expect(generatedRoot?.textContent.trim()).toEqual('undefined-context-content')
    expect(generatedRoot?.querySelector('[data-component="Portal"]')).toBeInstanceOf(HTMLElement)

    baseElement.innerHTML = ''
  })

  it('containerName prop overrides PortalContext portalContainerName', () => {
    // Create and register custom portal roots
    const contextPortalRoot = document.createElement('div')
    contextPortalRoot.id = 'contextPortal'
    document.body.appendChild(contextPortalRoot)
    registerPortalRoot(contextPortalRoot, 'contextPortal')

    const propPortalRoot = document.createElement('div')
    propPortalRoot.id = 'propPortal'
    document.body.appendChild(propPortalRoot)
    registerPortalRoot(propPortalRoot, 'propPortal')

    const toRender = (
      <PortalContext.Provider value={{portalContainerName: 'contextPortal'}}>
        <Portal containerName="propPortal">prop-overrides-context</Portal>
      </PortalContext.Provider>
    )

    render(toRender)

    // Should render in the portal specified by the prop, not the context
    expect(propPortalRoot.textContent.trim()).toEqual('prop-overrides-context')
    expect(contextPortalRoot.textContent.trim()).toEqual('')
    expect(propPortalRoot.querySelector('[data-component="Portal"]')).toBeInstanceOf(HTMLElement)

    // Cleanup
    document.body.removeChild(contextPortalRoot)
    document.body.removeChild(propPortalRoot)
  })
})
