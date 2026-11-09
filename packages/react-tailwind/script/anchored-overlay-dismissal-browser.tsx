import React from 'react'
import {createRoot} from 'react-dom/client'
import {AnchoredOverlay} from '../src/components/AnchoredOverlay'

export function Example({controlled, preventOutside}: {controlled: boolean; preventOutside: boolean}) {
  const [open, setOpen] = React.useState(false)
  const [outsideClicks, setOutsideClicks] = React.useState(0)
  const [reasons, setReasons] = React.useState<string[]>([])

  return (
    <>
      <button
        data-testid="outside"
        onClick={() => setOutsideClicks(count => count + 1)}
        style={{position: 'fixed', left: 24, top: 24}}
        type="button"
      >
        Outside clicks: {outsideClicks}
      </button>
      <span data-testid="reasons" data-reasons={reasons.join(',')} hidden />
      <div style={{position: 'fixed', left: 400, top: 200}}>
        <AnchoredOverlay
          {...(controlled ? {open} : {})}
          modal="trap-focus"
          onOpenChange={(nextOpen, details) => {
            setReasons(previous => [...previous, details.reason])
            if (!nextOpen && preventOutside && details.reason === 'outside-press') {
              details.cancel()
              return
            }
            if (controlled) setOpen(nextOpen)
          }}
        >
          <AnchoredOverlay.Trigger>Open editor</AnchoredOverlay.Trigger>
          <AnchoredOverlay.Content aria-label="Editor" role="dialog">
            <label>
              Draft
              <input />
            </label>
            <AnchoredOverlay.Close>Close</AnchoredOverlay.Close>
          </AnchoredOverlay.Content>
        </AnchoredOverlay>
      </div>
    </>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Anchored overlay fixture root not found.')
  const params = new URLSearchParams(window.location.search)
  createRoot(root).render(
    <Example
      controlled={params.get('controlled') === 'true'}
      preventOutside={params.get('preventOutside') === 'true'}
    />,
  )
}

mountExample()
