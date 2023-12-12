import React, {useEffect, useRef, useState, PropsWithChildren, MouseEvent, TouchEvent, ChangeEvent} from 'react'
import styled from 'styled-components'
import {SxProp} from '../sx'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import {get} from '../constants'

const ANIMATION_DURATION = 300
const FULL_HEIGHT = 90
const HALF_HEIGHT = 50

/**
 * Props to customize the rendering of the Dialog.
 */
export interface DialogActionSheetProps extends SxProp {
  /**
   * This method is invoked when a gesture to close the dialog is used
   */
  onClose: (gesture: 'close-button' | 'escape' | 'drag' | 'overlay') => void

  /**
   * Default: "dialog". The ARIA role to assign to this dialog.
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/#alertdialog
   */
  role?: 'dialog' | 'alertdialog'
}

export default React.forwardRef<HTMLDivElement, PropsWithChildren<DialogActionSheetProps>>((props, forwardedRef) => {
  const {onClose, children, role, sx} = props

  // 🔄 STATES

  const [open, setIsOpen] = useState<boolean>(false)
  const [snappedHeight, setSnappedHeight] = useState<number>(HALF_HEIGHT)

  const [fireDelayedOnClose, setFireDelayedOnClose] = useState<
    'close-button' | 'escape' | 'drag' | 'overlay' | undefined
  >()

  // 📎 REFERENCES

  const dialogRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const startHeight = useRef(0)
  const isDragging = useRef(false)

  useRefObjectAsForwardedRef(forwardedRef, dialogRef)

  // 🧑‍🦽 ACCESSIBILITY

  const isReduced = prefersReducedMotion()

  // 🥊 ACTIONS

  const showBottomSheet = () => {
    setIsOpen(true)
    updateSheetHeight(HALF_HEIGHT)
  }

  const hideBottomSheet = async (gesture: 'close-button' | 'escape' | 'drag' | 'overlay') => {
    setIsOpen(false)
    if (isReduced) {
      onClose(gesture)
    } else {
      setFireDelayedOnClose(gesture)
    }
  }

  const updateSheetHeight = (height: number) => {
    if (!dialogRef.current) return
    dialogRef.current.style.height = `${height}vh`
    setSnappedHeight(height)
  }

  // 🎪 EVENTS

  const dragStop = () => {
    if (!dialogRef.current) return

    isDragging.current = false
    const sheetHeight = parseInt(dialogRef.current.style.height)

    const isReduced = prefersReducedMotion()
    dialogRef.current.style.transition = isReduced ? 'none' : '0.3s ease'

    if (sheetHeight < 25) return hideBottomSheet('drag')
    if (sheetHeight > 75) return updateSheetHeight(FULL_HEIGHT)

    updateSheetHeight(HALF_HEIGHT)
  }

  const dragStart = (e: MouseEvent | TouchEvent) => {
    if (!dialogRef.current) return

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

    let pageY
    if (e.type === 'touchstart' && 'touches' in e) {
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
      onClose(fireDelayedOnClose)
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
      onTouchMove={dragStop}
    >
      <Overlay onClick={() => hideBottomSheet('overlay')}></Overlay>
      <Content ref={dialogRef} role={role} open={open} sx={sx}>
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
  z-index: 2;
  width: 100%;
  right: 0;
  left: 0;
  padding-top: ${get('space.2')};
  padding-bottom: ${get('space.1')};
  cursor: grab;
  user-select: none;
  height: 12px;
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
  height: 50vh;
  maxheight: 100vh;
  width: 100%;
  border-radius: 12px 12px 0 0;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  transform: ${props => (props.open ? 'translateY(0%)' : 'translateY(100%)')};
  transition: ${ANIMATION_DURATION}ms ease;
`

// 🧑‍🦽 Accessibility

const prefersReducedMotion = () => {
  const mediaQueryList = window.matchMedia('(prefers-reduced-motion: no-preference)')
  return !mediaQueryList.matches
}
