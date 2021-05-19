import React, {useCallback, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Button, {ButtonPrimary, ButtonDanger, ButtonProps} from '../Button'
import Flex from '../Flex'
import Box from '../Box'
import {get, SystemCommonProps, SystemPositionProps, COMMON, POSITION} from '../constants'
import {useOnEscapePress} from '../hooks'
import {useFocusTrap} from '../hooks/useFocusTrap'
import sx, {SxProp} from '../sx'
import StyledOcticon from '../StyledOcticon'
import {XIcon} from '@primer/octicons-react'
import {useFocusZone} from '../hooks/useFocusZone'
import {FocusKeys} from '../behaviors/focusZone'
import Portal from '../Portal'
import {uniqueId} from '../utils/uniqueId'
import {useCombinedRefs} from '../hooks/useCombinedRefs'

const ANIMATION_DURATION = '200ms'

/**
 * Props that characterize a button to be rendered into the footer of
 * a Dialog.
 */
export type DialogButtonProps = ButtonProps & {
  /**
   * The type of Button element to use
   */
  buttonType?: 'normal' | 'primary' | 'danger'

  /**
   * The Button's inner text
   */
  content: React.ReactNode

  /**
   * If true, and if this is the only button with autoFocus set to true,
   * focus this button automatically when the dialog appears.
   */
  autoFocus?: boolean
}

/**
 * Props to customize the rendering of the Dialog.
 */
export interface DialogProps {
  /**
   * Title of the Dialog. Also serves as the aria-label for this Dialog.
   */
  title?: React.ReactNode

  /**
   * The Dialog's subtitle. Optional. Rendered below the title in smaller
   * type with less contrast. Also serves as the aria-describedby for this
   * Dialog.
   */
  subtitle?: React.ReactNode

  /**
   * Provide a custom renderer for the dialog header. This content is
   * rendered directly into the dialog body area, full bleed from edge
   * to edge, top to the start of the body element.
   *
   * Warning: using a custom renderer may violate Primer UX principles.
   */
  renderHeader?: React.FunctionComponent<DialogHeaderProps>

  /**
   * Provide a custom render function for the dialog body. This content is
   * rendered directly into the dialog body area, full bleed from edge to
   * edge, header to footer.
   *
   * Warning: using a custom renderer may violate Primer UX principles.
   */
  renderBody?: React.FunctionComponent<DialogProps>

  /**
   * Provide a custom render function for the dialog footer. This content is
   * rendered directly into the dialog footer area, full bleed from edge to
   * edge, end of the body element to bottom.
   *
   * Warning: using a custom renderer may violate Primer UX principles.
   */
  renderFooter?: React.FunctionComponent<DialogProps>

  /**
   * Specifies the buttons to be rendered in the Dialog footer.
   */
  footerButtons?: DialogButtonProps[]

  /**
   * This method is invoked when a gesture to close the dialog is used (either
   * an Escape key press or clicking the "X" in the top-right corner). The
   * gesture argument indicates the gesture that was used to close the dialog
   * (either 'close-button' or 'escape').
   */
  onClose: (gesture: 'close-button' | 'escape') => void

  /**
   * Default: "dialog". The ARIA role to assign to this dialog.
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/#alertdialog
   */
  role?: 'dialog' | 'alertdialog'

  /**
   * The width of the dialog.
   * sm: 296px
   * md: 320px
   * lg: 480px
   * xl: 640px
   */
  width?: DialogWidth

  /**
   * The height of the dialog.
   * sm: 296x480
   * lg: 480x640
   * auto: variable based on contents
   */
  height?: DialogHeight
}

/**
 * Props that are passed to a component that serves as a dialog header
 */
export interface DialogHeaderProps extends DialogProps {
  /**
   * ID of the element that will be used as the `aria-labelledby` attribute on the
   * dialog. This ID should be set to the element that renders the dialog's title.
   */
  dialogLabelId: string

  /**
   * ID of the element that will be used as the `aria-describedby` attribute on the
   * dialog. This ID should be set to the element that renders the dialog's subtitle.
   */
  dialogDescriptionId: string
}

const Backdrop = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  animation: dialog-backdrop-appear ${ANIMATION_DURATION} ${get('animation.easeOutCubic')};

  @keyframes dialog-backdrop-appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const heightMap = {
  sm: '480px',
  lg: '640px',
  auto: 'auto'
} as const

const widthMap = {
  sm: '296px',
  md: '320px',
  lg: '480px',
  xl: '640px'
} as const

export type DialogWidth = keyof typeof widthMap
export type DialogHeight = keyof typeof heightMap

interface StyledDialogProps {
  width?: DialogWidth
  height?: DialogHeight
}

const StyledDialog = styled.div<StyledDialogProps & SystemCommonProps & SystemPositionProps & SxProp>`
  display: flex;
  flex-direction: column;
  background-color: ${get('colors.bg.overlay')};
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 8px 24px rgba(149, 157, 165, 0.2);
  min-width: 296px;
  max-width: calc(100vw - 64px);
  max-height: calc(100vh - 64px);
  width: ${props => widthMap[props.width ?? ('xl' as const)]};
  height: ${props => heightMap[props.height ?? ('auto' as const)]};
  border-radius: 12px;
  opacity: 1;
  animation: overlay--dialog-appear ${ANIMATION_DURATION} ${get('animation.easeOutCubic')};

  @keyframes overlay--dialog-appear {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  ${COMMON};
  ${POSITION};
  ${sx};
`

const DefaultHeader: React.FC<DialogHeaderProps> = ({dialogLabelId, title, subtitle, dialogDescriptionId, onClose}) => {
  const onCloseClick = useCallback(() => {
    onClose('close-button')
  }, [onClose])
  return (
    <Dialog.Header>
      <Flex>
        <Flex px={2} py="6px" flexDirection="column" flexGrow={1}>
          <Dialog.Title id={dialogLabelId}>{title ?? 'Dialog'}</Dialog.Title>
          {subtitle && <Dialog.Subtitle id={dialogDescriptionId}>{subtitle}</Dialog.Subtitle>}
        </Flex>
        <Dialog.CloseButton onClose={onCloseClick} />
      </Flex>
    </Dialog.Header>
  )
}
const DefaultBody: React.FC<DialogProps> = ({children}) => {
  return <Dialog.Body>{children}</Dialog.Body>
}
const DefaultFooter: React.FC<DialogProps> = ({footerButtons}) => {
  const {containerRef: footerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest'
  })
  return footerButtons ? (
    <Dialog.Footer ref={footerRef as React.RefObject<HTMLDivElement>}>
      <Dialog.Buttons buttons={footerButtons} />
    </Dialog.Footer>
  ) : null
}

