import React from 'react'
import {createRoot} from 'react-dom/client'
import {Button} from '../src/components/Button'
import {Dialog} from '../src/components/Dialog'

export function Example({
  disablePointerDismissal,
  focusTrap,
  levelOneTitle,
  omitControls,
  trigger,
}: {
  disablePointerDismissal: boolean
  focusTrap: boolean
  levelOneTitle: boolean
  omitControls: boolean
  trigger: string | null
}) {
  const [outsideClicks, setOutsideClicks] = React.useState(0)
  const controlProps = omitControls ? {'aria-controls': undefined} : {}
  let dialogTrigger: React.ReactNode
  if (trigger === 'native') {
    dialogTrigger = <Dialog.Trigger {...controlProps}>Open settings</Dialog.Trigger>
  } else if (trigger === 'render' || trigger === 'render-omits') {
    const renderProps = trigger === 'render-omits' ? {'aria-controls': undefined} : {}
    dialogTrigger = <Dialog.Trigger {...controlProps} render={<Button {...renderProps}>Open settings</Button>} />
  } else {
    throw new Error('Expected a supported Dialog trigger.')
  }

  return (
    <>
      {focusTrap && (
        <button data-testid="outside" onClick={() => setOutsideClicks(count => count + 1)} type="button">
          Outside clicks: {outsideClicks}
        </button>
      )}
      <Dialog disablePointerDismissal={disablePointerDismissal} modal={focusTrap ? 'trap-focus' : true}>
        {dialogTrigger}
        <Dialog.Content id="settings-dialog">
          <Dialog.Header>
            <Dialog.Title render={levelOneTitle ? React.createElement('h1') : undefined}>Settings</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <label>
              Setting
              <input />
            </label>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button>Cancel</Button>} />
            <Button>Save</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Dialog fixture root not found.')
  const params = new URLSearchParams(window.location.search)
  createRoot(root).render(
    <Example
      disablePointerDismissal={params.get('disablePointerDismissal') === 'true'}
      focusTrap={params.get('modal') === 'trap-focus'}
      levelOneTitle={params.get('title') === 'h1'}
      omitControls={params.get('omit') === 'true'}
      trigger={params.get('trigger')}
    />,
  )
}

mountExample()
