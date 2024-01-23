import React, {useEffect, useRef, useState, PropsWithChildren, MouseEvent, TouchEvent, ChangeEvent} from 'react'
import styled from 'styled-components'
import {SxProp} from '../sx'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import Box from '../Box'
import {get} from '../constants'
import {useMedia} from '../hooks/useMedia'

export const ANIMATION_DURATION = 300
export const FULL_HEIGHT = 95
export const HALF_HEIGHT = 50

/**
 * Props to customize the rendering of the Dialog.
 */
export interface DialogBottomSheetProps extends SxProp {
  /**
   * This method is invoked when a gesture to close the dialog is used
   */
  onClose: () => void

  /**
   * Content that appears in the draggable header area.
   */
  header: React.ReactNode

  /**
   * Default: "dialog". The ARIA role to assign to this dialog.
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/#alertdialog
   */
  role?: 'dialog' | 'alertdialog'

  /**
   * Identifies the element (or elements) that labels the element it is applied to.
   */
  ariaLabelledby: string

  /**
   * Identifies the element (or elements) that describes the element on which the attribute is set.
   */
  ariaDescribedby: string

  /**
   * Indicates whether an element is modal when displayed.
   */
  ariaModal: boolean
}

export default React.forwardRef<HTMLDivElement, PropsWithChildren<DialogBottomSheetProps>>((props, forwardedRef) => {
  const {onClose, children, role, ariaLabelledby, ariaDescribedby, ariaModal, header, sx} = props

  // 🔄 STATES

  const [open, setIsOpen] = useState<boolean>(false)
  const [snappedHeight, setSnappedHeight] = useState<number>(HALF_HEIGHT)
  const [fireDelayedOnClose, setFireDelayedOnClose] = useState<boolean>(false)

  // 📎 REFERENCES

  const dialogRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const startHeight = useRef(0)
  const isDragging = useRef(false)

  useRefObjectAsForwardedRef<HTMLDivElement>(forwardedRef, dialogRef)

  // 🧑‍🦽 ACCESSIBILITY

  const isReduced = useMedia('(prefers-reduced-motion: no-preference)', false) === false

  // 🥊 ACTIONS

  const showBottomSheet = () => {
    setIsOpen(true)
    updateSheetHeight(HALF_HEIGHT)
  }

  const hideBottomSheet = async () => {
    setIsOpen(false)
    if (isReduced) {
      onClose()
    } else {
      setFireDelayedOnClose(true)
    }
  }

  const updateSheetHeight = (height: number) => {
    if (!dialogRef.current) return
    dialogRef.current.style.height = `${height}dvh`
    setSnappedHeight(height)
  }

  // 🎪 EVENTS

  const dragStop = (e: MouseEvent | TouchEvent) => {
    if (!dialogRef.current) return

    e.preventDefault()

    isDragging.current = false
    const sheetHeight = parseInt(dialogRef.current.style.height)

    dialogRef.current.style.transition = isReduced ? 'none' : '0.3s ease'

    if (sheetHeight < 10) return hideBottomSheet()
    if (sheetHeight > 75) return updateSheetHeight(FULL_HEIGHT)

    updateSheetHeight(HALF_HEIGHT)
  }

  const dragStart = (e: MouseEvent | TouchEvent) => {
    if (!dialogRef.current) return

    e.preventDefault()

    if (e.type === 'touchstart' && 'touches' in e) {
      startY.current = e.touches[0].pageY
    } else if ('clientX' in e) {
      startY.current = e.pageY
    }

    startHeight.current = parseInt(dialogRef.current.style.height)
    isDragging.current = true
    dialogRef.current.style.transition = 'none'
  }

  const dragging = (e: MouseEvent | TouchEvent) => {
    if (!dialogRef.current || !isDragging.current) return

    e.preventDefault()

    let pageY
    if (e.type === 'touchmove' && 'touches' in e) {
      pageY = e.touches[0].pageY
    } else if ('clientX' in e) {
      pageY = e.pageY
    }

    const delta = startY.current - (pageY || 0)
    const newHeight = startHeight.current + (delta / window.innerHeight) * 100
    updateSheetHeight(newHeight)
  }

  const onSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isDragging.current) {
      const value = parseInt(e.target.value)
      if (value === 1) {
        updateSheetHeight(HALF_HEIGHT)
      } else if (value === 2) {
        updateSheetHeight(FULL_HEIGHT)
      }
    }
  }

  // 🪝 HOOKS

  // Ensures an animation upon closing the component
  useEffect(() => {
    if (!fireDelayedOnClose) return
    setIsOpen(false)
    const timer = setTimeout(() => {
      onClose()
    }, ANIMATION_DURATION)
    return () => clearTimeout(timer)
  }, [fireDelayedOnClose, onClose])

  // Animates the bottom sheet in on mount
  useEffect(() => {
    showBottomSheet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentSliderValue = snappedHeight === HALF_HEIGHT ? 1 : 2

  return (
    <FullScreenContainer
      open={open}
      onMouseUp={dragStop}
      onMouseMove={dragging}
      onTouchEnd={dragStop}
      onTouchMove={dragging}
    >
      <Overlay data-testid="overlay" onClick={() => hideBottomSheet()}></Overlay>
      <Content
        ref={dialogRef}
        role={role}
        open={open}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-modal={ariaModal}
        sx={sx}
      >
        <Box sx={{position: 'relative'}}>
          <DraggableRegion
            onMouseDown={dragStart}
            onTouchStart={dragStart}
            onChange={onSliderChange}
            type="range"
            role="slider"
            tabIndex={0}
            min={1}
            max={2}
            value={currentSliderValue}
            aria-label="Draggable dialog height resizer"
            aria-valuemin={1}
            aria-valuemax={2}
            aria-valuenow={currentSliderValue}
            aria-valuetext={`Dialog height ${snappedHeight}% of the screen`}
          />
          <DraggableRegionPill />
          {header}
        </Box>
        {children}
      </Content>
    </FullScreenContainer>
  )
})

