import React from 'react'
import {createRoot} from 'react-dom/client'
import {ActionMenu, type ActionMenuRootProps} from '../src/components/ActionMenu'

type Mode =
  | 'uncontrolled'
  | 'controlled'
  | 'reject'
  | 'cancel'
  | 'cancel-uncontrolled'
  | 'custom-final'
  | 'custom-keep'
  | 'prevent-return'
  | 'keep-mounted'
  | 'handoff'
  | 'submenu-reject'
  | 'submenu-cancel'
  | 'submenu-cancel-uncontrolled'

interface ExampleProps {
  modal: boolean
  mode: Mode
  portal: boolean
}

export function Example({modal, mode, portal}: ExampleProps) {
  const [open, setOpen] = React.useState(false)
  const [submenuOpen, setSubmenuOpen] = React.useState(false)
  const [allowClose, setAllowClose] = React.useState(false)
  const [allowSubmenuClose, setAllowSubmenuClose] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selected, setSelected] = React.useState('first')
  const [lastRequest, setLastRequest] = React.useState('')
  const customFocusRef = React.useRef<HTMLButtonElement>(null)
  const actionsRef = React.useRef<NonNullable<ActionMenuRootProps['actionsRef']>['current']>(null)

  const onOpenChange: ActionMenuRootProps['onOpenChange'] = (nextOpen, details) => {
    setLastRequest(`${nextOpen ? 'open' : 'close'}:${details.reason}`)
    const reject =
      !nextOpen && !allowClose && (mode === 'reject' || mode === 'cancel' || mode === 'cancel-uncontrolled')
    if (reject && (mode === 'cancel' || mode === 'cancel-uncontrolled')) details.cancel()
    if (!nextOpen && (mode === 'keep-mounted' || mode === 'custom-keep')) details.preventUnmountOnClose()
    if (!reject) setOpen(nextOpen)
  }
  const onSubmenuOpenChange: React.ComponentProps<typeof ActionMenu.Submenu>['onOpenChange'] = (nextOpen, details) => {
    setLastRequest(`submenu:${nextOpen ? 'open' : 'close'}:${details.reason}`)
    const reject = !nextOpen && !allowSubmenuClose
    if (reject && (mode === 'submenu-cancel' || mode === 'submenu-cancel-uncontrolled')) details.cancel()
    if (!reject) setSubmenuOpen(nextOpen)
  }
  const probeSubmenu = mode === 'submenu-reject' || mode === 'submenu-cancel' || mode === 'submenu-cancel-uncontrolled'

  return (
    <>
      <button type="button">Previous control</button>
      <ActionMenu
        actionsRef={actionsRef}
        modal={modal}
        onOpenChange={onOpenChange}
        {...(mode === 'uncontrolled' || mode === 'cancel-uncontrolled' || probeSubmenu ? {} : {open})}
      >
        <ActionMenu.Button>Options</ActionMenu.Button>
        <ActionMenu.Content
          aria-label="Options menu"
          finalFocus={mode === 'custom-final' || mode === 'custom-keep' ? customFocusRef : undefined}
          portal={portal}
          preventFocusOnClose={mode === 'prevent-return' || (mode === 'handoff' && dialogOpen)}
        >
          <ActionMenu.RadioGroup onValueChange={setSelected} value={selected}>
            <ActionMenu.RadioItem value="first">First option</ActionMenu.RadioItem>
            <ActionMenu.RadioItem value="second">Second option</ActionMenu.RadioItem>
          </ActionMenu.RadioGroup>
          {mode === 'reject' || mode === 'cancel' || mode === 'cancel-uncontrolled' ? (
            <ActionMenu.Item closeOnClick={false} onClick={() => setAllowClose(true)}>
              Allow root close
            </ActionMenu.Item>
          ) : null}
          {mode === 'handoff' ? (
            <ActionMenu.Item onClick={() => setDialogOpen(true)}>Open editor</ActionMenu.Item>
          ) : null}
          <ActionMenu.Submenu
            {...(probeSubmenu
              ? {
                  onOpenChange: onSubmenuOpenChange,
                  ...(mode === 'submenu-cancel-uncontrolled' ? {} : {open: submenuOpen}),
                }
              : {})}
          >
            <ActionMenu.SubmenuTrigger>More options</ActionMenu.SubmenuTrigger>
            <ActionMenu.Content aria-label="More options menu">
              <ActionMenu.Item>Nested option</ActionMenu.Item>
              {probeSubmenu ? (
                <ActionMenu.Item closeOnClick={false} onClick={() => setAllowSubmenuClose(true)}>
                  Allow submenu close
                </ActionMenu.Item>
              ) : null}
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>
      <button style={{marginLeft: 240}} type="button">
        Next control
      </button>
      <button ref={customFocusRef} type="button">
        Custom return target
      </button>
      {mode === 'keep-mounted' || mode === 'custom-keep' ? (
        <button type="button" onClick={() => actionsRef.current?.unmount()}>
          Finish closing
        </button>
      ) : null}
      {dialogOpen ? (
        <div aria-label="Editor" role="dialog">
          <button autoFocus type="button">
            Editor control
          </button>
        </div>
      ) : null}
      <output data-testid="last-request" hidden>
        {lastRequest}
      </output>
    </>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('ActionMenu tab fixture root not found')
  const params = new URLSearchParams(document.location.search)
  const mode = params.get('mode')
  if (
    mode !== 'uncontrolled' &&
    mode !== 'controlled' &&
    mode !== 'reject' &&
    mode !== 'cancel' &&
    mode !== 'cancel-uncontrolled' &&
    mode !== 'custom-final' &&
    mode !== 'custom-keep' &&
    mode !== 'prevent-return' &&
    mode !== 'keep-mounted' &&
    mode !== 'handoff' &&
    mode !== 'submenu-reject' &&
    mode !== 'submenu-cancel' &&
    mode !== 'submenu-cancel-uncontrolled'
  ) {
    throw new Error('Unknown ActionMenu tab fixture mode')
  }
  createRoot(root).render(
    <Example modal={params.get('modal') === 'true'} mode={mode} portal={params.get('portal') !== 'false'} />,
  )
}

mountExample()
