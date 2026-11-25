import React from 'react'
import {Button} from '../../Button'
import {useFeatureFlag} from '../../FeatureFlags'
import {useMedia} from '../../hooks/useMedia'
import {viewportRanges} from '../../hooks/useResponsiveValue'
import {SelectPanel, type SelectPanelRootProps, type SelectPanelValue} from '..'
import {useSelectPanelContext} from '../SelectPanelContext'
import {nativeSelectPanelCapabilities} from './NativeSelectPanelContext'

interface PlatformSelectPanelProps {
  renderAs?: 'portal' | 'popover'
}

interface PlatformSelectPanelTestFixtureProps extends PlatformSelectPanelProps {
  open?: boolean
  onOpenChange?: SelectPanelRootProps['onOpenChange']
  closeOnSelect?: boolean
  onTriggerClick?: React.MouseEventHandler<HTMLButtonElement>
  onCloseClick?: React.MouseEventHandler<HTMLButtonElement>
}

const labels = [
  {value: 'bug', name: 'Bug'},
  {value: 'enhancement', name: 'Enhancement'},
  {value: 'accessibility', name: 'Accessibility'},
  {value: 'archived', name: 'Archived', disabled: true},
]

// Browser capabilities do not change during the fixture's lifetime. The server
// snapshot keeps hydration on the existing overlay before client enhancement.
const subscribeToCapabilities = () => () => undefined
const serverCapabilities = () => 'unsupported'
const serverAnchorPositioning = () => false
function nativeAnchorPositioning() {
  // Keep this check aligned with AnchoredOverlay's native capability gate.
  return (
    typeof document !== 'undefined' &&
    'anchorName' in document.documentElement.style &&
    'positionTryFallbacks' in document.documentElement.style &&
    'positionVisibility' in document.documentElement.style
  )
}

function PickerContent({onCloseClick}: Pick<PlatformSelectPanelTestFixtureProps, 'onCloseClick'>) {
  const state = useSelectPanelContext()
  const filtered = labels.filter(label => label.name.toLowerCase().includes(state.filterValue.trim().toLowerCase()))
  return (
    <SelectPanel.Content>
      <SelectPanel.Header>
        <SelectPanel.Title>Choose labels</SelectPanel.Title>
        <SelectPanel.CloseButton aria-label="Close picker" onClick={onCloseClick} />
      </SelectPanel.Header>
      <SelectPanel.Description>Pick labels for this issue. Archived is unavailable.</SelectPanel.Description>
      <SelectPanel.SearchInput aria-label="Filter labels" placeholder="Find a label" />
      <SelectPanel.List aria-label="Available labels">
        {filtered.map(label => (
          <SelectPanel.Item key={label.value} value={label.value} disabled={label.disabled}>
            {label.name}
          </SelectPanel.Item>
        ))}
      </SelectPanel.List>
      {filtered.length === 0 ? <p>No matching labels</p> : null}
      <SelectPanel.Footer>
        <Button onClick={() => state.dismiss('close')}>Done</Button>
      </SelectPanel.Footer>
    </SelectPanel.Content>
  )
}

function PickerHost({
  renderAs,
  popover,
  nativeDialog,
  onTriggerClick,
  onCloseClick,
}: PlatformSelectPanelProps &
  Pick<PlatformSelectPanelTestFixtureProps, 'onTriggerClick' | 'onCloseClick'> & {
    popover: boolean
    nativeDialog: boolean
  }) {
  const state = useSelectPanelContext()
  return (
    <>
      {!popover || nativeDialog ? <SelectPanel.Trigger onClick={onTriggerClick}>Labels</SelectPanel.Trigger> : null}
      <SelectPanel.Overlay
        // The legacy CSS-popover comparison uses the host's own browser
        // invoker target. Its generated ID is not the external Root's panel ID.
        renderAnchor={
          popover && !nativeDialog
            ? props => (
                <Button
                  {...props}
                  onClick={event => {
                    onTriggerClick?.(event)
                    if (!event.defaultPrevented) props.onClick?.(event)
                  }}
                >
                  Labels
                </Button>
              )
            : undefined
        }
        renderAs={renderAs}
        variant={nativeDialog ? {regular: 'modal'} : undefined}
        overlayProps={{_PrivateDisablePortal: popover}}
      >
        <PickerContent onCloseClick={onCloseClick} />
      </SelectPanel.Overlay>
      <span data-platform-open={String(state.open)}>Picker {state.open ? 'open' : 'closed'}</span>
    </>
  )
}

