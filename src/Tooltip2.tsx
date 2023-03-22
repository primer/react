import React, {Children, useEffect, useRef, useState} from 'react'
import Box from './Box'
import sx, {SxProp} from './sx'
import {useId} from './hooks/useId'
import {isFocusable} from '@primer/behaviors/utils'
import {invariant} from './utils/invariant'
import styled from 'styled-components'
import {get} from './constants'

export type Tooltip2Props = {
  direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  text?: string
  noDelay?: boolean
  align?: 'left' | 'right'
  wrap?: boolean
  type?: 'label' | 'description'
  'aria-label'?: React.AriaAttributes['aria-label']
} & SxProp

export type TriggerPropsType = {
  'aria-describedby'?: string
  'aria-labelledby'?: string
  'aria-label'?: string
}

const TOOLTIP_ARROW_EDGE_OFFSET = '16'

const TooltipBase = styled.div<Tooltip2Props>`
  position: relative;
  display: inline-block;

  &::before {
    position: absolute;
    z-index: 1000001;
    display: none;
    width: 0px;
    height: 0px;
    color: ${get('colors.neutral.emphasisPlus')};
    pointer-events: none;
    content: '';
    border: 6px solid transparent;
    opacity: 0;
  }

  & > span {
    position: absolute;
    z-index: 1000000;
    display: none;
    padding: 0.5em 0.75em;
    font: normal normal 11px/1.5 ${get('fonts.normal')};
    -webkit-font-smoothing: subpixel-antialiased;
    color: ${get('colors.fg.onEmphasis')};
    text-align: center;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: break-word;
    white-space: pre;
    pointer-events: none;
    content: attr(aria-label);
    background: ${get('colors.neutral.emphasisPlus')};
    border-radius: ${get('radii.1')};
    opacity: 0;
  }

  // delay animation for tooltip
  @keyframes tooltip-appear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  &[data-state='open'] {
    &::before,
    & > span {
      display: inline-block;
      text-decoration: none;
      animation-name: tooltip-appear;
      animation-duration: 0.1s;
      animation-fill-mode: forwards;
      animation-timing-function: ease-in;
      animation-delay: ${props => (props.noDelay ? '0s' : '0.4s')};
      
    }

    &[data-direction='s'],
    &[data-direction='se'],
    &[data-direction='sw'] {
      & > span {
        top: 100%;
        right: 50%;
        margin-top: 6px;
      }
      &::before {
        top: auto;
        right: 50%;
        bottom: -7px;
        margin-right: -6px;
        border-bottom-color: ${get('colors.neutral.emphasisPlus')};
      }
    }
    &[data-direction='se'] > span {
      right: auto;
      left: 50%;
      margin-left: -${get('space.3')};
    }

    &[data-direction='sw'] > span {
      margin-right: -${get('space.3')};
    }

    &[data-direction='n'],
    &[data-direction='ne'],
    &[data-direction='nw'] {
      & > span {
        right: 50%;
        bottom: 100%;
        margin-bottom: 6px;
      }
      &::before {
        top: -7px;
        right: 50%;
        bottom: auto;
        margin-right: -6px;
        border-top-color: ${get('colors.neutral.emphasisPlus')};
      }
    }

    &[data-direction='ne'] > span {
      right: auto;
      left: 50%;
      margin-left: -${get('space.3')};
    }

    &[data-direction='nw'] > span {
      margin-right: -${get('space.3')};
    }

    &[data-direction='n'],
    &[data-direction='s'] {
      & > span {
        transform: translateX(50%);
      }
    }

    &[data-direction='e'] {
      & > span {
        bottom: 50%;
        left: 100%;
        margin-left: 6px;
        transform: translateY(50%);
      }
      &::before {
        top: 50%;
        right: -7px;
        bottom: 50%;
        margin-top: -6px;
        border-right-color: ${get('colors.neutral.emphasisPlus')};
      }
    }

    &[data-direction='w'] {
      & > span {
        right: 100%;
        bottom: 50%;
        margin-right: 6px;
        transform: translateY(50%);
      }
  
      &::before {
        top: 50%;
        bottom: 50%;
        left: -7px;
        margin-top: -6px;
        border-left-color: ${get('colors.neutral.emphasisPlus')};
      }
    }

  ${sx};
`