// 🖌️ Styles

const FullScreenContainer = styled.div<{open: boolean}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  opacity: ${props => (props.open ? 1 : 0)};
  pointerevents: ${props => (props.open ? 'auto' : 'none')};
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  transition: ${ANIMATION_DURATION / 3}ms linear;
  @media (prefers-reduced-motion) {
    transition: none;
  }
`
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: ${get('colors.primer.canvas.backdrop')};
`

const DraggableRegionPill = styled.div`
  height: 6px;
  width: 70px;
  display: block;
  background-color: ${get('colors.border.muted')};
  border-radius: 3px;
  top: ${get('space.2')};
  position: absolute;
  pointer-events: none;
  left: 50%;
  margin-left: -35px;
`

const DraggableRegion = styled.input`
  appearance: none;
  display: flex;
  justify-content: center;
  border: none;
  position: absolute;
  background: transparent;
  top: 0;
  width: 100%;
  right: 0;
  left: 0;
  bottom: 0;
  padding-top: ${get('space.2')};
  padding-bottom: ${get('space.1')};
  cursor: grab;
  user-select: none;
  min-height: 50px;
  &:hover ~ ${DraggableRegionPill} {
    background-color: ${get('colors.border.default')};
  }
  &:focus {
    outline: none;
    opacity: 0;
  }
  &:focus-visible:not([disabled]) ~ ${DraggableRegionPill} {
    background-color: ${get('colors.accent.emphasis')};
  }
  ::-moz-range-thumb {
    appearance: none;
    visibility: hidden;
  }
  ::-webkit-slider-thumb {
    appearance: none;
  }
`
const Content = styled.div<
  {
    open: boolean
  } & SxProp
>`
  display: flex;
  flex-direction: column;
  background-color: ${get('colors.canvas.default')};
  width: 100vw;
  max-width: 100dvh;
  max-width: 480px;
  border-radius: 12px 12px 0 0;
  position: relative;
  height: 50vh;
  height: 50dvh;
  box-shadow: ${get('shadows.overlay.shadow')};
  max-height: 100vh;
  max-height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  transform: ${props => (props.open ? 'translateY(0%)' : 'translateY(100%)')};
  transition: ${ANIMATION_DURATION}ms ease;
`
