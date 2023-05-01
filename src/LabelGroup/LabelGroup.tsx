import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import VisuallyHidden from '../_VisuallyHidden'
import {AnchoredOverlay, Box, Button, IconButton, useTheme} from '..'
import {DashIcon, XIcon} from '@primer/octicons-react'
// import {getFocusableChild} from '../utils/iterate-focusable-elements'

export type LabelGroupProps = {
  /** How hidden tokens should be shown. `'inline'` shows the hidden tokens after the visible tokens. `'overlay'` shows all tokens in an overlay that appears on top of the visible tokens. */
  overflowStyle?: 'inline' | 'overlay'
  /** How many tokens to show. `'auto'` truncates the tokens to fit in the parent container. Passing a number will truncate after that number tokens. If this is undefined, tokens will never be truncated. */
  visibleTokenCount?: 'auto' | number
}

const StyledLabelGroupContainer = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  gap: ${get('space.1')};
  line-height: 1;
  max-width: 100%;
  overflow: hidden;

  &[data-overflow='inline'] {
    flex-wrap: wrap;
  }
`

// TODO: add `sx` support
// TODO: reduce re-renders
// TODO: call `getBoundingClientRect()` as little as possible
const LabelGroup: React.FC<React.PropsWithChildren<LabelGroupProps>> = ({
  children,
  visibleTokenCount,
  overflowStyle,
}) => {
  const {theme} = useTheme()
  const OVERLAY_PADDING = get('space.2')(theme)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const expandButtonRef = React.useRef<HTMLButtonElement>(null)
  const collapseButtonRef = React.useRef<HTMLButtonElement>(null)
  const [visibilityMap, setVisibilityMap] = React.useState<Record<string, boolean>>({})
  const [isOverflowShown, setIsOverflowShown] = React.useState<boolean>(false)
  const containerLeft =
    containerRef.current && visibleTokenCount === 'auto' ? containerRef.current.getBoundingClientRect().left : undefined
  const buttonClientRect =
    expandButtonRef.current && visibleTokenCount === 'auto' ? expandButtonRef.current.getBoundingClientRect() : null
  const buttonWidth = buttonClientRect ? buttonClientRect.width : 0
  const buttonRight = buttonClientRect && buttonClientRect.right
  const overlayWidth =
    containerLeft && buttonRight ? parseInt(OVERLAY_PADDING, 10) + buttonRight - containerLeft : undefined
  const hiddenItemIds = Object.keys(visibilityMap).filter(key => !visibilityMap[key])

  const openOverflowOverlay = React.useCallback(() => setIsOverflowShown(true), [setIsOverflowShown])
  const closeOverflowOverlay = React.useCallback(() => setIsOverflowShown(false), [setIsOverflowShown])
  const showAllTokensInline = React.useCallback(() => {
    // const firstHiddenIndex = hiddenItemIds[0]
    // const firstHiddenChildDOM = document.querySelector<HTMLElement>(`[data-targetid="${firstHiddenIndex}"]`)
    setVisibilityMap({})
    setIsOverflowShown(true)
    // const focusableChild = firstHiddenChildDOM ? getFocusableChild(firstHiddenChildDOM) : null

    // console.log('firstHiddenChildDOM', firstHiddenChildDOM?.firstElementChild)
    // console.log('focusableChild', focusableChild)

    // TODO: get this working
    // if (focusableChild) {
    //   focusableChild.focus()
    // } else {
    //   collapseButtonRef.current?.focus()
    // }
  }, [setVisibilityMap, setIsOverflowShown])

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const updatedEntries: Record<string, boolean> = {}

    for (const entry of entries) {
      const targetid = entry.target.getAttribute('data-index')
      if (targetid) {
        updatedEntries[targetid] = entry.isIntersecting
      }
    }

    setVisibilityMap(prev => ({
      ...prev,
      ...updatedEntries,
    }))
  }

  React.useEffect(() => {
    if (!visibleTokenCount) {
      return
    }

    if (visibleTokenCount === 'auto') {
      const observer = new IntersectionObserver(handleIntersection, {
        root: containerRef.current,
        rootMargin: `0px -${buttonWidth}px 0px 0px`,
        threshold: 1,
      })

      if (containerRef.current) {
        for (const item of containerRef.current.children) {
          if (item.getAttribute('data-index')) {
            observer.observe(item)
          }
        }
      }

      return () => observer.disconnect()
    } else {
      const containerChildren = containerRef.current?.children || []
      const updatedEntries: Record<string, boolean> = {}
      for (const child of containerChildren) {
        const targetid = child.getAttribute('data-index')
        if (targetid) {
          updatedEntries[targetid] = parseInt(targetid, 10) < visibleTokenCount
        }

        setVisibilityMap(updatedEntries)
      }
    }
  }, [buttonWidth, visibleTokenCount])

  React.useEffect(() => {
    if (isOverflowShown) {
      collapseButtonRef.current?.focus()
    } else {
      expandButtonRef.current?.focus()
    }
  }, [isOverflowShown, collapseButtonRef, expandButtonRef])

  return visibleTokenCount ? (
    <>
      <StyledLabelGroupContainer
        ref={containerRef}
        data-overflow={overflowStyle === 'inline' && isOverflowShown ? 'inline' : undefined}
      >
        {React.Children.map(children, (child, index) => {
          if (hiddenItemIds.includes(index.toString())) {
            return (
              <div
                data-index={index}
                style={{
                  order: 9999,
                  visibility: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                {child}
              </div>
            )
          } else {
            return <div data-index={index}>{child}</div>
          }
        })}
        {
          // TODO: simplify these nested ternaries
          overflowStyle === 'inline' && isOverflowShown ? (
            <IconButton
              ref={collapseButtonRef}
              onClick={closeOverflowOverlay}
              icon={() => <DashIcon size="small" />}
              size="small"
              aria-label="Show less"
              variant="invisible"
            />
          ) : overflowStyle === 'inline' && hiddenItemIds.length ? (
            // TODO: make this button a component?
            <Button ref={expandButtonRef} variant="invisible" size="small" onClick={showAllTokensInline}>
              <VisuallyHidden>Show all</VisuallyHidden>
              <span aria-hidden="true">+{hiddenItemIds.length}</span>
            </Button>
          ) : null
        }
        {overflowStyle === 'overlay' && hiddenItemIds.length ? (
          <AnchoredOverlay
            open={isOverflowShown}
            onOpen={openOverflowOverlay}
            onClose={closeOverflowOverlay}
            width="auto"
            height="auto"
            align="start"
            side="inside-right"
            anchorRef={expandButtonRef}
            anchorOffset={parseInt(OVERLAY_PADDING, 10) * -1}
            alignmentOffset={parseInt(OVERLAY_PADDING, 10) * -1}
            renderAnchor={props => (
              <Button variant="invisible" size="small" {...props} ref={expandButtonRef}>
                <VisuallyHidden>Show all</VisuallyHidden>
                <span aria-hidden="true">+{hiddenItemIds.length}</span>
              </Button>
            )}
          >
            <Box alignItems="flex-start" display="flex" width={overlayWidth} padding={OVERLAY_PADDING}>
              <Box display="flex" flexWrap="wrap" sx={{gap: 1}}>
                {children}
              </Box>
              <IconButton onClick={closeOverflowOverlay} icon={XIcon} aria-label="Close" variant="invisible" />
            </Box>
          </AnchoredOverlay>
        ) : null}
      </StyledLabelGroupContainer>
    </>
  ) : (
    <StyledLabelGroupContainer data-overflow="inline">{children}</StyledLabelGroupContainer>
  )
}

LabelGroup.defaultProps = {
  overflowStyle: 'overlay',
}

export default LabelGroup
