import React from 'react'
import {createRoot} from 'react-dom/client'
import {Button} from '../src/components/Button'
import {ConfirmationDialog} from '../src/components/ConfirmationDialog'

export function Example({
  compound,
  dismissOutside,
  draft,
  dynamic,
  mode,
  omitControls,
}: {
  compound: boolean
  dismissOutside: boolean
  draft: boolean
  dynamic: boolean
  mode: string | null
  omitControls: boolean
}) {
  const [outsideClicks, setOutsideClicks] = React.useState(0)
  let initialModal: boolean | 'trap-focus' | undefined
  if (mode === 'default') initialModal = undefined
  else if (mode === 'modal') initialModal = true
  else if (mode === 'non-modal') initialModal = false
  else if (mode === 'trap-focus') initialModal = 'trap-focus'
  else throw new Error('Expected a supported confirmation dialog modality.')
  const [modal, setModal] = React.useState(initialModal)

  const controlProps = omitControls ? {'aria-controls': undefined} : {}
  const trigger = <Button {...(!compound ? controlProps : {})}>Open confirmation</Button>
  const modalityControls = dynamic && (
    <>
      <Button onClick={() => setModal(false)}>Allow outside interaction</Button>
      <Button onClick={() => setModal(true)}>Restore modal interaction</Button>
    </>
  )
  const draftField = draft && (
    <label>
      Draft
      <input />
    </label>
  )
  const confirmation = compound ? (
    <ConfirmationDialog.Root disablePointerDismissal={!dismissOutside} modal={modal}>
      <ConfirmationDialog.Trigger {...controlProps} render={trigger} />
      <ConfirmationDialog.Portal>
        <ConfirmationDialog.Backdrop />
        <ConfirmationDialog.Viewport>
          <ConfirmationDialog.Content>
            <ConfirmationDialog.Title>Continue?</ConfirmationDialog.Title>
            {modalityControls}
            {draftField}
            <ConfirmationDialog.Close render={<Button>Cancel</Button>} />
            <ConfirmationDialog.Close render={<Button>Confirm</Button>} />
          </ConfirmationDialog.Content>
        </ConfirmationDialog.Viewport>
      </ConfirmationDialog.Portal>
    </ConfirmationDialog.Root>
  ) : (
    <ConfirmationDialog disablePointerDismissal={!dismissOutside} modal={modal} title="Continue?" trigger={trigger}>
      {modalityControls}
      {draftField}
    </ConfirmationDialog>
  )

  return (
    <>
      <button data-testid="outside" onClick={() => setOutsideClicks(count => count + 1)} type="button">
        Outside clicks: {outsideClicks}
      </button>
      {confirmation}
    </>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Confirmation dialog fixture root not found.')
  const params = new URLSearchParams(window.location.search)
  createRoot(root).render(
    <Example
      compound={params.get('compound') === 'true'}
      dismissOutside={params.get('dismissOutside') === 'true'}
      draft={params.get('draft') === 'true'}
      dynamic={params.get('dynamic') === 'true'}
      mode={params.get('mode')}
      omitControls={params.get('omit') === 'true'}
    />,
  )
}

mountExample()
