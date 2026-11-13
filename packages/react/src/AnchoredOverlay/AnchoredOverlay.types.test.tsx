import {InfoIcon} from '@primer/octicons-react'
import {AnchoredOverlay, type AnchoredOverlayProps} from '.'
import {IconButton} from '../Button'
import {Tooltip} from '../TooltipV2'

export function itemWithIconElements() {
  return (
    <AnchoredOverlay open={true} renderAnchor={props => <IconButton {...props} icon={InfoIcon} aria-label="Info" />}>
      <p>GitHub</p>
    </AnchoredOverlay>
  )
}

export function itemWithTooltip() {
  return (
    <AnchoredOverlay
      open={false}
      renderAnchor={(props, context) => (
        <Tooltip
          ref={context?.ref}
          text="Additional context"
          renderAnchor={tooltipProps => (
            <button {...props} {...tooltipProps} type="button">
              Info
            </button>
          )}
        />
      )}
    >
      <p>GitHub</p>
    </AnchoredOverlay>
  )
}

export function invokeExistingAnchor(renderAnchor: AnchoredOverlayProps['renderAnchor']) {
  return renderAnchor?.({'aria-expanded': false})
}
