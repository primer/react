import React from 'react'
import {useForceUpdate} from './use-force-update'

/** Create useSlots is a factory that can create a typed
 *  useSlots + Slot component combination for a component
 *  For example: ActionList uses createUseSlots to get a
 *  useSlot hook that can be used inside each Item
 */
export const createUseSlots = <SlotName extends string>(slotNames: SlotName[]) => {
  type ContextType = {
    registerSlot: (name: SlotName, contents: React.ReactNode) => void
    unregisterSlot: (name: SlotName) => void
  }
  const SlotsContext = React.createContext<ContextType>({registerSlot: () => null, unregisterSlot: () => null})

  const useSlots = () => {
    // Double render strategy
    // when the effect is run for the first time,
    // all the children have mounted = registed themself in slot.
    // we re-render the Item component to re-render with filled slots.
    const rerenderWithSlots = useForceUpdate()
    const [isMounted, setIsMounted] = React.useState(false)

    const slotsDefinition: {[key in SlotName]?: JSX.Element | null} = {}
    slotNames.map(name => {
      slotsDefinition[name] = null
    })
    const slotsRef = React.useRef<{[key in SlotName]?: React.ReactNode}>(slotsDefinition)

    // fires once after all the slots are registered
    React.useLayoutEffect(() => {
      setIsMounted(true)
      rerenderWithSlots()
    }, [rerenderWithSlots])

    const registerSlot = React.useCallback(
      (name: SlotName, contents: React.ReactNode) => {
        slotsRef.current[name] = contents

        // if something has changed?

        // don't render until the component mounts = all slots are registered
        if (isMounted) rerenderWithSlots()
      },
      [isMounted, rerenderWithSlots]
    )

    // Item.* can be removed from the DOM,
    // we need to unregister them from the slot
    const unregisterSlot = React.useCallback(
      (name: SlotName) => {
        slotsRef.current[name] = null
        rerenderWithSlots()
      },
      [rerenderWithSlots]
    )

    const SlotsProvider: React.FC = ({children}) => {
      return <SlotsContext.Provider value={{registerSlot, unregisterSlot}}>{children}</SlotsContext.Provider>
    }

    return {slots: slotsRef.current, SlotsProvider}
  }

  const Slot: React.FC<{name: SlotName}> = ({name, children}) => {
    const {registerSlot, unregisterSlot} = React.useContext(SlotsContext)

    React.useLayoutEffect(() => {
      registerSlot(name, children)
      return () => unregisterSlot(name)
      // registerSlot and unregisterSlot are created by the ItemContext,
      // we can safely ignore them because they will not change between renders
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, children])

    return null
  }

  return {useSlots, Slot}
}
