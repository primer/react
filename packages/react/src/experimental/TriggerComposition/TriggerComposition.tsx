import React from 'react'
import {ActionMenu as StableActionMenu, ActionMenuImpl} from '../../ActionMenu/ActionMenu'
import type {ActionMenuProps as StableActionMenuProps} from '../../ActionMenu/ActionMenu'
import {AnchoredOverlay as StableAnchoredOverlay} from '../../AnchoredOverlay'
import type {AnchoredOverlayProps as StableAnchoredOverlayProps} from '../../AnchoredOverlay'
import {Tooltip as StableTooltip, TooltipImpl} from '../../TooltipV2/Tooltip'
import type {TooltipProps as StableTooltipProps, TooltipOpenChangeDetails} from '../../TooltipV2/Tooltip'
import {useControllableState} from '../../hooks/useControllableState'
import {useProvidedRefOrCreate} from '../../hooks/useProvidedRefOrCreate'
import {RenderAnchor, type AnchorRenderer} from '../../internal/components/RenderAnchor'
import {mergeAnchorProps, type AnchorProps} from '../../internal/utils/mergeAnchorProps'
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

export type TooltipProps = Omit<StableTooltipProps, 'disabled'> & {
  /** Suppresses the tooltip, not its trigger. Either suppression prop being true wins. */
  disabled?: boolean
  renderAnchor?: AnchorRenderer
  /** HTML props for the tooltip bubble, separate from the trigger's HTML props. */
  popupProps?: Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {popover?: 'auto' | 'manual' | ''}
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: TooltipOpenChangeDetails) => void
}

export type {TooltipOpenChangeDetails}

export const Tooltip: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TooltipProps> & React.RefAttributes<HTMLElement>
> &
  SlotMarker = React.forwardRef<HTMLElement, TooltipProps>(
  (
    {
      renderAnchor,
      children,
      text,
      type,
      direction,
      delay,
      keybindingHint,
      disabled = false,
      _privateDisableTooltip,
      popupProps,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      ...anchorProps
    },
    ref,
  ) => {
    invariant(!renderAnchor || children == null, 'Pass either `children` or `renderAnchor` to `Tooltip`, not both.')
    const [open, setOpen] = useControllableState({
      name: 'Tooltip',
      value: controlledOpen,
      defaultValue: defaultOpen,
    })
    const [controlled] = React.useState(controlledOpen !== undefined)
    const visibility = React.useMemo(
      () => ({
        open,
        controlled,
        onOpenChange(next: boolean, details: TooltipOpenChangeDetails) {
          if (open === next) return
          setOpen(next)
          onOpenChange?.(next, details)
        },
      }),
      [open, controlled, setOpen, onOpenChange],
    )
    const trigger = renderAnchor ?? React.Children.only(children)
    if (!React.isValidElement<AnchorProps>(trigger) && typeof trigger !== 'function') {
      throw new Error('Tooltip requires a single trigger.')
    }
    return (
      <TooltipImpl
        {...popupProps}
        text={text}
        type={type}
        direction={direction}
        delay={delay}
        keybindingHint={keybindingHint}
        _privateDisableTooltip={disabled || _privateDisableTooltip}
        visibility={visibility}
        ref={ref}
        renderAnchor={tooltipAnchorProps => (
          <RenderAnchor render={trigger} props={mergeAnchorProps(tooltipAnchorProps, anchorProps)} />
        )}
      />
    )
  },
)
Tooltip.displayName = 'Tooltip'
asSlot(Tooltip, StableTooltip)
