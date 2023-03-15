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
  //   Only allow interactive elements ?? How would that work with PropsWithChildren??
  children: React.ReactElement<React.HTMLAttributes<HTMLButtonElement>> // how can I type it with native HTML elements?
} & SxProp

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
  const isInteractive = React.isValidElement(children) //&& (children.type === Button || children.type === IconButton)
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
      // if it is a type description, we use tooltip to describe the trigger
      'aria-describedby': type === 'description' ? 'tooltip-id-random-id' : undefined,
      // If it is a type description, we should keep the aria label if it exists, otherwise we remove it because we will use aria-labelledby
      'aria-label': type === 'description' ? (children as React.ReactElement).props['aria-label'] : undefined,
      //   If it is a label type, we use tooltip to label the trigger
      'aria-labelledby': type === 'label' ? 'tooltip-id-random-id' : undefined,
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