const tooltipStyle = ({
  direction,
  noDelay,
  align,
  wrap,
  open,
}: Pick<Tooltip2Props, 'direction' | 'noDelay' | 'align' | 'wrap'> & {open: boolean}) => ({
  position: 'relative',
  display: 'inline-block',

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
    ...(open && {
      display: 'inline-block',
      textDecoration: 'none',
      //   conditionally render styles depending on direction
      ...((direction === 'n' || direction === 'ne' || direction === 'nw') && {
        borderTopColor: 'neutral.emphasisPlus',
        top: '-7px',
        bottom: 'auto',
        right: '50%',
        marginRight: '-6px',
      }),
      ...((direction === 's' || direction === 'se' || direction === 'sw') && {
        borderBottomColor: 'neutral.emphasisPlus',
        top: 'auto',
        bottom: '-7px',
        right: '50%',
        marginRight: '-6px',
      }),
      ...(direction === 'e' && {
        borderRightColor: 'neutral.emphasisPlus',
        top: '50%',
        right: '-7px',
        bottom: '50%',
        marginTop: '-6px',
      }),
      ...(direction === 'w' && {
        borderLeftColor: 'neutral.emphasisPlus',
        top: '50%',
        bottom: '50%',
        left: '-7px',
        marginTop: '-6px',
      }),
      // Left align tooltips with align prop
      ...(align === 'left' && {
        left: '10px',
      }),
      // Right align tooltips with align prop
      ...(align === 'right' && {
        right: '15px',
      }),
    }),
  },
  // popover
  '& > span': {
    position: 'absolute',
    zIndex: '1000001',
    display: 'none',
    padding: '0.5em 0.75em',
    fontSize: 0,
    // font: normal normal 11px/1.5 ${get('fonts.normal')};
    // -webkit-font-smoothing: subpixel-antialiased;
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
    borderRadius: '3px', // radii.2
    opacity: 0,
    ...(open && {
      //   conditionally render styles depending on direction
      ...((direction === 'n' || direction === 'ne' || direction === 'nw') && {
        right: '50%',
        bottom: '100%',
        marginBottom: '6px',
      }),
      ...(direction === 'ne' && {
        right: 'auto',
        left: '50%',
        marginLeft: `-${TOOLTIP_ARROW_EDGE_OFFSET}px`, // space.3?
      }),
      ...(direction === 'nw' && {
        marginRight: `-${TOOLTIP_ARROW_EDGE_OFFSET}px`, // space.3?
      }),
      ...((direction === 's' || direction === 'se' || direction === 'sw') && {
        top: '100%',
        right: '50%',
        marginTop: '6px',
      }),
      ...(direction === 'se' && {
        right: 'auto',
        left: '50%',
        marginLeft: `-${TOOLTIP_ARROW_EDGE_OFFSET}px`, // space.3?
      }),
      ...(direction === 'sw' && {
        marginRight: `-${TOOLTIP_ARROW_EDGE_OFFSET}px`, // space.3?
      }),
      ...(direction === 'e' && {
        left: '100%',
        bottom: '50%',
        marginLeft: '6px',
        transform: 'translateY(50%)',
      }),
      ...(direction === 'w' && {
        right: '100%',
        bottom: '50%',
        marginRight: '6px',
        transform: 'translateY(50%)',
      }),
      // only for s and n direction to move the popover bovy to the center of the trigger
      ...((direction === 'n' || direction === 's') && {
        transform: 'translateX(50%)',
      }),
      // Left align tooltips with align prop
      ...(align === 'left' && {
        right: '100%',
        marginLeft: '0',
      }),
      // Right align tooltips with align prop
      ...(align === 'right' && {
        right: '0',
        marginRight: '0',
      }),
      // Multiline tooltips with wrap prop
      ...(wrap && {
        display: 'table-cell',
        width: 'max-content',
        maxWidth: '250px',
        wordWrap: 'break-word',
        whiteSpace: 'pre-line',
        borderCollapse: 'separate',
      }),
      // Some styles of the directions need to be overriden when wrap is true
      ...(wrap &&
        (direction === 's' || direction === 'n') && {
          right: 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
        }),
      ...(wrap &&
        (direction === 'w' || direction === 'e') && {
          right: '100%',
        }),
    }),
  },

  '&::before, & > span': {
    ...(open && {
      display: 'inline-block',
      textDecoration: 'none',
      animationName: 'tooltip-appear',
      animationDuration: '0.1s',
      animationFillMode: 'forwards',
      animationTimingFunction: 'ease-in',
      animationDelay: noDelay ? '0s' : '0.4s',
    }),
  },
})

