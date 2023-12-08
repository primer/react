import React, {useEffect, useRef, PropsWithChildren, MouseEvent, TouchEvent} from 'react'
import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import {get} from '../constants'
import Box from '../Box'

/**
 * Props to customize the rendering of the Dialog.
 */
export interface DialogActionSheetProps extends SxProp {
  /**
   * Sets the visibility op the dialog
   */
  open: boolean

  /**
   * This method is invoked when a gesture to close the dialog is used
   */
  onClose: (gesture: 'close-button' | 'escape' | 'drag' | 'overlay') => void
}

type DialogActionSheetPropsChildren = PropsWithChildren<DialogActionSheetProps>

const DialogActionSheet = React.forwardRef<HTMLDivElement, DialogActionSheetPropsChildren>((props, forwardedRef) => {
  const {open, onClose, children, sx} = props

  const dialogRef = useRef<HTMLDivElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, dialogRef)

  // Refs
  let dragIconRef = useRef()

  // Variables
  let startY = useRef(0)
  let startHeight = useRef(0)
  let isDragging = useRef(false)
  let sheetHeight = useRef(0)

  const showBottomSheet = () => {
    updateSheetHeight(50)
    document.body.style.overflowY = 'hidden'
  }
  const hideBottomSheet = (gesture: 'close-button' | 'escape' | 'drag' | 'overlay') => {
    onClose(gesture)
    document.body.style.overflowY = 'auto'
  }

  const updateSheetHeight = (height: number) => {
    if (!dialogRef.current) return
    dialogRef.current.style.height = `${height}vh`
  }

  const dragStop = () => {
    if (!dialogRef.current) return

    isDragging.current = false
    const sheetHeight = parseInt(dialogRef.current?.style.height ?? 0)
    dialogRef.current.style.transition = '0.3s ease'

    if (sheetHeight < 25) {
      return hideBottomSheet('drag')
    }

    if (sheetHeight > 75) {
      return updateSheetHeight(90)
    }

    updateSheetHeight(50)
  }
  const dragStart = (e: MouseEvent | TouchEvent) => {
    if (!dialogRef.current) return

    console.log('drag start')
    startY.current = e.pageY || e.touches?.[0].pageY
    startHeight.current = parseInt(dialogRef.current?.style.height ?? 0)
    isDragging.current = true
    dialogRef.current.style.transition = 'none'
  }

  const dragging = (e: MouseEvent) => {
    if (!dialogRef.current) return
    if (!isDragging.current) return
    const delta = startY.current - (e.pageY || e.touches?.[0].pageY)
    const newHeight = startHeight.current + (delta / window.innerHeight) * 100
    updateSheetHeight(newHeight)
  }

  useEffect(() => {
    showBottomSheet()
  }, [showBottomSheet])

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
      <Content ref={dialogRef} open={open} isFullScreen={isFullScreen}>
        <DraggableRegion onMouseDown={dragStart} onTouchStart={dragStart}>
          <DraggableRegionPill />
        </DraggableRegion>
        {children}
      </Content>
    </FullScreenContainer>
  )
})

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

const Content = styled.div<{open: boolean; isFullScreen: boolean}>`
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
`

export default DialogActionSheet
