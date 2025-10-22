import {InfoIcon} from '@primer/octicons-react'
import {AnchoredOverlay, IconButton} from '..'

export function itemWithIconElements() {
  return (
    <AnchoredOverlay open={true} renderAnchor={props => <IconButton {...props} icon={InfoIcon} aria-label="Info" />}>
      <p>GitHub</p>
    </AnchoredOverlay>
  )
}
