import React from 'react'
import {createRoot} from 'react-dom/client'
import {DragHandle} from '../src/components/PageLayout/DragHandle'
import {PageLayout} from '../src/components/PageLayout/PageLayout'

export function Example() {
  const handleRef = React.useRef<HTMLDivElement | null>(null)
  const paneRef = React.useRef<HTMLDivElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [updates, setUpdates] = React.useState({starts: 0, ends: 0, pointer: 0, keyboard: 0})

  return (
    <>
      <section aria-label="Standalone resize" data-testid="standalone">
        <div ref={paneRef} data-testid="standalone-pane">
          Pane
        </div>
        <div ref={contentRef} data-testid="standalone-content">
          Content
        </div>
        <div style={{position: 'relative', width: 12, height: 64, margin: 12}}>
          <DragHandle
            handleRef={handleRef}
            dragTargetRef={paneRef}
            contentWrapperRef={contentRef}
            aria-label="Resize standalone pane"
            aria-valuemin={0}
            aria-valuemax={1000}
            aria-valuenow={300}
            onDragStart={() => setUpdates(current => ({...current, starts: current.starts + 1}))}
            onDrag={(_, isKeyboard) =>
              setUpdates(current => ({
                ...current,
                [isKeyboard ? 'keyboard' : 'pointer']: current[isKeyboard ? 'keyboard' : 'pointer'] + 1,
              }))
            }
            onDragEnd={() => setUpdates(current => ({...current, ends: current.ends + 1}))}
          />
        </div>
        <input aria-label="After standalone handle" />
        <output data-testid="standalone-updates">{JSON.stringify(updates)}</output>
      </section>
      <section aria-label="Pane layout" data-testid="pane-layout">
        <PageLayout>
          <PageLayout.Pane resizable widthStorageKey="fixture-pane">
            Pane
          </PageLayout.Pane>
          <PageLayout.Content as="section" aria-label="Pane content">
            Content
          </PageLayout.Content>
        </PageLayout>
      </section>
      <section aria-label="Sidebar layout" data-testid="sidebar-layout">
        <PageLayout wrapperClassName="sidebar-wrapper">
          <PageLayout.Sidebar resizable widthStorageKey="fixture-sidebar">
            Sidebar
          </PageLayout.Sidebar>
          <PageLayout.Content as="section" aria-label="Sidebar content">
            Content
          </PageLayout.Content>
        </PageLayout>
      </section>
    </>
  )
}

export function GeometryExample({responsive = false, bounded = false}: {responsive?: boolean; bounded?: boolean}) {
  return (
    <>
      {(['pane', 'sidebar'] as const).flatMap(kind =>
        (['start', 'end'] as const).map(position => {
          const ResizableRegion = kind === 'pane' ? PageLayout.Pane : PageLayout.Sidebar
          return (
            <section data-testid={`${kind}-${position}`} key={`${kind}-${position}`}>
              <PageLayout columnGap="none" padding="none">
                <ResizableRegion
                  position={
                    responsive
                      ? {narrow: position, regular: position, wide: position === 'start' ? 'end' : 'start'}
                      : position
                  }
                  resizable
                  width={bounded ? {min: '280px', default: '296px', max: '310px'} : undefined}
                  widthStorageKey={`geometry-${kind}-${position}`}
                >
                  Resizable {kind}
                </ResizableRegion>
                <PageLayout.Content>Content</PageLayout.Content>
              </PageLayout>
            </section>
          )
        }),
      )}
    </>
  )
}

function LabelledExample() {
  return (
    <PageLayout>
      <PageLayout.Sidebar resizable aria-label="Navigation sidebar">
        Navigation
      </PageLayout.Sidebar>
      <PageLayout.Pane resizable aria-labelledby="inspector-heading">
        <h2 id="inspector-heading">Inspector</h2>
      </PageLayout.Pane>
      <PageLayout.Content>Content</PageLayout.Content>
    </PageLayout>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('PageLayout drag fixture root not found')
  const params = new URLSearchParams(location.search)
  let mount = root
  const scope = params.get('scope')
  if (scope === 'frame') {
    const frame = document.createElement('iframe')
    frame.setAttribute('data-testid', 'layout-frame')
    frame.style.cssText = 'width: 1024px; height: 900px; border: 0'
    root.append(frame)
    const frameDocument = frame.contentDocument
    if (!frameDocument) throw new Error('Expected an accessible frame')
    frameDocument.documentElement.dir = document.documentElement.dir
    frameDocument.documentElement.lang = document.documentElement.lang
    for (const style of document.querySelectorAll('style')) frameDocument.head.append(style.cloneNode(true))
    mount = frameDocument.createElement('div')
    frameDocument.body.append(mount)
  } else if (scope === 'shadow') {
    const shadow = root.attachShadow({mode: 'open'})
    for (const style of document.querySelectorAll('style')) shadow.append(style.cloneNode(true))
    mount = document.createElement('div')
    shadow.append(mount)
  }
  const layout = params.get('layout')
  const example =
    layout === 'labelled' ? (
      <LabelledExample />
    ) : ['geometry', 'responsive', 'bounded'].includes(layout ?? '') ? (
      <GeometryExample responsive={layout === 'responsive'} bounded={layout === 'bounded'} />
    ) : (
      <Example />
    )
  createRoot(mount).render(params.has('strict') ? <React.StrictMode>{example}</React.StrictMode> : example)
}

mountExample()
