/**
 * Add animations & noDelay
 * wrap
 * add align?
 */

import React from 'react'
import {useSSRSafeId} from '@react-aria/ssr'
import type {AnchorPosition, AnchorSide, AnchorAlignment} from '@primer/behaviors'
import Box from '../Box'
import {useAnchoredPosition} from '../hooks'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'

type TooltipDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
type TooltipAlign = 'left' | 'right'
export type TooltipProps = {
  /** The text content of the tooltip. This should be brief and no longer than a sentence. */
  text: string
  /** @deprecated Use `text` instead */
  'aria-label'?: string
  /** Position relative to target */
  direction?: TooltipDirection
  /** Position relative to target */
  align?: TooltipAlign
  /** Use aria-describedby or aria-labelledby */
  type?: 'description' | 'label'
  /** Tooltip target, single element */
  children: React.ReactElement
} & SxProp

// map tooltip direction to anchoredPosition props
const directionToPosition: Record<TooltipDirection, {side: AnchorSide; align: AnchorAlignment}> = {
  nw: {side: 'outside-top', align: 'start'},
  n: {side: 'outside-top', align: 'center'},
  ne: {side: 'outside-top', align: 'end'},
  e: {side: 'outside-right', align: 'center'},
  se: {side: 'outside-bottom', align: 'end'},
  s: {side: 'outside-bottom', align: 'center'},
  sw: {side: 'outside-bottom', align: 'start'},
  w: {side: 'outside-left', align: 'center'}
}

// map align to AnchorAlignment
const alignToAnchorAlignment: Record<TooltipAlign, AnchorAlignment> = {left: 'start', right: 'end'}

export const TooltipContext = React.createContext<{tooltipId?: string}>({})

export const Tooltip: React.FC<TooltipProps> = ({text, children, direction = 'n', align, type = 'description'}) => {
  const tooltipRef = React.useRef<HTMLDivElement>(null)
  const anchorElementRef = React.useRef<HTMLElement>(null)

  const {position} = useAnchoredPosition({
    side: directionToPosition[direction].side,
    // maintain backward compatibility
    align: align ? alignToAnchorAlignment[align] : directionToPosition[direction].align,
    floatingElementRef: tooltipRef,
    anchorElementRef
  })

  const tooltipId = useSSRSafeId()
  const child = React.cloneElement(React.Children.only(children), {
    ref: anchorElementRef,
    [type === 'description' ? 'aria-describedby' : 'aria-labelledby']: tooltipId
  })

  return (
    <Box
      as="span"
      sx={{
        ':hover, :focus-within': {'[data-component=tooltip]': {visibility: 'visible'}}
      }}
    >
      <TooltipContext.Provider value={{tooltipId}}>{child}</TooltipContext.Provider>
      <FloatingTooltip id={tooltipId} ref={tooltipRef} position={position}>
        {text}
      </FloatingTooltip>
    </Box>
  )
}

const FloatingTooltip = React.forwardRef<
  HTMLDivElement,
  {id: string; children: string; position?: AnchorPosition} & SxProp
>(({id, children, position, sx = {}}, ref) => {
  const styles = {
    visibility: 'hidden',
    backgroundColor: 'neutral.emphasisPlus',
    color: 'fg.onEmphasis',
    borderRadius: 1,
    fontSize: 0,
    paddingY: 1,
    paddingX: 2,
    width: 'fit-content',
    maxWidth: '250px',
    textAlign: 'center',
    position: 'absolute',
    zIndex: 2,
    top: position?.top,
    left: position?.left
  }

  return (
    <Box
      role="tooltip"
      id={id}
      aria-hidden
      data-component="tooltip"
      ref={ref}
      sx={merge<BetterSystemStyleObject>(styles, sx)}
    >
      <Box
        sx={{
          position: 'relative',
          ':before': {
            content: '""',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: '5px solid',
            borderBottomColor: 'neutral.emphasisPlus',
            position: 'absolute',
            top: '-8px',
            left: {
              start: 0,
              center: 'calc(50% - 8px)',
              end: 'calc(100% - 8px)'
            }[position?.anchorAlign || 'center']
          }
        }}
      />
      {children}
    </Box>
  )
})
