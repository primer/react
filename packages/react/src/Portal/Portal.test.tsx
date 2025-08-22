import {describe, expect, it} from 'vitest'
import Portal, {registerPortalRoot} from '../Portal/index'

import {render} from '@testing-library/react'
import BaseStyles from '../BaseStyles'

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
})
