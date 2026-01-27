import React from 'react'
import {Tooltip as BaseTooltip} from '@base-ui/react/tooltip'
import {clsx} from 'clsx'

interface PopupProps extends BaseTooltip.Popup.Props {
  sideOffset?: BaseTooltip.Positioner.Props['sideOffset']
  align?: BaseTooltip.Positioner.Props['align']
  side?: BaseTooltip.Positioner.Props['side']
  alignOffset?: BaseTooltip.Positioner.Props['alignOffset']
  collisionPadding?: BaseTooltip.Positioner.Props['collisionPadding']
}

const DEFAULT_SIDE_OFFSET = 4

function Popup({
  className,
  children,
  sideOffset,
  align,
  side,
  alignOffset,
  collisionPadding,
  ...popupProps
}: PopupProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        sideOffset={sideOffset ?? DEFAULT_SIDE_OFFSET}
        align={align}
        side={side}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className="outline-none"
      >
        <BaseTooltip.Popup
          {...popupProps}
          className={clsx(
            'flex origin-(--transform-origin) flex-col rounded-medium bg-emphasis px-2 py-1 text-body-small text-on-emphasis transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-instant:duration-0 data-starting-style:scale-90 data-starting-style:opacity-0',
            className,
          )}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

const Root = BaseTooltip.Root
const Trigger = BaseTooltip.Trigger
const Portal = BaseTooltip.Portal
const Positioner = BaseTooltip.Positioner
const Provider = BaseTooltip.Provider

export {Popup, Root, Trigger, Portal, Positioner, Provider}

export namespace Popup {
  export type Props = PopupProps
}
export namespace Positioner {
  export type Props = BaseTooltip.Positioner.Props
}
