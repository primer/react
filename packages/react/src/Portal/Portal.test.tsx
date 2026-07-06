import {describe, expect, it, vi} from 'vitest'
import Portal, {registerPortalRoot, PortalContext} from '../Portal/index'

import {render} from '@testing-library/react'
import BaseStyles from '../BaseStyles'
import React from 'react'

describe('Portal', () => {
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

  it('calls onMount once after the portal is mounted', () => {
    const onMount = vi.fn()
    const {baseElement} = render(<Portal onMount={onMount}>mount-content</Portal>)
    expect(onMount).toHaveBeenCalledTimes(1)
    baseElement.innerHTML = ''
  })

  it('reuses the same portal container element across re-renders', () => {
    // The container <div> is created once (via a useState initializer), so
    // re-rendering must update content in place rather than recreate the node.
    const {baseElement, rerender} = render(<Portal>first</Portal>)
    const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')
    const portalNodeBefore = generatedRoot?.querySelector('[data-component="Portal"]')
    expect(portalNodeBefore?.textContent?.trim()).toEqual('first')

    rerender(<Portal>second</Portal>)
    const portalNodeAfter = generatedRoot?.querySelector('[data-component="Portal"]')
    expect(portalNodeAfter).toBe(portalNodeBefore)
    expect(portalNodeAfter?.textContent?.trim()).toEqual('second')

    baseElement.innerHTML = ''
  })

  it('removes the portal container from the DOM when unmounted', () => {
    const {baseElement, unmount} = render(<Portal>cleanup-content</Portal>)
    const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')
    expect(generatedRoot?.querySelector('[data-component="Portal"]')).toBeInstanceOf(HTMLElement)

    unmount()
    expect(generatedRoot?.querySelector('[data-component="Portal"]')).toBeNull()

    baseElement.innerHTML = ''
  })
})
