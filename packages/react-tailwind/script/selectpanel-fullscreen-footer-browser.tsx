import React from 'react'
import {createRoot} from 'react-dom/client'
import {FeatureFlags} from '../src/components/FeatureFlags'
import {SelectPanel, type SelectPanelItem, type SelectPanelOpenChangeGesture} from '../src/components/SelectPanel'

const items: SelectPanelItem[] = [
  {id: 'mona', text: 'Mona'},
  {id: 'hubot', text: 'Hubot'},
]

type Mode = 'multiple' | 'multiple-cancel' | 'single' | 'single-cancel' | 'modal-single' | 'modal-multiple'

export function Fixture({
  mode,
  flag,
  optOut,
  rejectClose,
  secondary,
}: {
  mode: Mode
  flag: boolean
  optOut: boolean
  rejectClose: boolean
  secondary: boolean
}) {
  const multiple = mode === 'multiple' || mode === 'multiple-cancel' || mode === 'modal-multiple'
  const modal = mode === 'modal-single' || mode === 'modal-multiple'
  const hasCancel = modal || mode === 'multiple-cancel' || mode === 'single-cancel'
  const [selected, setSelected] = React.useState<SelectPanelItem | SelectPanelItem[] | undefined>(
    multiple ? [] : undefined,
  )
  const [open, setOpen] = React.useState(false)
  const [acceptClose, setAcceptClose] = React.useState(!rejectClose)
  const [events, setEvents] = React.useState<string[]>([])
  const previousSelection = React.useRef(selected)

  const onCancel = () => {
    setEvents(current => [...current, 'cancel'])
    setSelected(previousSelection.current)
  }
  const onOpenChange = (next: boolean, gesture: SelectPanelOpenChangeGesture) => {
    setEvents(current => [...current, `${next ? 'open' : 'close'}:${gesture}`])
    if (next) previousSelection.current = selected
    if (next || acceptClose) setOpen(next)
  }
  const onSelectedChange = (next: SelectPanelItem | SelectPanelItem[] | undefined) => {
    setEvents(current => [...current, 'selection'])
    setSelected(next)
  }
  const selectionProps = multiple
    ? ({
        selectionVariant: 'multiple',
        selected: Array.isArray(selected) ? selected : [],
        onSelectedChange: (next: SelectPanelItem[]) => onSelectedChange(next),
      } as const)
    : ({
        selectionVariant: 'single',
        selected: Array.isArray(selected) ? undefined : selected,
        onSelectedChange: (next: SelectPanelItem | undefined) => onSelectedChange(next),
      } as const)
  const variantProps = modal
    ? ({variant: 'modal', onCancel} as const)
    : ({variant: 'anchored', onCancel: hasCancel ? onCancel : undefined} as const)

  return (
    <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: flag}}>
      <SelectPanel
        {...variantProps}
        disableFullscreenOnNarrow={optOut}
        items={items}
        onOpenChange={onOpenChange}
        {...selectionProps}
        open={open}
        secondaryAction={
          secondary ? (
            <SelectPanel.SecondaryActionButton onClick={() => setAcceptClose(true)}>
              Allow close
            </SelectPanel.SecondaryActionButton>
          ) : undefined
        }
        title="Projects"
      />
      <output data-testid="selected">
        {JSON.stringify((Array.isArray(selected) ? selected : selected ? [selected] : []).map(item => item.text))}
      </output>
      <output data-testid="events">{JSON.stringify(events)}</output>
    </FeatureFlags>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Missing fixture root')
  const params = new URLSearchParams(document.location.search)
  const mode = params.get('mode')
  if (
    mode !== 'multiple' &&
    mode !== 'multiple-cancel' &&
    mode !== 'single' &&
    mode !== 'single-cancel' &&
    mode !== 'modal-single' &&
    mode !== 'modal-multiple'
  ) {
    throw new Error('Unknown SelectPanel footer fixture mode')
  }
  createRoot(root).render(
    <Fixture
      flag={params.get('flag') !== 'off'}
      mode={mode}
      optOut={params.get('opt-out') === 'true'}
      rejectClose={params.get('reject') === 'true'}
      secondary={params.get('secondary') === 'true'}
    />,
  )
}

mountFixture()