const _Dialog = React.forwardRef<HTMLDivElement, React.PropsWithChildren<DialogProps>>((props, forwardedRef) => {
  const {
    title = 'Dialog',
    subtitle = '',
    renderHeader,
    renderBody,
    renderFooter,
    onClose,
    role = 'dialog',
    width = 'xl',
    height = 'auto'
  } = props
  const dialogLabelId = uniqueId()
  const dialogDescriptionId = uniqueId()
  const defaultedProps = {...props, title, subtitle, role, dialogLabelId, dialogDescriptionId}

  const dialogRef = useRef<HTMLDivElement>(null)
  const combinedRef = useCombinedRefs(dialogRef, forwardedRef)
  const backdropRef = useRef<HTMLDivElement>(null)
  useFocusTrap({containerRef: dialogRef, restoreFocusOnCleanUp: true})

  useOnEscapePress(
    (event: KeyboardEvent) => {
      onClose('escape')
      event.preventDefault()
    },
    [onClose]
  )

  const header = (renderHeader ?? DefaultHeader)(defaultedProps)
  const body = (renderBody ?? DefaultBody)(defaultedProps)
  const footer = (renderFooter ?? DefaultFooter)(defaultedProps)

  return (
    <>
      <Portal>
        <Backdrop ref={backdropRef}>
          <StyledDialog
            width={width}
            height={height}
            ref={combinedRef}
            role={role}
            aria-labelledby={dialogLabelId}
            aria-describedby={dialogDescriptionId}
          >
            {header}
            {body}
            {footer}
          </StyledDialog>
        </Backdrop>
      </Portal>
    </>
  )
})
_Dialog.displayName = 'Dialog'

