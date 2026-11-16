import React from 'react'
import {createPortal} from 'react-dom'
import {createRoot} from 'react-dom/client'
import {PageLayout} from '../src/components/PageLayout/PageLayout'
import {usePaneWidth} from '../src/components/PageLayout/usePaneWidth'

export function ResponsivePane() {
  const paneRef = React.useRef<HTMLDivElement>(null)
  const handleRef = React.useRef<HTMLDivElement>(null)
  const {currentWidth} = usePaneWidth({width: 'medium', minWidth: 240, resizable: false, paneRef, handleRef})

  return (
    <div
      data-testid="responsive-pane"
      data-width={currentWidth}
      ref={paneRef}
      style={{height: currentWidth === 256 ? 1600 : 300}}
    >
      Responsive pane
    </div>
  )
}

export function ResizableSidebar() {
  return (
    <PageLayout>
      <PageLayout.Sidebar resizable width={{min: '240px', default: '300px', max: '480px'}}>
        <div style={{height: 1200}}>Sidebar content</div>
      </PageLayout.Sidebar>
      <PageLayout.Content>Content</PageLayout.Content>
    </PageLayout>
  )
}

function ControlledSidebar({acceptResize}: {acceptResize: boolean}) {
  const [lastResize, setLastResize] = React.useState<number | null>(null)
  const [width, setWidth] = React.useState(400)
  return (
    <>
      <PageLayout>
        <PageLayout.Sidebar
          resizable
          currentWidth={width}
          onResizeEnd={next => {
            setLastResize(next)
            if (acceptResize) setWidth(next)
          }}
          width={{min: '240px', default: '300px', max: '480px'}}
        >
          Sidebar content
        </PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>
      <output data-testid="last-resize">{lastResize ?? 'none'}</output>
      <button type="button" onClick={() => lastResize !== null && setWidth(lastResize)}>
        Apply requested width
      </button>
    </>
  )
}

export function EmbeddedLayout() {
  return (
    <>
      <PageLayout>
        <PageLayout.Pane width="medium">Pane content</PageLayout.Pane>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>
      <ResizableSidebar />
    </>
  )
}

function MovingPane({target, resizable}: {target: HTMLElement | null; resizable: boolean}) {
  const paneRef = React.useRef<HTMLDivElement>(null)
  const handleRef = React.useRef<HTMLDivElement>(null)
  const {currentWidth, maxPaneWidth} = usePaneWidth({
    width: resizable ? {min: '240px', default: '300px', max: '480px'} : 'medium',
    minWidth: 240,
    resizable,
    constrainToViewport: true,
    paneRef,
    handleRef,
  })
  if (!target) return null
  const name = resizable ? 'resizable' : 'responsive'
  return createPortal(
    <div ref={paneRef} data-testid={`moving-${name}`} data-width={currentWidth} data-max-width={maxPaneWidth}>
      <div ref={handleRef} data-testid={`moving-${name}-handle`} />
    </div>,
    target,
  )
}

function MovingLayout({frameTarget, parentTarget}: {frameTarget: HTMLElement; parentTarget: HTMLElement}) {
  const [destination, setDestination] = React.useState<'none' | 'frame' | 'parent'>('none')
  const target = destination === 'frame' ? frameTarget : destination === 'parent' ? parentTarget : null
  return (
    <>
      <button type="button" onClick={() => setDestination('frame')}>
        Move to frame
      </button>
      <button type="button" onClick={() => setDestination('parent')}>
        Move to parent
      </button>
      <MovingPane target={target} resizable={false} />
      <MovingPane target={target} resizable />
    </>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('PageLayout viewport fixture root not found')
  const mode = new URLSearchParams(location.search).get('mode')
  let mount = root
  if (mode === 'moving') {
    const frame = document.createElement('iframe')
    frame.setAttribute('data-testid', 'viewport-frame')
    frame.style.cssText = 'width: 800px; height: 300px; border: 0'
    root.after(frame)
    const frameDocument = frame.contentDocument
    if (!frameDocument) throw new Error('Expected an accessible frame')
    const parentTarget = document.createElement('div')
    parentTarget.setAttribute('data-testid', 'parent-target')
    root.after(parentTarget)
    createRoot(root).render(<MovingLayout frameTarget={frameDocument.body} parentTarget={parentTarget} />)
    return
  }
  if (mode === 'frame') {
    const frame = document.createElement('iframe')
    frame.setAttribute('data-testid', 'viewport-frame')
    frame.style.cssText = 'width: 1024px; height: 900px; border: 0'
    root.append(frame)
    const frameDocument = frame.contentDocument
    if (!frameDocument) throw new Error('Expected an accessible frame')
    frameDocument.documentElement.lang = 'en'
    for (const style of document.querySelectorAll('style')) frameDocument.head.append(style.cloneNode(true))
    mount = frameDocument.createElement('div')
    frameDocument.body.append(mount)
  }
  const example =
    mode === 'frame' ? (
      <EmbeddedLayout />
    ) : mode === 'responsive' ? (
      <ResponsivePane />
    ) : mode === 'controlled' || mode === 'controlled-accept' ? (
      <ControlledSidebar acceptResize={mode === 'controlled-accept'} />
    ) : (
      <ResizableSidebar />
    )
  createRoot(mount).render(example)
}

mountExample()
