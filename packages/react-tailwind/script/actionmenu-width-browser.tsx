import React from 'react'
import {createRoot} from 'react-dom/client'
import {DirectionProvider} from '@base-ui/react/direction-provider'
import type {OverlayMaxWidth, OverlayWidth} from '../src/utils/types'
import {ActionMenu, type ActionMenuContentProps} from '../src/components/ActionMenu/ActionMenu'

interface MenuExampleProps {
  boundaryWidth?: number
  className?: string
  fullscreen?: boolean
  itemText?: string
  label: string
  maxWidth?: OverlayMaxWidth
  width?: OverlayWidth
}

function MenuExample({boundaryWidth, className, fullscreen, itemText, label, maxWidth, width}: MenuExampleProps) {
  const [boundary, setBoundary] = React.useState<HTMLDivElement | null>(null)
  const [selections, setSelections] = React.useState(0)

  return (
    <div
      data-testid={`${label}-boundary`}
      ref={setBoundary}
      style={{width: boundaryWidth ?? '100%', minHeight: boundaryWidth ? 200 : undefined}}
    >
      <ActionMenu>
        <ActionMenu.Button>{label}</ActionMenu.Button>
        <ActionMenu.Content
          aria-label={`${label} menu`}
          className={className}
          collisionBoundary={boundaryWidth ? (boundary ?? undefined) : undefined}
          collisionPadding={8}
          maxWidth={maxWidth}
          variant={fullscreen ? {narrow: 'fullscreen'} : 'anchored'}
          width={width}
        >
          <ActionMenu.Item onClick={() => setSelections(count => count + 1)}>
            {itemText ?? 'A long menu action that should remain readable'}
          </ActionMenu.Item>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger>Nested actions</ActionMenu.SubmenuTrigger>
            <ActionMenu.Content
              aria-label={`${label} submenu`}
              collisionBoundary={boundaryWidth ? (boundary ?? undefined) : undefined}
              collisionPadding={8}
              width="medium"
            >
              <ActionMenu.Item>Nested option</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>
      <output data-testid={`${label}-selections`}>{selections}</output>
    </div>
  )
}

export function Example() {
  return (
    <>
      <MenuExample label="Small width" width="small" />
      <MenuExample label="Medium" width="medium" />
      <MenuExample label="Large" maxWidth="large" width="large" />
      <MenuExample label="Auto" width="auto" />
      <MenuExample itemText="Go" label="Default width" />
      <MenuExample itemText="Go" label="Short auto" width="auto" />
      <MenuExample itemText={'LongUnbrokenWord'.repeat(8)} label="Long auto" width="auto" />
      <MenuExample boundaryWidth={160} label="Boundary" width="medium" />
      <MenuExample boundaryWidth={160} label="Auto boundary" width="auto" />
      <MenuExample label="Capped" maxWidth="small" width="large" />
      <MenuExample label="Medium cap" maxWidth="medium" width="xxlarge" />
      <MenuExample label="Large cap" maxWidth="large" width="xxlarge" />
      <MenuExample label="Extra large cap" maxWidth="xlarge" width="xxlarge" />
      <MenuExample label="Double extra large cap" maxWidth="xxlarge" width="xxlarge" />
      <MenuExample label="Extra large width" width="xlarge" />
      <MenuExample label="Double extra large width" width="xxlarge" />
      <MenuExample className="max-w-none" label="Custom max" maxWidth="small" width="large" />
      <MenuExample className="w-[30rem]" label="Custom width" width="large" />
      <MenuExample fullscreen label="Fullscreen" width="large" />
    </>
  )
}