const Header = styled(Box).attrs({as: 'header'})`
  box-shadow: 0 1px 0 ${get('colors.border.overlay')};
  padding: ${get('space.2')};
  z-index: 1;
  flex-shrink: 0;
`
const Title = styled(Box)`
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
`
const Subtitle = styled(Box)`
  font-size: ${get('fontSizes.0')};
  margin-top: ${get('space.1')};
  color: ${get('colors.text.tertiary')};
`
const Body = styled(Box)`
  flex-grow: 1;
  overflow: auto;
  padding: ${get('space.3')};
`
const Footer = styled(Box).attrs({as: 'footer'})`
  box-shadow: 0 -1px 0 ${get('colors.border.overlay')};
  padding: ${get('space.3')};
  display: flex;
  flex-flow: wrap;
  justify-content: flex-end;
  z-index: 1;
  flex-shrink: 0;

  button {
    margin-left: ${get('space.1')};
    &:first-child {
      margin-left: 0;
    }
  }
`
const buttonTypes = {
  normal: Button,
  primary: ButtonPrimary,
  danger: ButtonDanger
}
const Buttons: React.FC<{buttons: DialogButtonProps[]}> = ({buttons}) => {
  const autoFocusRef = useRef<HTMLButtonElement>(null)
  let autoFocusCount = 0
  const [hasRendered, setHasRendered] = useState(0)
  useEffect(() => {
    // hack to work around dialogs originating from other focus traps.
    if (hasRendered === 1) {
      autoFocusRef.current?.focus()
    } else {
      setHasRendered(hasRendered + 1)
    }
  }, [hasRendered])

  return (
    <>
      {buttons.map((dialogButtonProps, index) => {
        const {content, buttonType = 'normal', autoFocus = false, ...buttonProps} = dialogButtonProps
        const ButtonElement = buttonTypes[buttonType]
        return (
          <ButtonElement
            key={index}
            {...buttonProps}
            ref={autoFocus && autoFocusCount === 0 ? (autoFocusCount++, autoFocusRef) : null}
          >
            {content}
          </ButtonElement>
        )
      })}
    </>
  )
}
const DialogCloseButton = styled(Button)`
  border-radius: 4px;
  background: transparent;
  border: 0;
  vertical-align: middle;
  color: ${get('colors.text.secondary')};
  padding: ${get('space.2')};
  align-self: flex-start;
  line-height: normal;
  box-shadow: none;
`
const CloseButton: React.FC<{onClose: () => void}> = ({onClose}) => {
  return (
    <DialogCloseButton aria-label="Close" onClick={onClose}>
      <StyledOcticon icon={XIcon} />
    </DialogCloseButton>
  )
}

/**
 * A dialog is a type of overlay that can be used for confirming actions, asking
 * for disambiguation, and presenting small forms. They generally allow the user
 * to focus on a quick task without having to navigate to a different page.
 *
 * Dialogs appear in the page after a direct user interaction. Don't show dialogs
 * on page load or as system alerts.
 *
 * Dialogs appear centered in the page, with a visible backdrop that dims the rest
 * of the window for focus.
 *
 * All dialogs have a title and a close button.
 *
 * Dialogs are modal. Dialogs can be dismissed by clicking on the close button,
 * pressing the escape key, or by interacting with another button in the dialog.
 * To avoid losing information and missing important messages, clicking outside
 * of the dialog will not close it.
 *
 * The sub components provided (e.g. Header, Title, etc.) are available for custom
 * renderers only. They are not intended to be used otherwise.
 */
export const Dialog = Object.assign(_Dialog, {
  Header,
  Title,
  Subtitle,
  Body,
  Footer,
  Buttons,
  CloseButton
})
