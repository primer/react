import React, {Children, useEffect, useRef} from 'react'
import Box from './Box'
import {BetterSystemStyleObject, merge, SxProp} from './sx'
import {useId} from './hooks/useId'
import {isFocusable} from '@primer/behaviors/utils'

export type Tooltip2Props = {
  direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  text?: string
  noDelay?: boolean
  align?: 'left' | 'right'
  wrap?: boolean
  type?: 'label' | 'description'
} & SxProp

export type TriggerPropsType = {
  'aria-describedby'?: string
  'aria-labelledby'?: string
  'aria-label'?: string
}

const tooltipClasses = ({direction, noDelay, align, wrap}: Omit<Tooltip2Props, 'type' | 'text' | 'children'>) => ({
  position: 'relative',
  display: 'inline-block',
  '& > span': {
    position: 'absolute',
    zIndex: '1000001',
    display: 'none',
    padding: '0.5em 0.75em',
    fontSize: 0,
    color: 'fg.onEmphasis',
    textAlign: 'center',
    textDecoration: 'none',
    textShadow: 'none',
    textTransform: 'none',
    letterSpacing: 'normal',
    wordWrap: 'break-word',
    whiteSpace: 'pre',
    pointerEvents: 'none',
    backgroundColor: 'neutral.emphasisPlus',
    borderRadius: '3px', // use theme value radii.1'
    opacity: 0,
  },
  '&::before': {
    position: 'absolute',
    zIndex: '1000001',
    display: 'none',
    content: '""',
    width: 0,
    height: 0,
    color: 'neutral.onEmphasis',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: '6px',
    borderColor: 'transparent',
    opacity: 0,
  },
  '&:hover, &:focus, &:active, &:focus-within': {
    '& > span': {
      display: 'inline-block',
      opacity: 1,
      //   conditionally render styles depending on direction
      ...((direction === 'n' || direction === 'ne' || direction === 'nw') && {
        right: '50%',
        bottom: '100%',
        marginBottom: '6px',
      }),
      // only for n direction
      ...(direction === 'n' && {
        transform: 'translateX(50%)',
      }),
      ...((direction === 's' || direction === 'se' || direction === 'sw') && {}),
    },
    '&::before': {
      display: 'inline-block',
      textDecoration: 'none',
      opacity: 1,
      //   conditionally render styles depending on direction
      ...((direction === 'n' || direction === 'ne' || direction === 'nw') && {
        borderTopColor: 'neutral.emphasisPlus',
        top: '-7px',
        bottom: 'auto',
        right: '50%',
        marginRight: '-6px',
      }),
    },
  },
})

const Tooltip2: React.FC<React.PropsWithChildren<Tooltip2Props>> = ({
  direction = 'n',
  text,
  noDelay,
  align,
  wrap,
  sx = {},
  children,
  type = 'label',
  ...props
}) => {
  const id = useId()
  const tooltipRef = useRef<HTMLDivElement>(null)
  const child = Children.only(children) // make sure there is only one child

  // we need this check for every render
  useEffect(() => {
    if (tooltipRef.current) {
      const childNode = tooltipRef.current.children[0] // For now, I assume it has one node but that is not true
      if (!isFocusable(childNode as HTMLElement)) {
        throw new Error('Tooltip2: The child element must be focusable')
      }
    }
  })
  const triggerProps = {
    // if it is a type description, we use tooltip to describe the trigger
    'aria-describedby': type === 'description' ? id : undefined,
    // If it is a type description, we should keep the aria label if it exists, otherwise we remove it because we will use aria-labelledby
    'aria-label': type === 'description' ? (children as React.ReactElement).props['aria-label'] : undefined,
    //   If it is a label type, we use tooltip to label the trigger
    'aria-labelledby': type === 'label' ? id : undefined,
  }
  // Only need tooltip role if the tooltip is a description for supplementary information
  const role = type === 'description' ? 'tooltip' : undefined
  // aria-hidden true only if the tooltip is a label type
  const ariaHidden = type === 'label' ? true : undefined

  return (
    <Box
      ref={tooltipRef}
      sx={merge<BetterSystemStyleObject>(tooltipClasses({direction, noDelay, align, wrap}), sx)}
      {...props}
    >
      {React.cloneElement(child as React.ReactElement<TriggerPropsType>, triggerProps)}
      <Box as="span" role={role} aria-hidden={ariaHidden} id={id}>
        {text || (child as React.ReactElement).props['aria-label']}
      </Box>
    </Box>
  )
}

export default Tooltip2
