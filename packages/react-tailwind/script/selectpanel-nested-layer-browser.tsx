import React from 'react'
import {createRoot} from 'react-dom/client'
import {ConfirmationDialog} from '../src/components/ConfirmationDialog'
import {Dialog} from '../src/components/Dialog'
import {FeatureFlags} from '../src/components/FeatureFlags'
import {Popover} from '../src/components/Popover'
import {Portal} from '../src/components/Portal'
import {SelectPanel, type SelectPanelItem} from '../src/components/SelectPanel'

const parentItems: SelectPanelItem[] = [{id: 'parent', text: 'Parent option'}]
const childItems: SelectPanelItem[] = [{id: 'child', text: 'Child option'}]

type Mode = 'default' | 'positioner' | 'container' | 'inline'

interface FixtureProps {
  acceptsParentClose: boolean
  kind: 'panel' | 'dialog' | 'confirmation'
  mode: Mode
  namedRoot: boolean
  presentation: 'fullscreen' | 'modal'
}

export function Fixture({acceptsParentClose, kind, mode, namedRoot, presentation}: FixtureProps) {
  const [parentOpen, setParentOpen] = React.useState(false)
  const [childOpen, setChildOpen] = React.useState(false)
  const [nestedActions, setNestedActions] = React.useState(0)
  const [selection, setSelection] = React.useState<SelectPanelItem | undefined>()
  const portalRoot = React.useRef<HTMLDivElement>(null)
  const variantProps =
    presentation === 'modal' ? ({variant: 'modal', onCancel: () => {}} as const) : ({variant: 'anchored'} as const)

  const details = (
    <Popover>
      <Popover.Button>More details</Popover.Button>
      <Popover.Content aria-label="Nested details">
        <button onClick={() => setNestedActions(count => count + 1)} type="button">
          Nested action
        </button>
        <Dialog>
          <Dialog.Trigger>Open nested dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Nested dialog</Dialog.Title>
            <Dialog.Close>Close nested dialog</Dialog.Close>
          </Dialog.Content>
        </Dialog>
      </Popover.Content>
    </Popover>
  )

  const child =
    kind === 'dialog' ? (
      <Dialog>
        <Dialog.Trigger>Child picker</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Child picker</Dialog.Title>
          {details}
        </Dialog.Content>
      </Dialog>
    ) : kind === 'confirmation' ? (
      <ConfirmationDialog title="Child picker" trigger={<button type="button">Child picker</button>}>
        {details}
      </ConfirmationDialog>
    ) : (
      <SelectPanel
        {...variantProps}
        items={childItems}
        onOpenChange={setChildOpen}
        onSelectedChange={value => setSelection(Array.isArray(value) ? value[0] : value)}
        open={childOpen}
        overlayProps={
          mode === 'positioner'
            ? {positionerClassName: 'raised-viewport'}
            : mode === 'container'
              ? {container: portalRoot}
              : mode === 'inline'
                ? {portal: false}
                : undefined
        }
        secondaryAction={details}
        selected={selection}
        title="Child picker"
      />
    )

  return (
    <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: true}}>
      <div data-testid="portal-root" ref={portalRoot} style={{position: 'relative', zIndex: 501}} />
      <Portal.Provider container={namedRoot ? portalRoot : undefined}>
        <SelectPanel
          disableFullscreenOnNarrow
          items={parentItems}
          onOpenChange={next => {
            if (next || acceptsParentClose) setParentOpen(next)
          }}
          onSelectedChange={() => {}}
          open={parentOpen}
          secondaryAction={child}
          selected={undefined}
          title="Parent picker"
        />
      </Portal.Provider>
      <output data-testid="selected">{selection?.text}</output>
      <output data-testid="nested-actions">{nestedActions}</output>
    </FeatureFlags>
  )
}

function mountFixture() {
  const container = document.getElementById('root')
  if (!container) throw new Error('Missing fixture root')
  const params = new URLSearchParams(document.location.search)
  const mode = params.get('mode')
  if (mode !== 'default' && mode !== 'positioner' && mode !== 'container' && mode !== 'inline') {
    throw new Error('Unknown SelectPanel layer fixture mode')
  }
  const presentation = params.get('presentation')
  if (presentation !== 'fullscreen' && presentation !== 'modal') {
    throw new Error('Unknown SelectPanel layer fixture presentation')
  }
  const kind = params.get('kind')
  if (kind !== 'panel' && kind !== 'dialog' && kind !== 'confirmation') {
    throw new Error('Unknown nested modal fixture kind')
  }
  createRoot(container).render(
    <Fixture
      acceptsParentClose={params.get('parent') === 'accept'}
      kind={kind}
      mode={mode}
      namedRoot={params.get('root') === 'named'}
      presentation={presentation}
    />,
  )
}

mountFixture()
