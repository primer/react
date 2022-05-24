import React from 'react'
import {useSSRSafeId} from '@react-aria/ssr'
import type {AnchorPosition, AnchorSide, AnchorAlignment} from '@primer/behaviors'
import Box from '../Box'
import {useAnchoredPosition, useProvidedRefOrCreate} from '../hooks'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'

type TooltipDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
type TooltipAlign = 'left' | 'right'

export type TooltipProps = {
  /** The text content of the tooltip. This should be brief and no longer than a sentence.
   *  Marked as optional to support backward compatibility with aria-label. */
  text?: string
  /** @deprecated Use `text` instead */
  'aria-label'?: string
  /** Direction relative to target */
  direction?: TooltipDirection
  /** @deprecated Use `direction` instead. Alignment relative to target. */
  align?: TooltipAlign
  /** Use aria-describedby or aria-labelledby */
  type?: 'description' | 'label'
  /** Tooltip target */
  children: React.ReactElement & {ref?: React.RefObject<HTMLElement>}
  /** When set to true, tooltip appears without any delay */
  noDelay?: boolean
  /** @deprecated Always set to true now. */
  wrap?: boolean
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

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  direction = 'n',
  align,
  type = 'description',
  noDelay = false,
  sx = {},
  ...props
}) => {
  const tooltipId = useSSRSafeId()

  const childRef = children.ref
  const anchorElementRef = useProvidedRefOrCreate(childRef)
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  const child = React.cloneElement(children, {
    ref: anchorElementRef,
    [type === 'description' ? 'aria-describedby' : 'aria-labelledby']: tooltipId
  })

  const {position} = useAnchoredPosition({
    side: directionToPosition[direction].side,
    // support both algin and direction for backward compatibility
    align: align ? alignToAnchorAlignment[align] : directionToPosition[direction].align,
    floatingElementRef: tooltipRef,
    anchorElementRef
  })

  const tooltipText = text || props['aria-label']

  return (
    <Box
      as="span"
      sx={{
        ':hover, :focus-within': {'[data-component=tooltip]': {visibility: 'visible', opacity: 1}},
        lineHeight: 1 // we don't want the span wrapper to cause misalignment
      }}
    >
      <TooltipContext.Provider value={{tooltipId}}>{child}</TooltipContext.Provider>
      <FloatingTooltip
        id={tooltipId}
        text={tooltipText}
        noDelay={noDelay}
        ref={tooltipRef}
        position={position}
        sx={sx}
      />
    </Box>
  )
}

const FloatingTooltip = React.forwardRef<
  HTMLDivElement,
  Pick<TooltipProps, 'text' | 'noDelay' | 'sx'> & {id: string; position?: AnchorPosition}
>(({id, text, noDelay, position, sx = {}}, ref) => {
  const styles: BetterSystemStyleObject = {
    visibility: 'hidden',
    opacity: 0,
    transition: 'opacity 100ms ease-in',
    transitionDelay: noDelay ? '0ms' : '400ms',

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
    left: position?.left,

    ':before': {
      content: '""',
      width: 0,
      height: 0,
      border: '5px solid transparent',
      position: 'absolute'
    },

    '&[data-side=outside-top]::before': {
      borderTop: '5px solid',
      borderTopColor: 'neutral.emphasisPlus',
      top: '100%'
    },
    '&[data-side=outside-bottom]::before': {
      borderBottom: '5px solid',
      borderBottomColor: 'neutral.emphasisPlus',
      top: '-10px'
    },
    '&[data-side=outside-left]::before': {
      borderLeft: '5px solid',
      borderLeftColor: 'neutral.emphasisPlus',
      top: 'calc(50% - 5px)',
      left: '100%'
    },
    '&[data-side=outside-right]::before': {
      borderRight: '5px solid',
      borderRightColor: 'neutral.emphasisPlus',
      top: 'calc(50% - 5px)',
      left: '-10px'
    },

    '&[data-align=start][data-side=outside-top]::before, &[data-align=start][data-side=outside-bottom]::before': {
      left: '8px'
    },
    '&[data-align=center][data-side=outside-top]::before, &[data-align=center][data-side=outside-bottom]::before': {
      left: 'calc(50% - 4px)'
    },
    '&[data-align=end][data-side=outside-top]::before, &[data-align=end][data-side=outside-bottom]::before': {
      left: 'calc(100% - 16px)'
    }
  }

  return (
    <Box
      role="tooltip"
      id={id}
      aria-hidden
      data-component="tooltip"
      data-side={position?.anchorSide}
      data-align={position?.anchorAlign}
      ref={ref}
      sx={merge<BetterSystemStyleObject>(styles, sx)}
    >
      {text}
    </Box>
  )
})
