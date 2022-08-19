import React from 'react'
import useLayoutEffect from './useIsomorphicLayoutEffect'

/** createSlots is a factory that can create a
 *  typesafe Slots + Slot pair to use in a component definition
 *  For example: ActionList.Item uses createSlots to get a Slots wrapper
 *  + Slot component that is used by LeadingVisual, Description
 */
const createSlots = <SlotNames extends string>(_slotNames: SlotNames[]) => {
  type Slots = {
    [key in SlotNames]?: React.ReactNode
  }

  type ContextProps = {
    registerSlot: (name: SlotNames, contents: React.ReactNode) => void
    unregisterSlot: (name: SlotNames) => void
  }
  const SlotsContext = React.createContext<ContextProps>({
    registerSlot: () => null,
    unregisterSlot: () => null
  })

  const Slots: React.FC<{
    children: (slots: Slots) => React.ReactNode
  }> = ({children}) => {
    const [slots, setSlots] = React.useState<Slots>({})

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

    return <SlotsContext.Provider value={{registerSlot, unregisterSlot}}>{children(slots)}</SlotsContext.Provider>
  }

  const Slot: React.FC<{
    name: SlotNames
    children: React.ReactNode
  }> = ({name, children}) => {
    const {registerSlot, unregisterSlot} = React.useContext(SlotsContext)

    useLayoutEffect(() => {
      registerSlot(name, children)
      return () => unregisterSlot(name)
    }, [name, children, registerSlot, unregisterSlot])

    return null
  }

  return {Slots, Slot}
}

export default createSlots
