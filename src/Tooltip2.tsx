import React, {Children} from 'react'
import Box from './Box'
import {BetterSystemStyleObject, merge, SxProp} from './sx'
import {Button} from './Button'
import {IconButton} from './Button/IconButton'

export type Tooltip2Props = {
  direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  text?: string
  noDelay?: boolean
  align?: 'left' | 'right'
  wrap?: boolean
  type?: 'label' | 'description'
} & SxProp

const tooltipClasses = ({direction, noDelay, align, wrap}: Omit<Tooltip2Props, 'type' | 'text'>) => ({
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
  '&:hover, &:focus, &:active, &:focus-within': {
    '& > span': {
      display: 'inline-block',
      opacity: 1,
      //   conditionally render styles depending on direction
      ...(direction === 'n' && {
        right: '50%',
        transform: 'translateX(50%)',
        bottom: '100%',
        marginBottom: '6px',
      }),
    },
    '&::before': {
      display: 'inline-block',
      textDecoration: 'none',
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
  children && Children.only(children) // make sure there is only one child
  const isInteractive = React.isValidElement(children) && (children.type === Button || children.type === IconButton)
  if (!isInteractive) {
    // eslint-disable-next-line no-console
    console.error('Tooltip trigger must be an interactive React element (e.g. Button)')
  }

  const child = React.cloneElement(
    children as React.ReactElement<{
      'aria-describedby'?: string
      'aria-labelledby'?: string
      'aria-label'?: string
    }>,
    {
      // use aria-describedby if the type is description
      'aria-describedby': type === 'description' ? 'tooltip-id-random-id' : undefined,
      // use aria-label if the child is a button
      'aria-labelledby': type === 'description' ? undefined : 'tooltip-id-random-id',
      // remove aria-label if the child has an aria-labelledby
      'aria-label': type === 'label' ? undefined : (children as React.ReactElement).props['aria-label'],
    },
  )

  return (
    <Box sx={merge<BetterSystemStyleObject>(tooltipClasses({direction, noDelay, align, wrap}), sx)} {...props}>
      {isInteractive && child}

      <Box
        as="span"
        // Only need tooltip role if the tooltip is a description for supplementary information
        role={type === 'description' ? 'tooltip' : undefined}
        // aria-hidden true only if the tooltip is a label type
        aria-hidden={type === 'label' ? true : undefined}
        id="tooltip-id-random-id"
      >
        {text || (children as React.ReactElement).props['aria-label']}
      </Box>
    </Box>
  )
}

export default Tooltip2
