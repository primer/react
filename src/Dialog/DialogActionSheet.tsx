import React, {useEffect, useRef, PropsWithChildren, MouseEvent, TouchEvent} from 'react'
import Box from '../Box'
import {SxProp} from '../sx'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'

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

  // Accessibility
  const isReduced =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true

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
    dialogRef.current.style.height = `${height}vh` // updates the height of the sheet content
  }

  const dragStop = () => {
    if (!dialogRef.current) return

    isDragging.current = false
    const sheetHeight = parseInt(dialogRef.current?.style.height ?? 0)
    dialogRef.current.style.transition = isReduced ? 'none' : '0.3s ease'

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
    <Box
      id="bottom-sheet"
      onMouseUp={dragStop}
      onMouseMove={dragging}
      onTouchEnd={dragStop}
      onTouchMove={dragStop}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        transition: isReduced ? 'none' : '0.1s linear',
      }}
    >
      <Box
        id="sheet-overlay"
        onClick={() => hideBottomSheet('overlay')}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          width: '100%',
          height: '100%',
          bg: 'primer.canvas.backdrop',
        }}
      ></Box>
      <Box
        id="content"
        ref={dialogRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bg: 'canvas.default',
          height: '50vh',
          maxHeight: '100vh',
          width: '100%',
          borderRadius: isFullScreen ? 0 : '12px 12px 0 0',
          overflowY: isFullScreen && 'hidden',
          overflowX: 'hidden',
          position: 'relative',
          transform: open ? 'translateY(0%)' : 'translateY(100%)',
          ...sx,
        }}
      >
        <Box
          id="header"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            zIndex: 2,
            right: 0,
            left: 0,
          }}
        >
          <Box
            onMouseDown={dragStart}
            onTouchStart={dragStart}
            sx={{
              cursor: 'grab',
              userSelect: 'none',
              'span:hover': {
                bg: 'border.default',
              },
            }}
          >
            <Box
              as="span"
              sx={{
                height: 6,
                width: 70,
                mt: 2,
                display: 'block',
                bg: 'border.muted',
                borderRadius: 3,
              }}
            ></Box>
          </Box>
        </Box>

        {children}
      </Box>
    </Box>
  )
})

export default DialogActionSheet