/** Story import only. This fixture is deliberately absent from package barrels. */
export function PlatformSelectPanel({renderAs}: PlatformSelectPanelProps) {
  return <PlatformSelectPanelTestFixture renderAs={renderAs} />
}

/** Test-only controls for controlled acceptance/rejection; not package API. */
export function PlatformSelectPanelTestFixture({
  renderAs,
  open,
  onOpenChange,
  closeOnSelect = false,
  onTriggerClick,
  onCloseClick,
}: PlatformSelectPanelTestFixtureProps) {
  const nativeDialogFlag = useFeatureFlag('primer_react_select_panel_native_dialog')
  const nativeInvokersFlag = useFeatureFlag('primer_react_select_panel_native_invokers')
  const cssAnchorPositioningFlag = useFeatureFlag('primer_react_css_anchor_positioning')
  const capabilities = React.useSyncExternalStore(
    subscribeToCapabilities,
    nativeSelectPanelCapabilities,
    serverCapabilities,
  )
  const supportsNativeAnchorPositioning = React.useSyncExternalStore(
    subscribeToCapabilities,
    nativeAnchorPositioning,
    serverAnchorPositioning,
  )
  const narrowViewport = useMedia(viewportRanges.narrow, false)
  const [selected, setSelected] = React.useState<SelectPanelValue[]>([])
  const nativeDialog = nativeDialogFlag && capabilities !== 'unsupported'
  const invokers = nativeDialog && nativeInvokersFlag && capabilities === 'invokers'
  const popover =
    renderAs === 'popover' && cssAnchorPositioningFlag && supportsNativeAnchorPositioning && !narrowViewport
  const overlayStatus =
    renderAs !== 'popover'
      ? 'Portal overlay active.'
      : !cssAnchorPositioningFlag
        ? 'Popover requested, but CSS anchor positioning flag is off; using portal overlay.'
        : !supportsNativeAnchorPositioning
          ? 'Popover requested, but native CSS anchor positioning is unsupported; using portal overlay.'
          : narrowViewport
            ? 'Popover requested, but the narrow fullscreen presentation uses a portal overlay.'
            : 'Native Popover API active.'
  return (
    <div
      data-platform-mode={nativeDialog ? (invokers ? 'native-invokers' : 'native-dialog') : 'standard-overlay'}
      data-platform-overlay={nativeDialog ? undefined : popover ? 'popover' : 'portal'}
    >
      <p role="status">
        {!nativeDialogFlag
          ? 'Standard SelectPanel overlay (native dialog flag off).'
          : capabilities === 'unsupported'
            ? 'Native dialog unsupported; using the standard SelectPanel overlay.'
            : invokers
              ? 'Native dialog with browser command invokers.'
              : nativeInvokersFlag
                ? 'Native command invokers unsupported; using JavaScript controls with native dialog.'
                : 'Native dialog with JavaScript controls (invokers flag off).'}
        {!nativeDialog ? ` ${overlayStatus}` : null}
      </p>
      <SelectPanel.Root
        open={open}
        onOpenChange={onOpenChange}
        selected={selected}
        onSelectedChange={setSelected}
        selectionMode="multiple"
        closeOnSelect={closeOnSelect}
      >
        <PickerHost
          renderAs={renderAs}
          popover={popover}
          nativeDialog={nativeDialog}
          onTriggerClick={onTriggerClick}
          onCloseClick={onCloseClick}
        />
      </SelectPanel.Root>
      <p>
        Selected labels:{' '}
        {labels
          .filter(label => selected.includes(label.value))
          .map(label => label.name)
          .join(', ') || 'None'}
      </p>
    </div>
  )
}
