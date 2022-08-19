import React from 'react'
import useLayoutEffect from './useIsomorphicLayoutEffect'

/** createSlots is a factory that can create a
 *  typesafe Slots + Slot pair to use in a component definition
 *  For example: ActionList.Item uses createSlots to get a Slots wrapper
 *  + Slot component that is used by LeadingVisual, Description
 */
const createSlots = <SlotNames extends string>(_slotNames: SlotNames[]) => {
  type SlotsStore = Partial<Record<SlotNames, React.ReactNode>>

  type SlotsContext = {
    registerSlot: (name: SlotNames, contents: React.ReactNode) => void
    unregisterSlot: (name: SlotNames) => void
  }

  const SlotsContext = React.createContext<SlotsContext>({
    registerSlot: () => null,
    unregisterSlot: () => null
  })

  const Slots: React.FC<{
    children: (slots: SlotsStore) => React.ReactNode
  }> = ({children}) => {
    const [slots, setSlots] = React.useState<SlotsStore>({})

    const registerSlot = React.useCallback(
      (name: SlotNames, contents: React.ReactNode) => setSlots(prevSlots => ({...prevSlots, [name]: contents})),
      []
    )

    // Slot can be removed from the tree as well,
    // we need to unregister them from the slot
    const unregisterSlot = React.useCallback(
      (name: SlotNames) =>
        setSlots(prevSlots => {
          const newSlots = {...prevSlots}
          delete newSlots[name]
          return newSlots
        }),
      []
    )

    const context = React.useMemo(() => ({registerSlot, unregisterSlot}), [registerSlot, unregisterSlot])

    return <SlotsContext.Provider value={context}>{children(slots)}</SlotsContext.Provider>
  }

  const Slot: React.FC<{
    name: SlotNames
    children: React.ReactNode
  }> = React.memo(({name, children}) => {
    const {registerSlot, unregisterSlot} = React.useContext(SlotsContext)

    useLayoutEffect(() => registerSlot(name, children), [name, children, registerSlot])

    // We don't need to cleanup on every render, since registering a slot that is already
    // registered will just overwrite the existing slot value. But we do need to cleanup on unmount
    useLayoutEffect(() => () => unregisterSlot(name), [name, unregisterSlot])

    return null
  })

  return {Slots, Slot}
}

export default createSlots
