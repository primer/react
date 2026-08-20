import {InfoIcon} from '@primer/octicons-react'
import {AnchoredOverlay, type AnchoredOverlayProps} from '.'
import {IconButton} from '../Button'

type RenderAnchor = NonNullable<AnchoredOverlayProps['renderAnchor']>

export function invokeRenderAnchorWithLegacyArguments(renderAnchor: RenderAnchor) {
  return renderAnchor({id: 'info'})
}

export function renderAnchorWithLegacyCallback() {
  return (
    <AnchoredOverlay open={true} renderAnchor={props => <IconButton {...props} icon={InfoIcon} aria-label="Info" />}>
      <p>GitHub</p>
    </AnchoredOverlay>
  )
}

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
