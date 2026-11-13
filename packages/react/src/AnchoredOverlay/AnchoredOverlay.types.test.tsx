import {InfoIcon} from '@primer/octicons-react'
import {AnchoredOverlay} from '.'
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
      renderAnchor={(props, {ref}) => (
        <Tooltip
          ref={ref}
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
