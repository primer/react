// @vitest-environment node
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {BasePortalProvider} from '../base'
import {Portal} from '../components/Portal'
import type {PortalContainer} from '../utils/types/portal'
import {usePortalContainer, usePortalRoot} from './index'

function Probe({container}: {container?: PortalContainer}) {
  const resolved = usePortalContainer(container)
  return resolved === undefined ? 'undefined' : resolved === null ? 'null' : 'container'
}

function RootProbe() {
  return usePortalRoot() === null ? 'null' : 'root'
}

describe('portal routing on the server', () => {
  it('runs without a DOM', () => {
    expect(typeof document).toBe('undefined')
  })

  it('renders the provider without a wrapper and portals without markup', () => {
    expect(
      renderToString(
        <BasePortalProvider container={null}>
          Inline
          <Portal>Portaled</Portal>
        </BasePortalProvider>,
      ),
    ).toBe('Inline')
  })

  it('reports an unknown default root, and keeps provided and explicit null containers', () => {
    expect(renderToString(<Probe />)).toBe('undefined')
    expect(renderToString(<RootProbe />)).toBe('null')
    expect(
      renderToString(
        <BasePortalProvider container={null}>
          <Probe />
        </BasePortalProvider>,
      ),
    ).toBe('null')
    expect(renderToString(<Probe container={null} />)).toBe('null')
  })
})
