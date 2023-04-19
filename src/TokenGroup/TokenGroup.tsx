import React, {useEffect} from 'react'
import {useResizeObserver, ResizeObserverEntry} from '../hooks/useResizeObserver'
import styled from 'styled-components'
import Box from '../Box'

type TokenGroupProps = {
  visibleTokenCount?: number | 'auto'
  width?: number
}

const getValidChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}

const StyledActionsContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 8px;
  align-items: center;
  overflow: hidden;
  outline: 1px solid black;
`

const TokenGroup: React.FC<React.PropsWithChildren<TokenGroupProps>> = ({children, visibleTokenCount, width}) => {
  const [menuActions, setMenuActions] = React.useState([])
  const [inlineActions, setInlineActions] = React.useState(getValidChildren(children))
  const [isOverflowing, setIsOverflowing] = React.useState(false)
  const actionsRef = React.useRef<HTMLDivElement>(null)

  const moveFromInline = () => {
    const copyOfInlineActions = [...inlineActions]
    // get the last element of the inline actions
    const lastActionButton = copyOfInlineActions[copyOfInlineActions.length - 1]
    console.log('lastActionButton', lastActionButton)

    if (lastActionButton !== undefined) {
      setMenuActions([...menuActions, lastActionButton])
      const inlineActions = copyOfInlineActions.slice(0, -1)
      setInlineActions(inlineActions)

      // if (isOverflowing) {
      //   moveFromInline()
      // }
    }

    console.log('the new action and inline buttons', inlineActions, menuActions)
  }

  // React.useLayoutEffect(() => {
  //   console.log('actionsRef is rendered')

  //   handleOverflow()
  // }, [actionsRef])

  // TODO: figure out if we can do this without querying DOM node size (which triggers a reflow)
  // It would be better if we could use `resizeObserverEntries` to check `scrollWidth` and `offsetWidth`
  // const isOverflowing = () =>
  //   actionsRef.current?.scrollWidth && actionsRef.current.scrollWidth > actionsRef.current.offsetWidth

  const handleOverflow = () => {
    setIsOverflowing(actionsRef.current?.scrollWidth && actionsRef.current.scrollWidth > actionsRef.current.offsetWidth)
    console.log('isOverflowing inside handleOverflow', isOverflowing)

    if (isOverflowing) {
      moveFromInline()
    } else {
      // do the opposite of the above
    }
  }

  useResizeObserver(handleOverflow, [])

  console.log('rerender', inlineActions)

  return (
    <>
      <StyledActionsContainer ref={actionsRef}>{inlineActions}</StyledActionsContainer>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'baseline'}}>{menuActions}</Box>
    </>
  )
}

/* Using IntersectionObserver instead */
// const TokenGroup: React.FC<React.PropsWithChildren<TokenGroupProps>> = ({children, width}) => {
//   const navRef = React.useRef(null)
//   const [visibilityMap, setVisibilityMap] = React.useState({})
//   const handleIntersection = entries => {
//     const updatedEntries = {}
//     for (const entry of entries) {
//       const targetid = entry.target.dataset.targetid
//       updatedEntries[targetid] = entry.isIntersecting
//     }

//     setVisibilityMap(prev => ({
//       ...prev,
//       ...updatedEntries,
//     }))
//   }

//   React.useEffect(() => {
//     const observer = new IntersectionObserver(handleIntersection, {
//       root: navRef.current,
//       threshold: 1,
//     })

//     // We are addting observers to child elements of the container div
//     // with ref as navRef. Notice that we are adding observers
//     // only if we have the data attribute observerid on the child elemeent
//     for (const item of navRef.current.children) {
//       if (item.dataset.targetid) {
//         observer.observe(item)
//       }
//     }

//     return () => observer.disconnect()
//   }, [])
//   const hiddenItemIds = Object.keys(visibilityMap).filter(key => !visibilityMap[key])
//   const hiddenItems = React.Children.toArray(children).filter(child => {
//     return hiddenItemIds.includes(child.props['data-targetid'])
//   })
//   const visibleItems = React.Children.toArray(children).filter(child => {
//     return !hiddenItemIds.includes(child.props['data-targetid'])
//   })
//   console.log('hiddenItems', hiddenItems)
//   console.log('visibleItems', visibleItems)
//   return (
//     <>
//       <StyledActionsContainer ref={navRef} style={{maxWidth: `${width}px`}}>
//         {children}
//       </StyledActionsContainer>
//     </>
//   )
// }

export default TokenGroup
