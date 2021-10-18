import React from 'react'
import {useForceUpdate} from '../utils/use-force-update'

type ContextProps = {
  registerSlot: (name: string, contents: JSX.Element) => void
  unregisterSlot: (name: string) => void
}
export const ItemContext = React.createContext<ContextProps>({registerSlot: () => null, unregisterSlot: () => null})

type ValuesOf<T extends string[]> = T[number]

export const useSlots = (slotNames: string[]) => {
  // Double render strategy
  // when the effect is run for the first time,
  // all the children have mounted = registed themself in slot.
  // we re-render the Item component to re-render with filled slots.
  const rerenderWithSlots = useForceUpdate()
  const [isMounted, setIsMounted] = React.useState(false)

  type SlotName = ValuesOf<typeof slotNames>

  const slotsDefinition: {[key in SlotName]: JSX.Element | null} = {}

  slotNames.map(name => {
    slotsDefinition[name] = null
  })
  const slotsRef = React.useRef<{[key in SlotName]: JSX.Element | null}>(slotsDefinition)

  // fires once after all the slots are registered
  React.useLayoutEffect(() => {
    setIsMounted(true)
    rerenderWithSlots()
  }, [rerenderWithSlots])

  const registerSlot = React.useCallback(
    (name: SlotName, contents: JSX.Element) => {
      slotsRef.current[name] = contents

      // if something has changed?

      // don't render until the component mounts = all slots are registered
      // if (isMounted) rerenderWithSlots()
    },
    [isMounted, rerenderWithSlots]
  )

  // Item.* can be removed from the DOM,
  // we need to unregister them from the slot
  const unregisterSlot = React.useCallback((name: SlotName) => {
    slotsRef.current[name] = null
    // rerenderWithSlots()
  }, [])

  const Provider: React.FC = ({children}) => {
    return <ItemContext.Provider value={{registerSlot, unregisterSlot}}>{children}</ItemContext.Provider>
  }

  return {slots: slotsRef.current, Provider}
}

export const Slot: React.FC<{name: string}> = ({name, children}) => {
  const {registerSlot, unregisterSlot} = React.useContext(ItemContext)

  React.useLayoutEffect(() => {
    registerSlot(name, children)
    return () => unregisterSlot(name)
    // registerSlot and unregisterSlot are created by the ItemContext,
    // we can safely ignore them because they will not change between renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, children])

  return null
}
