import React, {useLayoutEffect} from 'react'

type Overflow = 'auto' | 'menu' | 'scroll'

function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}
const useResponsiveWrapper = ({
  children,
  overflow,
  ref,
  callback,
  childSize
}: {
  children: React.ReactNode
  overflow: Overflow
  ref: React.ForwardedRef<HTMLElement>
  callback: () => void
}) => {
  useLayoutEffect(() => {
    const domRect = ref?.current.getBoundingClientRect()
    const width = domRect?.width || 0
    const childArray = getValidChildren(children)
    const childArraySize = childArray.length
    // do this only for overflow
    const numberOfChildrenPossible =
      childArraySize * childSize.width > width ? childArraySize : Math.abs(width / childSize.width) / 2
    const items = []
    const actions = []
    childArray.forEach((child, index) => {
      if (index < numberOfChildrenPossible) {
        items.push(child)
      } else {
        actions.push(child)
      }
    })
    callback({items, actions})
  })
}

type ResponsiveProps = {
  items: React.ReactNode
  actions?: React.ReactNode
}

export type {ResponsiveProps}

export default useResponsiveWrapper
