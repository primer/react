import {InfoIcon} from '@primer/octicons-react'
import {AnchoredOverlay} from '.'
import {IconButton} from '../Button'

export function itemWithIconElements() {
  return (
    <AnchoredOverlay
      open={true}
      renderAnchor={(props, anchorRef) => <IconButton {...props} ref={anchorRef} icon={InfoIcon} aria-label="Info" />}
    >
      <p>GitHub</p>
    </AnchoredOverlay>
  )
}
