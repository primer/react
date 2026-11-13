import type React from 'react'
import {InfoIcon} from '@primer/octicons-react'
import {ActionMenu, AnchoredOverlay, Tooltip} from './TriggerComposition'
import {ActionMenu as StableActionMenu} from '../../ActionMenu'
import {Tooltip as StableTooltip} from '../../TooltipV2'
import {Button, IconButton} from '../../Button'

export function elementComposition() {
  return (
    <ActionMenu renderAnchor={<Tooltip text="Choose owner" renderAnchor={<Button>Owner</Button>} />}>
      <ActionMenu.Overlay>Contents</ActionMenu.Overlay>
    </ActionMenu>
  )
}

export function directOverlayComposition() {
  return (
    <AnchoredOverlay
      open={false}
      renderAnchor={
        <Tooltip text="Details" renderAnchor={<IconButton icon={InfoIcon} aria-label="View message info" />} />
      }
    >
      Contents
    </AnchoredOverlay>
  )
}

export function stableMenuContract() {
  // @ts-expect-error renderAnchor is an experimental ActionMenu API
  return <StableActionMenu renderAnchor={<Button>Owner</Button>}>Contents</StableActionMenu>
}

export function stableTooltipContract() {
  // @ts-expect-error renderAnchor is an experimental Tooltip API
  return <StableTooltip text="Details" renderAnchor={<Button>Owner</Button>} />
}

export function experimentalTooltipSuppressionContract() {
  return <Tooltip disabled text="Details" renderAnchor={<Button>Owner</Button>} />
}

export function experimentalTooltipControlContract() {
  return (
    <Tooltip
      open={false}
      defaultOpen={false}
      onOpenChange={(open, {reason, event}) => {
        const next: boolean = open
        const cause: string = reason
        const source: Event | React.SyntheticEvent | undefined = event
        return {next, cause, source}
      }}
      popupProps={{id: 'tooltip', className: 'tooltip-bubble', popover: 'manual'}}
      id="trigger"
      text="Details"
      renderAnchor={<Button>Owner</Button>}
    />
  )
}
