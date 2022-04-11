import React, {useCallback} from 'react'

type Overflow = 'auto' | 'menu' | 'scroll'

const getMobile = () => false
const isMobile = getMobile()
const getCalculatedOverflow = (overflow: Overflow) => {
  if (overflow === 'auto') {
    return isMobile ? 'scroll' : 'menu'
  }
  return overflow
}

const getItems = (ref, children) => {
  // get width of container
  // get width of each item
  // calc how many items can fit in container
  // send those as items
  // send rest as overflowItems
  const items = children
  const overflowItems = children
  return {
    items,
    overflowItems
  }
}
const getActions = overflowItems => {
  //convert overflow items into dropdown menu component
  return overflowItems
}
const useResponsiveWrapper = ({
  children,
  overflow,
  ref
}: {
  children: React.ReactNode
  overflow: Overflow
  ref: React.RefObject<HTMLElement>
}) => {
  const calcOverflow = getCalculatedOverflow(overflow)
  const {items, overflowItems} = useCallback(
    () => (calcOverflow === 'menu' ? getItems(ref, children) : children),
    [children, ref]
  )
  const Actions = getActions(overflowItems)
  return {items, Actions}
}

const ResponsiveWrapper = ({
  children,
  overflow = 'auto'
}: {
  children,
  overflow
}) => {
  return <>{children}</>
}

// type ResponsiveProps = {
//   items: React.ReactNode
//   Actions?: React.ComponentType
// }

// export type {ResponsiveProps}

export default useResponsiveWrapper
