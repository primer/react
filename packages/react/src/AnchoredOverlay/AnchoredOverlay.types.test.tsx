import {InfoIcon} from '@primer/octicons-react'
import {AnchoredOverlay, type AnchoredOverlayProps} from '.'
import {IconButton} from '../Button'
import {
  AnchoredOverlay as ExperimentalAnchoredOverlay,
  Tooltip,
} from '../experimental/TriggerComposition/TriggerComposition'

export function itemWithIconElements() {
  return (
    <AnchoredOverlay open={true} renderAnchor={props => <IconButton {...props} icon={InfoIcon} aria-label="Info" />}>
      <p>GitHub</p>
    </AnchoredOverlay>
  )
}

export function itemWithTooltip() {
  return (
    <ExperimentalAnchoredOverlay
      open={false}
      renderAnchor={<Tooltip text="Additional context" renderAnchor={<button type="button">Info</button>} />}
    >
      <p>GitHub</p>
    </ExperimentalAnchoredOverlay>
  )
}

export function invokeExistingAnchor(renderAnchor: AnchoredOverlayProps['renderAnchor']) {
  return renderAnchor?.({'aria-expanded': false})
}