const Tooltip2: React.FC<React.PropsWithChildren<Tooltip2Props>> = ({
  direction = 'n',
  // used for description type
  text,
  // used for label type
  'aria-label': label,
  children,
  type = 'label',
  ...rest
}) => {
  const id = useId()
  const tooltipRef = useRef<HTMLDivElement>(null)
  const child = Children.only(children) // make sure there is only one child
  const [open, setOpen] = useState(false)

  // we need this check for every render
  if (__DEV__) {
    // Practically, this is not a conditional hook, it is a compile time check
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (tooltipRef.current) {
        const childNode = tooltipRef.current.children[0] // For now, I assume it has one node but that is not true
        invariant(
          isFocusable(childNode as HTMLElement),
          'The `Tooltip2` component expects a single React element that contains interactive content. Consider using a `<button>` or equivalent interactive element instead.',
        )
      }
    })
  }

  const triggerEvtHandlers = {
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
      }
    },
  }

  // Make sure to compose the default event handlers for tooltip trigger with the ones that are passed in
  function composeEventHandlers(child: React.ReactElement) {
    const {
      onBlur: _onBlur,
      onFocus: _onFocus,
      onMouseEnter: _onMouseEnter,
      onMouseLeave: _onMouseLeave,
      onKeyDown: _onKeyDown,
    } = child.props

    return {
      onBlur: () => {
        _onBlur && _onBlur()
        triggerEvtHandlers.onBlur()
      },
      onFocus: () => {
        _onFocus && _onFocus()
        triggerEvtHandlers.onFocus()
      },
      onMouseEnter: () => {
        _onMouseEnter && _onMouseEnter()
        triggerEvtHandlers.onMouseEnter()
      },
      onMouseLeave: () => {
        _onMouseLeave && _onMouseLeave()
        triggerEvtHandlers.onMouseLeave()
      },
      onKeyDown: (evt: React.KeyboardEvent) => {
        _onKeyDown && _onKeyDown()
        triggerEvtHandlers.onKeyDown(evt)
      },
    }
  }

  return (
    <TooltipBase ref={tooltipRef} data-direction={direction} data-state={open ? 'open' : undefined} {...rest}>
      {React.cloneElement(child as React.ReactElement<TriggerPropsType>, {
        ...{
          // if it is a type description, we use tooltip to describe the trigger
          'aria-describedby': type === 'description' ? id : undefined,
          // If it is a type description, we should keep the aria label if it exists, otherwise we remove it because we will use aria-labelledby
          'aria-label': type === 'description' ? (children as React.ReactElement).props['aria-label'] : undefined,
          //   If it is a label type, we use tooltip to label the trigger
          'aria-labelledby': type === 'label' ? id : undefined,
        },
        ...composeEventHandlers(child as React.ReactElement<TriggerPropsType>),
      })}
      <Box
        as="span"
        // Only need tooltip role if the tooltip is a description for supplementary information
        role={type === 'description' ? 'tooltip' : undefined}
        // stop AT from announcing the tooltip twice when it is a label type because it will be announced with "aria-labelledby"
        aria-hidden={type === 'label' ? true : undefined}
        id={id}
      >
        {text || label}
      </Box>
    </TooltipBase>
  )
}

export default Tooltip2
