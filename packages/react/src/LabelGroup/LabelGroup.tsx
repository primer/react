import React from 'react'
import styled from 'styled-components'
import {XIcon} from '@primer/octicons-react'
import {getFocusableChild} from '@primer/behaviors/utils'
import {get} from '../constants'
import VisuallyHidden from '../_VisuallyHidden'
import {AnchoredOverlay} from '../AnchoredOverlay'
import Box from '../Box'
import {Button, IconButton} from '../Button'
import {useTheme} from '../ThemeProvider'
import type {SxProp} from '../sx'
import sx from '../sx'

export type LabelGroupProps = {
  /** How hidden tokens should be shown. `'inline'` shows the hidden tokens after the visible tokens. `'overlay'` shows all tokens in an overlay that appears on top of the visible tokens. */
  overflowStyle?: 'inline' | 'overlay'
  /** How many tokens to show. `'auto'` truncates the tokens to fit in the parent container. Passing a number will truncate after that number tokens. If this is undefined, tokens will never be truncated. */
  visibleChildCount?: 'auto' | number
} & SxProp

const StyledLabelGroupContainer = styled.div<SxProp>`
  display: flex;
  flex-wrap: nowrap;
  gap: ${get('space.1')};
  line-height: 1;
  max-width: 100%;
  overflow: hidden;

  &[data-overflow='inline'] {
    flex-wrap: wrap;
  }

  ${sx};
`

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;

  /* This min-height matches the height of the expand/collapse button.
     Without it, the labels/tokens will do a slight layout shift when expanded.
     This is because the height of the first row will match the token sizes,
     but the height of the second row will be the height of the collapse button.
  */
  min-height: 28px;

  &.ItemWrapper--hidden {
    order: 9999;
    pointer-events: none;
    visibility: hidden;
  }
