import React from 'react'
import {useForceUpdate} from './use-force-update'

const createSlots = <SlotNames extends string>(slotNames: SlotNames[]) => {
  type ContextProps = {
    registerSlot: (name: SlotNames, contents: React.ReactNode) => void
    unregisterSlot: (name: SlotNames) => void
  }
  const SlotsContext = React.createContext<ContextProps>({registerSlot: () => null, unregisterSlot: () => null})

  type Slots = {
    [key in SlotNames]?: React.ReactNode
  }

  const Slots: React.FC<{children: (slots: Slots) => React.ReactNode}> = ({children}) => {
    // Double render strategy
    // when the effect is run for the first time,
    // all the children have mounted = registed themself in slot.
    // we re-render the Item component to re-render with filled slots.
    const rerenderWithSlots = useForceUpdate()
    const [isMounted, setIsMounted] = React.useState(false)

    // fires after all the layoutEffect in children
    React.useLayoutEffect(() => {
      setIsMounted(true)
      rerenderWithSlots()
    }, [rerenderWithSlots])

    const slotsDefinition: Slots = {}
    slotNames.map(name => {
      slotsDefinition[name] = null
    })

    const slotsRef = React.useRef<Slots>(slotsDefinition)
    const slots = slotsRef.current

    const registerSlot = React.useCallback(
      (name: keyof typeof slots, contents: React.ReactNode) => {
        slotsRef.current[name] = contents

        // don't render until the component mounts = all slots are registered
        if (isMounted) rerenderWithSlots()
      },
      [isMounted, rerenderWithSlots]
    )

    // Item.* can be removed from the DOM,
    // we need to unregister them from the slot
    const unregisterSlot = React.useCallback(
      (name: keyof typeof slots) => {
        slotsRef.current[name] = null
        rerenderWithSlots()
      },
      [rerenderWithSlots]
    )

    return <SlotsContext.Provider value={{registerSlot, unregisterSlot}}>{children(slots)}</SlotsContext.Provider>
  }

  const Slot: React.FC<{name: SlotNames}> = ({name, children}) => {
    const {registerSlot, unregisterSlot} = React.useContext(SlotsContext)

    React.useLayoutEffect(() => {
      registerSlot(name, children)
      return () => unregisterSlot(name)
      // registerSlot and unregisterSlot are created by the SlotContext,
      // we can safely ignore them because they will not change between renders
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, children])

    return null
  }

  return {Slots, Slot}
}

export default createSlots
