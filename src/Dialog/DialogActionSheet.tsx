import React, {
  useEffect,
  useRef,
  useState,
  PropsWithChildren,
  MouseEvent,
  TouchEvent,
  KeyboardEvent,
  FormEventHandler,
} from 'react'
import styled from 'styled-components'
import {SxProp} from '../sx'
import VisuallyHidden from '../_VisuallyHidden'
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

  // 📏 SIZES

  const fullHeight = 90
  const halfHeight = 50

  // 🔄 STATES

  const [open, setIsOpen] = useState<boolean>(false)
  const [fireDelayedOnClose, setFireDelayedOnClose] = useState<
    'close-button' | 'escape' | 'drag' | 'overlay' | undefined
  >()

  // 📎 REFERENCES

  let dialogRef = useRef<HTMLDivElement>(null)
  let startY = useRef(0)
  let startHeight = useRef(0)
  let isDragging = useRef(false)
  let sheetHeight = useRef(0)

  useRefObjectAsForwardedRef(forwardedRef, dialogRef)

  // 🧑‍🦽 ACCESSIBILITY

  const isReduced = prefersReducedMotion()

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
    const sheetHeight = parseInt(dialogRef.current.style.height)

    const isReduced = prefersReducedMotion()
    dialogRef.current.style.transition = isReduced ? 'none' : '0.3s ease'

    if (sheetHeight < 25) return hideBottomSheet('drag')
    if (sheetHeight > 75) return updateSheetHeight(fullHeight)

    updateSheetHeight(halfHeight)
  }

  const dragStart = (e: MouseEvent | TouchEvent) => {
    if (!dialogRef.current) return

    if (e.type === 'touchstart' && 'touches' in e) {
      startY.current = e.touches[0].pageY ?? 0
    } else if ('clientX' in e) {
      startY.current = e.pageY
    }

    startHeight.current = parseInt(dialogRef.current?.style.height ?? 0)
    isDragging.current = true
    dialogRef.current.style.transition = 'none'
  }

  const dragging = (e: MouseEvent | TouchEvent) => {
    if (!dialogRef.current || !isDragging.current) return

    var pageY
    if (e.type === 'touchstart' && 'touches' in e) {
      pageY = e.touches[0].pageY
    } else if ('clientX' in e) {
      pageY = e.pageY
    }

    const delta = startY.current - (pageY || 0)
    const newHeight = startHeight.current + (delta / window.innerHeight) * 100
    updateSheetHeight(newHeight)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const height = dialogRef.current?.style.height ?? '0'
    const sheetHeight = parseInt(height)

    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      if (sheetHeight === halfHeight) {
        e.preventDefault()
        return updateSheetHeight(fullHeight)
      }
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      if (sheetHeight === fullHeight) {
        e.preventDefault()
        return updateSheetHeight(halfHeight)
      }

      if (sheetHeight === halfHeight) {
        e.preventDefault()
        return hideBottomSheet('drag')
      }
    }
  }

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
  }, [showBottomSheet])

  const isFullScreen = sheetHeight?.current === 100
  const currentHeight = sheetHeight?.current ?? 0

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
        <DraggableRegion
          onMouseDown={dragStart}
          onTouchStart={dragStart}
          onKeyDown={onKeyDown}
          role="slider"
          aria-label="Draggable dialog height resizer"
          aria-valuemin={halfHeight}
          aria-valuemax={fullHeight}
          aria-valuenow={currentHeight}
          aria-valuetext={`Dialog height ${currentHeight}% of the screen`}
        >
          <DraggableRegionPill />
        </DraggableRegion>
        {children}
        <HiddenAccessibilityForm
          onSubmit={size => {
            if (size === 'small') {
              updateSheetHeight(halfHeight)
            } else {
              updateSheetHeight(fullHeight)
            }
          }}
        />
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
  display: block;
  background-color: ${get('colors.border.muted')};
  border-radius: 3px;
`

const DraggableRegion = styled.button`
  display: flex;
  justify-content: center;
  border: none;
  position: absolute;
  background: transparent;
  top: 0;
  z-index: 2;
  right: 0;
  left: 0;
  padding-top: ${get('space.2')};
  padding-bottom: ${get('space.2')};
  cursor: grab;
  user-select: none;
  &:hover ${DraggableRegionPill} {
    background-color: ${get('colors.border.default')};
  }
  &:focus {
    outline: none;
  }
  &:focus-visible:not([disabled]) {
    outline: 2px solid;
    outline-offset: -${get('space.1')};
    border-top-left-radius: 11px;
    border-top-right-radius: 11px;
    outline-color: ${get('colors.accent.emphasis')};
  },
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

// 🧑‍🦽 Accessibility

const prefersReducedMotion = () => {
  const mediaQueryList = window.matchMedia('(prefers-reduced-motion: no-preference)')
  return !mediaQueryList.matches
}

interface HiddenAccessibilityFormCallbackProps extends HTMLFormElement {
  dialogSize: HTMLInputElement
}

interface HiddenAccessibilityFormProps {
  onSubmit: (size: 'small' | 'large') => void
}

const HiddenAccessibilityForm = ({onSubmit}: HiddenAccessibilityFormProps) => {
  const name = 'dialog-size'
  const handleSubmit: FormEventHandler<HiddenAccessibilityFormCallbackProps> = e => {
    e.preventDefault()
    const sizeValue = e.currentTarget[name].value
    onSubmit(sizeValue)
  }

  return (
    <VisuallyHidden>
      <form onSubmit={handleSubmit}>
        <h3>Dialog size</h3>
        <fieldset>
          <legend>Please select your prefered dialog size?</legend>
          <input type="radio" name={name} value="small" id="small" defaultChecked={true} />
          <label htmlFor="small">Small</label>
          <input type="radio" name={name} value="large" id="large" />
          <label htmlFor="large">Large</label>
        </fieldset>
        <button type="submit">Change dialog size</button>
      </form>
    </VisuallyHidden>
  )
}
