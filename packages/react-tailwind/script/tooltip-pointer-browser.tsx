import {Tooltip as BaseTooltip} from '@base-ui/react/tooltip'
import {DashIcon, PlusIcon} from '@primer/octicons-react'
import React from 'react'
import {createRoot} from 'react-dom/client'
import {IconButton} from '../src/components/IconButton'
import {TextInput} from '../src/components/TextInput'
import {Tooltip} from '../src/components/Tooltip'

export function Fixture({
  edge,
  hint,
  hoverFixture,
  mode,
}: {
  edge: boolean
  hint: boolean
  hoverFixture: boolean
  mode: string | null
}) {
  const [value, setValue] = React.useState('workflow')
  const [clears, setClears] = React.useState(0)
  const icon = (
    <IconButton
      aria-label="Add workflow name"
      icon={PlusIcon}
      keybindingHint={hint ? 'Control+K' : undefined}
      tooltipDirection={mode === 'top' ? 'n' : 's'}
    />
  )
  const trigger =
    mode === 'raw' ? (
      <BaseTooltip.Root>
        <BaseTooltip.Trigger
          aria-label="Add workflow name"
          render={
            <button style={{width: 32, height: 32}} type="button">
              +
            </button>
          }
        />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side="bottom" sideOffset={4} style={{zIndex: 500}}>
            <BaseTooltip.Popup
              data-testid="raw-tooltip"
              style={{background: 'black', color: 'white', padding: '4px 8px', whiteSpace: 'nowrap'}}
            >
              Add workflow name
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    ) : mode === 'composed' || mode === 'pass-through' || mode === 'pass-through-positioner' || mode === 'no-hover' ? (
      <Tooltip.Root disableHoverablePopup={mode === 'no-hover'} type="label">
        <Tooltip.Trigger render={icon} />
        <Tooltip.Content
          positionerClassName={mode === 'pass-through-positioner' ? 'pointer-events-none' : undefined}
          side="bottom"
          style={mode === 'pass-through' ? {pointerEvents: 'none'} : undefined}
        >
          Add workflow name
        </Tooltip.Content>
      </Tooltip.Root>
    ) : (
      icon
    )

  return (
    <div style={{width: 240, marginTop: edge ? 0 : 120}}>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>{trigger}</div>
      <div style={{marginTop: hoverFixture ? 60 : 0}}>
        <TextInput
          aria-label="Workflow name"
          block
          onChange={event => setValue(event.target.value)}
          trailingAction={
            <TextInput.Action
              aria-label="Clear workflow name"
              icon={DashIcon}
              onClick={() => {
                setClears(current => current + 1)
                setValue('')
              }}
            />
          }
          value={value}
        />
      </div>
      <output data-testid="clears">{clears}</output>
    </div>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Tooltip pointer fixture root not found')
  const params = new URLSearchParams(location.search)
  createRoot(root).render(
    <Fixture
      edge={params.has('edge')}
      hint={params.has('hint')}
      hoverFixture={params.has('hover')}
      mode={params.get('mode')}
    />,
  )
}

mountFixture()
