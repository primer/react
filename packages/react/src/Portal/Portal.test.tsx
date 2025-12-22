import {describe, expect, it} from 'vitest'
import Portal, {registerPortalRoot, PortalContext} from '../Portal/index'

import {render} from '@testing-library/react'
import BaseStyles from '../BaseStyles'
import React from 'react'
import {FeatureFlags} from '../FeatureFlags'

describe('Portal', () => {
  it('renders a default portal into document.body (no BaseStyles present)', () => {
    const {baseElement} = render(<Portal>123test123</Portal>)
    const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')
    expect(generatedRoot).toBeInstanceOf(HTMLElement)
    expect(generatedRoot?.textContent.trim()).toEqual('123test123')
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

    // Cleanup
    document.body.removeChild(contextPortalRoot)
    document.body.removeChild(propPortalRoot)
  })

  describe('CSS containment feature flag', () => {
    it('does not apply CSS containment by default', () => {
      const {baseElement} = render(<Portal>test-content</Portal>)
      const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')
      const portalElement = generatedRoot?.firstElementChild as HTMLElement

      expect(portalElement).toBeInstanceOf(HTMLElement)
      expect(portalElement.style.contain).toBe('')

      baseElement.innerHTML = ''
    })

    it('applies CSS containment when primer_react_css_contain_portal flag is enabled', () => {
      const toRender = (
        <FeatureFlags flags={{primer_react_css_contain_portal: true}}>
          <Portal>contained-content</Portal>
        </FeatureFlags>
      )

      const {baseElement} = render(toRender)
      const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')
      const portalElement = generatedRoot?.firstElementChild as HTMLElement

      expect(portalElement).toBeInstanceOf(HTMLElement)
      expect(portalElement.style.contain).toBe('layout style')

      baseElement.innerHTML = ''
    })

    it('does not apply CSS containment when flag is explicitly disabled', () => {
      const toRender = (
        <FeatureFlags flags={{primer_react_css_contain_portal: false}}>
          <Portal>uncontained-content</Portal>
        </FeatureFlags>
      )

      const {baseElement} = render(toRender)
      const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')
      const portalElement = generatedRoot?.firstElementChild as HTMLElement

      expect(portalElement).toBeInstanceOf(HTMLElement)
      expect(portalElement.style.contain).toBe('')

      baseElement.innerHTML = ''
    })

    it('removes CSS containment when flag changes from enabled to disabled', () => {
      const {baseElement, rerender} = render(
        <FeatureFlags flags={{primer_react_css_contain_portal: true}}>
          <Portal>toggle-content</Portal>
        </FeatureFlags>,
      )

      const generatedRoot = baseElement.querySelector('#__primerPortalRoot__')
      const portalElement = generatedRoot?.firstElementChild as HTMLElement

      expect(portalElement.style.contain).toBe('layout style')

      rerender(
        <FeatureFlags flags={{primer_react_css_contain_portal: false}}>
          <Portal>toggle-content</Portal>
        </FeatureFlags>,
      )

      expect(portalElement.style.contain).toBe('')

      baseElement.innerHTML = ''
    })
  })
})
