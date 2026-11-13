import React from 'react'
import {createRoot} from 'react-dom/client'
import {AnchoredOverlay} from '../src/components/AnchoredOverlay'
import {Button} from '../src/components/Button'

export function InformationalOverlay({hasLink}: {hasLink: boolean}) {
  return (
    <>
      <AnchoredOverlay>
        <AnchoredOverlay.Trigger render={<Button>About billing credits</Button>} />
        <AnchoredOverlay.Content aria-label="Billing credits information" role="dialog">
          <p>Billing credits apply to eligible usage.</p>
          {hasLink && <a href="#billing-help">Learn more</a>}
        </AnchoredOverlay.Content>
      </AnchoredOverlay>
      <Button>Next control</Button>
    </>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Expected the informational overlay fixture root')
  const hasLink = new URLSearchParams(window.location.search).get('link') === 'true'
  createRoot(root).render(<InformationalOverlay hasLink={hasLink} />)
}

mountFixture()
