/**
 * TODO:
 * rename onClose to afterOnSelect to be more generic?
 */

import Button, {ButtonProps} from './Button'
import React, {useCallback, useMemo} from 'react'
import {AnchoredOverlay} from './AnchoredOverlay'
import {useProvidedStateOrCreate} from './hooks/useProvidedStateOrCreate'
import {OverlayProps} from './Overlay'
import {useProvidedRefOrCreate} from './hooks'
import {AnchoredOverlayWrapperAnchorProps} from './AnchoredOverlay/AnchoredOverlay'
import createSlots from './utils/create-slots'

type ActionMenuBaseProps = {
  /**
   * children - use an ActionList
   */
  children: React.ReactNode

  /**
   * Content that is passed into the renderAnchor component, which is a button by default.
   */
  anchorContent?: React.ReactNode

  /**
   * If defined, will control the open/closed state of the overlay. Must be used in conjuction with `setOpen`.
   */
  open?: boolean

  /**
   * If defined, will control the open/closed state of the overlay. Must be used in conjuction with `open`.
   */
  setOpen?: (s: boolean) => void

  /**
   * Props to be spread on the internal `Overlay` component.
   */
  overlayProps?: Partial<OverlayProps>
}

export type ActionMenuProps = ActionMenuBaseProps & AnchoredOverlayWrapperAnchorProps

const {Slots, Slot} = createSlots(['Anchor'])

/** we pass onClose down in the context for ActionList.Item */
type ContextProps = {listRole?: string; itemRole?: string; onClose?: () => void}
export const MenuContext = React.createContext<ContextProps>({})

const ActionMenuBase = ({
  anchorRef: externalAnchorRef,
  open,
  setOpen,
  overlayProps,
  children
}: ActionMenuProps): JSX.Element => {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, setOpen, false)
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const onOpen = useCallback(() => setCombinedOpenState(true), [setCombinedOpenState])
  const onClose = useCallback(() => setCombinedOpenState(false), [setCombinedOpenState])

  return (
    <Slots>
      {slots => (
        <AnchoredOverlay
          renderAnchor={anchorProps => <Button {...anchorProps}>{slots.Anchor}</Button>}
          anchorRef={anchorRef}
          open={combinedOpenState}
          onOpen={onOpen}
          onClose={onClose}
          overlayProps={overlayProps}
        >
          <MenuContext.Provider value={{listRole: 'menu', itemRole: 'menuitem', onClose}}>
            {children}
          </MenuContext.Provider>
        </AnchoredOverlay>
      )}
    </Slots>
  )
}

ActionMenuBase.displayName = 'ActionMenu'

const Anchor = props => (
  <Slot name="Anchor">
    <Button {...props} />
  </Slot>
)

export const ActionMenu = Object.assign(ActionMenuBase, {Anchor})