`

// Calculates the width of the overlay to cover the labels/tokens and the expand button.
const getOverlayWidth = (
  buttonClientRect: DOMRect,
  containerRef: React.RefObject<HTMLDivElement>,
  overlayPaddingPx: number,
) => overlayPaddingPx + buttonClientRect.right - (containerRef.current?.getBoundingClientRect().left || 0)

const InlineToggle: React.FC<{
  collapseButtonRef: React.RefObject<HTMLButtonElement>
  collapseInlineExpandedChildren: () => void
  expandButtonRef: React.RefCallback<HTMLButtonElement>
  hiddenItemIds: string[]
  isOverflowShown: boolean
  showAllTokensInline: () => void
  totalLength: number
}> = ({
  collapseButtonRef,
  collapseInlineExpandedChildren,
  expandButtonRef,
  hiddenItemIds,
  isOverflowShown,
  showAllTokensInline,
  totalLength,
}) =>
  isOverflowShown ? (
    <Button ref={collapseButtonRef} onClick={collapseInlineExpandedChildren} size="small" variant="invisible">
      Show less
    </Button>
  ) : hiddenItemIds.length ? (
    <Button ref={expandButtonRef} variant="invisible" size="small" onClick={showAllTokensInline}>
      <VisuallyHidden>Show all {totalLength}</VisuallyHidden>
      <span aria-hidden="true">+{hiddenItemIds.length}</span>
    </Button>
  ) : null

const OverlayToggle: React.FC<
  React.PropsWithChildren<{
    closeOverflowOverlay: () => void
    expandButtonRef: React.RefCallback<HTMLButtonElement>
    hiddenItemIds: string[]
    isOverflowShown: boolean
    openOverflowOverlay: () => void
    overlayPaddingPx: number
    overlayWidth?: number
    totalLength: number
  }>
> = ({
  children,
  closeOverflowOverlay,
  expandButtonRef,
  hiddenItemIds,
  isOverflowShown,
  openOverflowOverlay,
  overlayPaddingPx,
  overlayWidth,
  totalLength,
}) =>
  hiddenItemIds.length ? (
    <AnchoredOverlay
      open={isOverflowShown}
      onOpen={openOverflowOverlay}
      onClose={closeOverflowOverlay}
      width="auto"
      height="auto"
      align="start"
      side="inside-right"
      // expandButtonRef satisfies React.RefObject<HTMLButtonElement> because we manually set `.current` in the `useCallback` above
      anchorRef={expandButtonRef as unknown as React.RefObject<HTMLButtonElement>}
      anchorOffset={overlayPaddingPx * -1}
      alignmentOffset={overlayPaddingPx * -1}
      renderAnchor={props => (
        <Button variant="invisible" size="small" {...props} ref={expandButtonRef}>
          <VisuallyHidden>Show all {totalLength}</VisuallyHidden>
          <span aria-hidden="true">+{hiddenItemIds.length}</span>
        </Button>
      )}
      focusZoneSettings={{disabled: true}}
    >
      <Box alignItems="flex-start" display="flex" width={overlayWidth} padding={`${overlayPaddingPx}px`}>
        <Box display="flex" flexWrap="wrap" sx={{gap: 1}}>
          {children}
        </Box>
        <IconButton
          onClick={closeOverflowOverlay}
          icon={XIcon}
          aria-label="Close"
          variant="invisible"
          sx={{flexShrink: 0}}
        />
      </Box>
    </AnchoredOverlay>
  ) : null

// TODO: reduce re-renders
const LabelGroup: React.FC<React.PropsWithChildren<LabelGroupProps>> = ({
  children,
  visibleChildCount,
  overflowStyle = 'overlay',
  sx: sxProp,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const collapseButtonRef = React.useRef<HTMLButtonElement>(null)
  const firstHiddenIndexRef = React.useRef<number | undefined>(undefined)
  const [visibilityMap, setVisibilityMap] = React.useState<Record<string, boolean>>({})
  const [isOverflowShown, setIsOverflowShown] = React.useState<boolean>(false)
  const [buttonClientRect, setButtonClientRect] = React.useState<DOMRect>({
    width: 0,
    right: 0,
    height: 0,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 0,
    toJSON: () => undefined,
  })

  const {theme} = useTheme()

  const overlayPaddingPx = parseInt(get('space.2')(theme), 10)

  const hiddenItemIds = Object.keys(visibilityMap).filter(key => !visibilityMap[key])

  // `overlayWidth` is only needed when we render an overlay
  // if we don't use an overlay, we can skip the width calculation
  // and save on reflows caused by measuring DOM nodes.
  const overlayWidth =
    hiddenItemIds.length && overflowStyle === 'overlay'
      ? getOverlayWidth(buttonClientRect, containerRef, overlayPaddingPx)
      : undefined

  const expandButtonRef: React.RefCallback<HTMLButtonElement> = React.useCallback(
    node => {
      if (node !== null) {
        const nodeClientRect = node.getBoundingClientRect()

        if (nodeClientRect.width !== buttonClientRect.width || nodeClientRect.right !== buttonClientRect.right) {
          setButtonClientRect(nodeClientRect)
        }

        // @ts-ignore you can set `.current` on ref objects or ref callbacks in React
        expandButtonRef.current = node
      }
    },
    [buttonClientRect],
  )

  // Sets the visibility map to hide children after the given index.
  const hideChildrenAfterIndex = React.useCallback((truncateAfter: number) => {
    const containerChildren = containerRef.current?.children || []
    const updatedEntries: Record<string, boolean> = {}
    for (const child of containerChildren) {
      const targetId = child.getAttribute('data-index')
      if (targetId) {
        updatedEntries[targetId] = parseInt(targetId, 10) < truncateAfter
      }
    }

    setVisibilityMap(updatedEntries)
  }, [])

  const openOverflowOverlay = React.useCallback(() => setIsOverflowShown(true), [setIsOverflowShown])

  const closeOverflowOverlay = React.useCallback(() => {
    setIsOverflowShown(false)
  }, [setIsOverflowShown])

  const collapseInlineExpandedChildren = React.useCallback(() => {
    setIsOverflowShown(false)

    if (visibleChildCount && typeof visibleChildCount === 'number') {
      hideChildrenAfterIndex(visibleChildCount)
    }

    // We need to manually re-focus the collapse button if we're not showing the full
    // list in an overlay.
    // TODO: get rid of this hack
    setTimeout(() => {
      // @ts-ignore you can set `.current` on ref objects or ref callbacks in React
      expandButtonRef.current?.focus()
    }, 10)
  }, [expandButtonRef, hideChildrenAfterIndex, visibleChildCount])

  const showAllTokensInline = React.useCallback(() => {
    setVisibilityMap({})
    setIsOverflowShown(true)
  }, [setVisibilityMap, setIsOverflowShown])

  React.useEffect(() => {
    // If we're not truncating, we don't need to run this useEffect.
    if (!visibleChildCount || isOverflowShown) {
      return
    }

    if (visibleChildCount === 'auto') {
      // Instatiates the IntersectionObserver to track when children fit in the container.
      const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          const updatedEntries: Record<string, boolean> = {}

          for (const entry of entries) {
            // Checks which children are intersecting the root container
            const targetId = entry.target.getAttribute('data-index')
            if (targetId) {
              updatedEntries[targetId] = entry.isIntersecting
            }
          }

          // Updates the visibility map based on the intersection results.
          setVisibilityMap(prev => ({
            ...prev,
            ...updatedEntries,
          }))
        },
        {
          root: containerRef.current,
          rootMargin: `0px -${buttonClientRect.width}px 0px 0px`,
          threshold: 1,
        },
      )

      for (const item of containerRef.current?.children || []) {
        if (item.getAttribute('data-index')) {
          observer.observe(item)
        }
      }

      return () => observer.disconnect()
    }
    // We're not auto truncating, so we need to hide children after the given `visibleChildCount`.
    else {
      hideChildrenAfterIndex(visibleChildCount)
    }
  }, [buttonClientRect, visibleChildCount, hideChildrenAfterIndex, isOverflowShown])

  // Updates the index of the first hidden child.
  // We need to keep track of this so we can focus the first hidden child when the overflow is shown inline.
  React.useEffect(() => {
    // If we're using an overlay, we don't need to keep track of the first hidden index.
    if (overflowStyle === 'overlay') {
      return
    }
    if (hiddenItemIds.length) {
      firstHiddenIndexRef.current = parseInt(hiddenItemIds[0], 10)
    }
  }, [hiddenItemIds, overflowStyle, isOverflowShown])

  // Updates the index of the first hidden child.
  // We need to keep track of this so we can focus the first hidden child when the overflow is shown inline.
  React.useEffect(() => {
    // If we're using an overlay, we don't need to focus the first child that was previously hidden.
    if (overflowStyle === 'overlay') {
      return
    }
    const firstHiddenChildDOM = document.querySelector<HTMLElement>(`[data-index="${firstHiddenIndexRef.current}"]`)
    const focusableChild = firstHiddenChildDOM ? getFocusableChild(firstHiddenChildDOM) : null

    if (isOverflowShown) {
      // If the first hidden child is focusable, focus it.
      // Otherwise, focus the collapse button.
      if (focusableChild) {
        focusableChild.focus()
      } else {
        collapseButtonRef.current?.focus()
      }
    }
  }, [overflowStyle, isOverflowShown])

  // If truncation is enabled, we need to render based on truncation logic.
  return visibleChildCount ? (
    <StyledLabelGroupContainer
      ref={containerRef}
      data-overflow={overflowStyle === 'inline' && isOverflowShown ? 'inline' : undefined}
      sx={sxProp}
    >
      {React.Children.map(children, (child, index) => (
        <ItemWrapper
          // data-index is used as an identifier we can use in the IntersectionObserver
          data-index={index}
          className={hiddenItemIds.includes(index.toString()) ? 'ItemWrapper--hidden' : undefined}
        >
          {child}
        </ItemWrapper>
      ))}
      {overflowStyle === 'inline' ? (
        <InlineToggle
          collapseButtonRef={collapseButtonRef}
          collapseInlineExpandedChildren={collapseInlineExpandedChildren}
          expandButtonRef={expandButtonRef}
          hiddenItemIds={hiddenItemIds}
          isOverflowShown={isOverflowShown}
          showAllTokensInline={showAllTokensInline}
          totalLength={React.Children.toArray(children).length}
        />
      ) : (
        <OverlayToggle
          closeOverflowOverlay={closeOverflowOverlay}
          expandButtonRef={expandButtonRef}
          hiddenItemIds={hiddenItemIds}
          isOverflowShown={isOverflowShown}
          openOverflowOverlay={openOverflowOverlay}
          overlayPaddingPx={overlayPaddingPx}
          overlayWidth={overlayWidth}
          totalLength={React.Children.toArray(children).length}
        >
          {children}
        </OverlayToggle>
      )}
    </StyledLabelGroupContainer>
  ) : (
    <StyledLabelGroupContainer data-overflow="inline" sx={sxProp}>
      {children}
    </StyledLabelGroupContainer>
  )
}

LabelGroup.displayName = 'LabelGroup'

export default LabelGroup
