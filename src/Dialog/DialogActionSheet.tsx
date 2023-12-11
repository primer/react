import React, {useEffect, useRef, useState, PropsWithChildren, MouseEvent, TouchEvent} from 'react'
import styled from 'styled-components'
import {SxProp} from '../sx'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import {get} from '../constants'

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
  const [fireDelayedOnClose, setFireDelayedOnClose] = useState<
    'close-button' | 'escape' | 'drag' | 'overlay' | undefined
  >()

  // 🧑‍🦽 ACCESSIBILITY

  const isReduced = prefersReducedMotion()

  // 📎 REFERENCES

  let dialogRef = useRef<HTMLDivElement>(null)
  let startY = useRef(0)
  let startHeight = useRef(0)
  let isDragging = useRef(false)
  let sheetHeight = useRef(0)

  useRefObjectAsForwardedRef(forwardedRef, dialogRef)

  // 🪝 HOOKS

  // Ensures an animation upon closing the component
  useEffect(() => {
    if (!fireDelayedOnClose) return
    console.log('Planning to close the dialog...')
    setIsOpen(false)
    const timer = setTimeout(() => {
      console.log('onClose...')

      onClose(fireDelayedOnClose)
    }, 300)
    return () => clearTimeout(timer)
  }, [fireDelayedOnClose, onClose])

  // Animates the bottom sheet in on mount
  useEffect(() => {
    showBottomSheet()
  }, [])

  // 🥊 ACTIONS

  const showBottomSheet = () => {
    setIsOpen(true)
    updateSheetHeight(50)
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
  }

  // 🎪 EVENTS

  const dragStop = () => {
    if (!dialogRef.current) return

    isDragging.current = false
    const sheetHeight = parseInt(dialogRef.current?.style.height ?? 0)

    const isReduced = prefersReducedMotion()
    dialogRef.current.style.transition = isReduced ? 'none' : '0.3s ease'

    if (sheetHeight < 25) return hideBottomSheet('drag')
    if (sheetHeight > 75) return updateSheetHeight(90)

    updateSheetHeight(50)
  }

  const dragStart = (e: MouseEvent | TouchEvent) => {
    if (!dialogRef.current) return
    startY.current = e.pageY || e.touches?.[0].pageY
    startHeight.current = parseInt(dialogRef.current?.style.height ?? 0)
    isDragging.current = true
    dialogRef.current.style.transition = 'none'
  }

  const dragging = (e: MouseEvent) => {
    if (!dialogRef.current || !isDragging.current) return
    const delta = startY.current - (e.pageY || e.touches?.[0].pageY)
    const newHeight = startHeight.current + (delta / window.innerHeight) * 100
    updateSheetHeight(newHeight)
  }

  const isFullScreen = sheetHeight?.current === 100

  return (
    <FullScreenContainer
      open={open}
      onMouseUp={dragStop}
      onMouseMove={dragging}
      onTouchEnd={dragStop}
      onTouchMove={dragStop}
    >
      <Overlay onClick={() => hideBottomSheet('overlay')}></Overlay>
      <Content ref={dialogRef} role={role} open={open} isFullScreen={isFullScreen} sx={sx}>
        <DraggableRegion onMouseDown={dragStart} onTouchStart={dragStart}>
          <DraggableRegionPill />
        </DraggableRegion>
        {children}
      </Content>
    </FullScreenContainer>
  )
})

const prefersReducedMotion = () => {
  const mediaQueryList = window.matchMedia('(prefers-reduced-motion: no-preference)')
  return !mediaQueryList.matches
}

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
  transition: 0.1s linear;
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
  margin-top: ${get('space.2')};
  display: block;
  background-color: ${get('colors.border.muted')};
  border-radius: 3px;
`

const DraggableRegion = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  z-index: 2;
  right: 0;
  left: 0;
  cursor: grab;
  user-select: none;
  &:hover ${DraggableRegionPill} {
    background-color: ${get('colors.border.default')};
  }
`
const Content = styled.div<
  {
    open: boolean
    isFullScreen: boolean
  } & SxProp
>`
  display: flex;
  flex-direction: column;
  background-color: ${get('colors.canvas.default')};
  height: 50vh;
  maxheight: 100vh;
  width: 100%;
  border-radius: ${props => (props.isFullScreen ? 0 : '12px 12px 0 0')};
  position: relative;
  overflow-x: hidden;
  overflow-y: ${props => (props.isFullScreen ? 'hidden' : 'auto')};
  transform: ${props => (props.open ? 'translateY(0%)' : 'translateY(100%)')};
  transition: 0.3s ease;
`