function ReviewEffortExample() {
  return (
    <ActionMenu>
      <ActionMenu.Button>Balanced</ActionMenu.Button>
      <ActionMenu.Content align="end">
        <ActionMenu.RadioGroup value="balanced">
          <ActionMenu.RadioItem value="default">
            <span>Default (Lite)</span>
            <ActionMenu.Description variant="block">
              Inherit the GitHub default review effort level for this organization
            </ActionMenu.Description>
          </ActionMenu.RadioItem>
          <ActionMenu.RadioItem value="balanced">Balanced</ActionMenu.RadioItem>
        </ActionMenu.RadioGroup>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

function HorizontalPlacementExample({params, anchorTop}: {params: URLSearchParams; anchorTop: number}) {
  const [selections, setSelections] = React.useState(0)
  const [boundary, setBoundary] = React.useState<HTMLDivElement | null>(null)
  const side = (['left', 'right', 'inline-start', 'inline-end'] as const).find(value => value === params.get('side'))
  if (!side) throw new Error('Expected a horizontal placement in the fixture URL.')
  const triggerSize = params.get('trigger')
  if (triggerSize !== 'wide' && triggerSize !== 'compact' && triggerSize !== 'left' && triggerSize !== 'right') {
    throw new Error('Expected a fixture trigger size.')
  }
  const avoidance = params.get('avoidance')
  let collisionAvoidance: ActionMenuContentProps['collisionAvoidance']
  if (avoidance === 'fallback') collisionAvoidance = {fallbackAxisSide: 'end'}
  else if (avoidance === 'none') collisionAvoidance = {side: 'none', align: 'none'}
  else if (avoidance === 'no-fallback') collisionAvoidance = {fallbackAxisSide: 'none'}
  else if (avoidance === 'start') collisionAvoidance = {fallbackAxisSide: 'start'}
  else if (avoidance === 'align-shift') collisionAvoidance = {align: 'shift'}
  else if (avoidance === 'shift') collisionAvoidance = {side: 'shift', align: 'shift'}
  else if (avoidance !== 'default') throw new Error('Expected a fixture collision avoidance mode.')
  const constrained = params.get('boundary') === 'element'
  const subtreeRtl = params.get('subtree') === 'rtl'
  const inSubtreePortal = params.get('portal') === 'subtree'
  const label = params.get('label') === 'long' ? 'InternationalizationOptionsForRepositories' : 'Copy'
  const maxWidth = params.get('style-cap') === 'true' ? 'calc(100vw - 32px)' : undefined
  const minWidth = params.get('override-min') === 'true' ? 0 : undefined

  return (
    <div
      data-testid="horizontal-boundary"
      dir={subtreeRtl ? 'rtl' : undefined}
      ref={setBoundary}
      style={constrained ? {position: 'absolute', left: 32, right: 32, top: 60, bottom: 60} : undefined}
    >
      <div
        style={{
          position: 'absolute',
          top: constrained ? 80 : anchorTop,
          ...(triggerSize === 'wide' ? {left: 8, right: 8} : {width: 80}),
          ...(triggerSize === 'compact' ? {left: '50%'} : {}),
          ...(triggerSize === 'left' ? {left: 8} : {}),
          ...(triggerSize === 'right' ? {right: 8} : {}),
        }}
      >
        <ActionMenu>
          <ActionMenu.Trigger
            render={
              <button type="button" style={{width: '100%'}}>
                Options
              </button>
            }
          />
          <ActionMenu.Content
            aria-label="Options menu"
            collisionAvoidance={collisionAvoidance}
            collisionBoundary={constrained && boundary ? boundary : []}
            container={inSubtreePortal ? boundary : undefined}
            side={side}
            style={{maxWidth, minWidth}}
            variant={params.get('fullscreen') === 'true' ? {narrow: 'fullscreen'} : 'anchored'}
            width="medium"
          >
            {params.get('submenu') === 'true' ? (
              <ActionMenu.Submenu>
                <ActionMenu.SubmenuTrigger>More</ActionMenu.SubmenuTrigger>
                <ActionMenu.Content
                  aria-label="More options"
                  collisionAvoidance={collisionAvoidance}
                  collisionBoundary={constrained && boundary ? boundary : []}
                  side={side}
                  width="medium"
                >
                  <ActionMenu.Item onClick={() => setSelections(count => count + 1)}>{label}</ActionMenu.Item>
                </ActionMenu.Content>
              </ActionMenu.Submenu>
            ) : (
              <ActionMenu.Item onClick={() => setSelections(count => count + 1)}>{label}</ActionMenu.Item>
            )}
          </ActionMenu.Content>
        </ActionMenu>
        <output data-testid="horizontal-selections">{selections}</output>
      </div>
    </div>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('ActionMenu fixture root not found')
  const params = new URLSearchParams(window.location.search)
  const horizontal = params.get('scenario') === 'horizontal'
  const reviewEffort = params.get('scenario') === 'review-effort'
  const direction = params.get('subtree') === 'rtl' || document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'
  createRoot(root).render(
    <DirectionProvider direction={direction}>
      {horizontal ? (
        <HorizontalPlacementExample params={params} anchorTop={Math.min(140, Math.floor(window.innerHeight / 2))} />
      ) : reviewEffort ? (
        <ReviewEffortExample />
      ) : (
        <Example />
      )}
    </DirectionProvider>,
  )
}

mountExample()
