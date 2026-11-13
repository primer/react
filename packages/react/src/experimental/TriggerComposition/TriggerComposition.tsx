import React from 'react'
import {ActionMenu as StableActionMenu, ActionMenuImpl} from '../../ActionMenu/ActionMenu'
import type {ActionMenuProps as StableActionMenuProps} from '../../ActionMenu/ActionMenu'
import {AnchoredOverlay as StableAnchoredOverlay} from '../../AnchoredOverlay'
import type {AnchoredOverlayProps as StableAnchoredOverlayProps} from '../../AnchoredOverlay'
import {Tooltip as StableTooltip, TooltipImpl} from '../../TooltipV2/Tooltip'
import type {TooltipProps as StableTooltipProps} from '../../TooltipV2/Tooltip'
import {useProvidedRefOrCreate} from '../../hooks/useProvidedRefOrCreate'
import {RenderAnchor, type AnchorRenderer} from '../../internal/components/RenderAnchor'
import {mergeAnchorProps} from '../../internal/utils/mergeAnchorProps'
import {invariant} from '../../utils/invariant'
import {asSlot} from '../../utils/as-slot'
import type {SlotMarker} from '../../utils/types'

export type ActionMenuProps = StableActionMenuProps & {renderAnchor?: AnchorRenderer}

function Menu({renderAnchor, ...props}: ActionMenuProps) {
  return (
    <ActionMenuImpl
      {...props}
      renderAnchor={
        renderAnchor ? anchorProps => <RenderAnchor render={renderAnchor} props={anchorProps} /> : undefined
      }
    />
  )
}

export const ActionMenu = Object.assign(Menu, {
  Button: StableActionMenu.Button,
  Anchor: StableActionMenu.Anchor,
  Overlay: StableActionMenu.Overlay,
  Divider: StableActionMenu.Divider,
})

export type AnchoredOverlayProps =
  | StableAnchoredOverlayProps
  | (Omit<StableAnchoredOverlayProps, 'renderAnchor'> & {renderAnchor: React.ReactElement})

export function AnchoredOverlay(props: React.PropsWithChildren<AnchoredOverlayProps>) {
  const anchorRef = useProvidedRefOrCreate(props.anchorRef)
  if (props.renderAnchor === null) {
    return <StableAnchoredOverlay {...props} />
  }
  if (typeof props.renderAnchor === 'function') {
    return <StableAnchoredOverlay {...props} renderAnchor={props.renderAnchor} />
  }
  const {renderAnchor} = props
  return (
    <StableAnchoredOverlay
      {...props}
      anchorRef={anchorRef}
      renderAnchor={anchorProps => <RenderAnchor render={renderAnchor} props={{...anchorProps, ref: anchorRef}} />}
    />
  )
}

export type TooltipProps = Omit<StableTooltipProps, 'disabled'> & {renderAnchor?: AnchorRenderer}

export const Tooltip: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TooltipProps> & React.RefAttributes<HTMLElement>
> &
  SlotMarker = React.forwardRef<HTMLElement, TooltipProps>(
  (
    {renderAnchor, children, text, type, direction, delay, keybindingHint, _privateDisableTooltip, ...anchorProps},
    ref,
  ) => {
    invariant(!renderAnchor || children == null, 'Pass either `children` or `renderAnchor` to `Tooltip`, not both.')
    const tooltipProps = {text, type, direction, delay, keybindingHint, _privateDisableTooltip}
    if (!renderAnchor) {
      return (
        <StableTooltip {...tooltipProps} {...anchorProps} ref={ref}>
          {children}
        </StableTooltip>
      )
    }
    return (
      <TooltipImpl
        {...tooltipProps}
        ref={ref}
        renderAnchor={tooltipAnchorProps => (
          <RenderAnchor render={renderAnchor} props={mergeAnchorProps(tooltipAnchorProps, anchorProps)} />
        )}
      />
    )
  },
)
Tooltip.displayName = 'Tooltip'
asSlot(Tooltip, StableTooltip)
