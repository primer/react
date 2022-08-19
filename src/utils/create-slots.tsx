import {omit} from 'lodash'
import React from 'react'
import useLayoutEffect from './useIsomorphicLayoutEffect'

/** createSlots is a factory that can create a
 *  typesafe Slots + Slot pair to use in a component definition
 *  For example: ActionList.Item uses createSlots to get a Slots wrapper
 *  + Slot component that is used by LeadingVisual, Description
 */
const createSlots = <SlotNames extends string>(_slotNames: SlotNames[]) => {
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

  const Slots: React.FC<{
    children: (slots: Store) => React.ReactNode
  }> = ({children}) => {
    const [slots, dispatchSlots] = React.useReducer(storeReducer, {})

    return <SlotsContext.Provider value={dispatchSlots}>{children(slots)}</SlotsContext.Provider>
  }

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

  return {Slots, Slot}
}

export default createSlots
