import {omit} from 'lodash'
import React from 'react'
import useLayoutEffect from './useIsomorphicLayoutEffect'

/** createSlots is a factory that can create a
 *  typesafe Slots + Slot pair to use in a component definition
 *  For example: ActionList.Item uses createSlots to get a Slots wrapper
 *  + Slot component that is used by LeadingVisual, Description
 */
const createSlots = <SlotNames extends string>() => {
  type Store = Partial<Record<SlotNames, React.ReactNode>>

  type StoreAction =
    | {type: 'register'; name: SlotNames; children: React.ReactNode}
    | {type: 'unregister'; name: SlotNames}

  const storeReducer = (slots: Store, action: StoreAction): Store => {
    switch (action.type) {
      case 'register':
        return {...slots, [action.name]: action.children}
      case 'unregister':
        return omit(slots, action.name) as Store
    }
  }

  const SlotsContext = React.createContext<React.Dispatch<StoreAction> | null>(null)

  /**
   * Returns a provider component that defines the context area inside which the slots will be detected,
   * and an object containing the slot contents.
   *
   * The provider should only be mounted once per component instance, but the `useSlots` hook
   * may be used in multiple places to get the slots content.
   */
  const useSlots = () => {
    const [slots, dispatchSlots] = React.useReducer(storeReducer, {})

    // Any context provider should always be static or memoized to avoid infinite render loops
    const SlotsProvider: React.FC<{children?: React.ReactNode}> = React.useCallback(
      ({children}) => <SlotsContext.Provider value={dispatchSlots}>{children}</SlotsContext.Provider>,
      []
    )

    return {slots, SlotsProvider}
  }

  /**
   * Defines a slot. The children of this slot will not be rendered here - instead they will be
   * rendered where the slot content is accessed and mounted with the `useSlots` hook.
   */
  const Slot: React.FC<{
    name: SlotNames
    children: React.ReactNode
  }> = React.memo(({name, children}) => {
    const dispatchSlots = React.useContext(SlotsContext)

    useLayoutEffect(() => dispatchSlots?.({type: 'register', name, children}), [name, children, dispatchSlots])

    // We don't need to cleanup on every render, since registering a slot that is already
    // registered will just overwrite the existing slot value. But we do need to cleanup on unmount
    useLayoutEffect(() => () => dispatchSlots?.({type: 'unregister', name}), [name, dispatchSlots])

    return null
  })

  return {Slot, useSlots}
}

export default createSlots
