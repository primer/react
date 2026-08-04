import {clsx} from 'clsx'
import classes from './Popover.module.css'
import type {HTMLProps} from 'react'
import React, {useRef} from 'react'
import {useOnEscapePress, useOnOutsideClick} from '../hooks'

// Stable empty array reference to avoid unnecessary re-renders
const EMPTY_IGNORE_CLICK_REFS: React.RefObject<HTMLElement>[] = []
const PopoverContext = React.createContext(false)

type CaretPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left'
  | 'top-right'
  | 'left-bottom'
  | 'left-top'
  | 'right-bottom'
  | 'right-top'

type StyledPopoverProps = {
  caret?: CaretPosition
  relative?: boolean
  open?: boolean
}

export type PopoverProps = {
  /** Class name for custom styling */
  className?: string
} & StyledPopoverProps &
  HTMLProps<HTMLDivElement>

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {className, caret = 'top', open, relative, ...props},
  forwardRef,
) {
  return (
    <PopoverContext.Provider value={open ?? false}>
      <div
        {...props}
        ref={forwardRef}
        data-component="Popover"
        data-open={open ? '' : undefined}
        data-relative={relative ? '' : undefined}
        data-caret={caret}
        className={clsx(className, classes.Popover)}
      />
    </PopoverContext.Provider>
  )
})
Popover.displayName = 'Popover'

export type PopoverContentProps = {
  className?: string
  width?: 'xsmall' | 'small' | 'large' | 'medium' | 'auto' | 'xlarge'
  height?: 'small' | 'large' | 'medium' | 'auto' | 'xlarge' | 'fit-content'
  overflow?: 'auto' | 'hidden' | 'scroll' | 'visible'
  /*
   * Callback fired when a click is detected outside the popover content
   */
  onClickOutside?: (event: MouseEvent | TouchEvent) => void
  /*
   * Callback fired when the Escape key is pressed while the popover is open
   */
  onEscape?: (event: KeyboardEvent) => void
  /*
   * Refs to elements that should be ignored when detecting outside clicks
   */
  ignoreClickRefs?: React.RefObject<HTMLElement>[]
} & HTMLProps<HTMLDivElement>

const PopoverContent: React.FC<React.PropsWithChildren<PopoverContentProps>> = ({
  className,
  width = 'small',
  height = 'fit-content',
  onClickOutside,
  onEscape,
  ignoreClickRefs,
  ...props
}) => {
  const divRef = useRef(null)
  const open = React.useContext(PopoverContext)

  const outsideClickHandler = onClickOutside ?? (() => {})

  useOnOutsideClick({
    onClickOutside: outsideClickHandler,
    containerRef: divRef,
    ignoreClickRefs: ignoreClickRefs ?? EMPTY_IGNORE_CLICK_REFS,
  })

  useOnEscapePress(
    event => {
      if (open && onEscape) {
        onEscape(event)
        event.preventDefault()
      }
    },
    [open, onEscape],
  )

  return (
    <div
      ref={divRef}
      data-component="Popover.Content"
      data-width={width}
      data-height={height}
      className={clsx(className, classes.PopoverContent)}
      {...props}
    />
  )
}

PopoverContent.displayName = 'Popover.Content'

export default Object.assign(Popover, {Content: PopoverContent})
