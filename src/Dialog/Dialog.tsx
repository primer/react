import React, {useCallback, useRef} from 'react'
import styled from 'styled-components'
import {Button, ButtonPrimary, ButtonDanger, ButtonProps, Flex, Box} from '..'
import {get, SystemCommonProps, SystemPositionProps, COMMON, POSITION} from '../constants'
import {useAnchoredPosition, useOnEscapePress} from '../hooks'
import {useFocusTrap} from '../hooks/useFocusTrap'
import sx, {SxProp} from '../sx'
import StyledOcticon from '../StyledOcticon'
import {XIcon} from '@primer/octicons-react'
import {useFocusZone} from '../hooks/useFocusZone'
import {FocusKeys} from '../behaviors/focusZone'
import Portal from '../Portal'
import {uniqueId} from '../utils/uniqueId'

const ANIMATION_DURATION = '200ms'

/**
 * Props that characterize a button to be rendered into the footer of
 * a Dialog.
 */
export type DialogButtonProps = ButtonProps & {
  /**
   * The type of Button element to use
   */
  element?: typeof Button | typeof ButtonPrimary | typeof ButtonDanger

  /**
   * The Button's inner text
   */
  text: string
}

/**
 * Props to customize the rendering of the Dialog.
 */
export interface DialogProps {
  /**
   * Title of the Dialog. Also serves as the aria-label for this Dialog.
   */
  title?: string | JSX.Element

  /**
   * The Dialog's subtitle. Optional. Rendered below the title in smaller
   * type with less contrast. Also serves as the aria-describedby for this
   * Dialog.
   */
  subtitle?: string | JSX.Element

  /**
   * Provide a custom renderer for the dialog header. This content is
   * rendered directly into the dialog body area, full bleed from edge
   * to edge, top to the start of the body element.
   *
   * Warning: using a custom renderer may violate Primer UX principles.
   */
  renderHeader?: React.FunctionComponent<DialogProps & {dialogLabelId: string; dialogDescriptionId: string}>

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
   * an Escape key press or clicking the "X" in the top-right corner).
   */
  onClose: () => void

  /**
   * Default: "dialog". The ARIA role to assign to this dialog.
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/#alertdialog
   */
  role?: 'dialog' | 'alertdialog'
}

const Backdrop = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: black;
  animation: dialog-backdrop-appear ${ANIMATION_DURATION} ${get('animation.easeOutCubic')};
  opacity: 0.4;

  @keyframes dialog-backdrop-appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.4;
    }
  }
`

const heightMap = {
  sm: '480px',
  md: '640px',
  auto: 'auto'
}

const widthMap = {
  sm: '296px',
  md: '320px',
  lg: '480px',
  xl: '640px',
  auto: 'auto'
}

interface StyledDialogProps {
  width?: keyof typeof widthMap
  height?: keyof typeof heightMap
  visibility?: 'visible' | 'hidden'
}

const StyledDialog = styled.div<StyledDialogProps & SystemCommonProps & SystemPositionProps & SxProp>`
  display: flex;
  flex-direction: column;
  background-color: ${get('colors.bg.overlay')};
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 8px 24px rgba(149, 157, 165, 0.2);
  position: absolute;
  min-width: 296px;
  max-width: 640px;
  min-height: 480px;
  max-height: 640px;
  width: ${props => widthMap[props.width ?? 'auto']};
  height: ${props => heightMap[props.height ?? 'auto']};
  border-radius: 12px;
  overflow: hidden;
  animation: ${props =>
    // only apply the animation when the dialog becomes visible
    props.visibility === 'hidden'
      ? 'none'
      : `overlay--dialog-appear ${ANIMATION_DURATION} ${get('animation.easeOutCubic')(props)}`};

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

  visibility: ${props => props.visibility};
  ${COMMON};
  ${POSITION};
  ${sx};
`

const _Dialog: React.FC<DialogProps> = React.forwardRef((props, forwardedRef) => {
  const {
    title = 'Dialog',
    subtitle = '',
    renderHeader,
    renderBody,
    renderFooter,
    footerButtons,
    onClose,
    children,
    role = 'dialog'
  } = props
  const dialogLabelId = uniqueId()
  const dialogDescriptionId = uniqueId()
  const defaultedProps = {...props, title, subtitle, role, dialogLabelId, dialogDescriptionId}

  const dialogRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  useFocusTrap({containerRef: dialogRef})
  const {position} = useAnchoredPosition({
    side: 'inside-center',
    align: 'center',
    anchorElementRef: backdropRef,
    floatingElementRef: dialogRef
  })
  const {containerRef: footerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest'
  })

  const callback = useCallback(
    (event: KeyboardEvent) => {
      onClose()
      event.preventDefault()
    },
    [onClose]
  )
  useOnEscapePress(callback)

  const header = renderHeader?.(defaultedProps) ?? (
    <Dialog.Header>
      <Flex>
        <Flex pt={2} flexDirection="column" flexGrow={1}>
          <Dialog.Title id={dialogLabelId}>{title ?? 'Dialog'}</Dialog.Title>
          {subtitle && <Dialog.Subtitle id={dialogDescriptionId}>{subtitle}</Dialog.Subtitle>}
        </Flex>
        <Dialog.CloseButton onClose={onClose} />
      </Flex>
    </Dialog.Header>
  )
  const body = renderBody?.(defaultedProps) ?? <Dialog.Body>{children}</Dialog.Body>
  const footer =
    renderFooter?.(defaultedProps) ??
    (footerButtons && (
      <Dialog.Footer ref={footerRef as React.RefObject<HTMLDivElement>}>
        <Dialog.Buttons buttons={footerButtons} />
      </Dialog.Footer>
    ))

  return (
    <>
      <Portal>
        <Backdrop ref={backdropRef}></Backdrop>
        <StyledDialog
          {...position}
          visibility={position ? 'visible' : 'hidden'}
          ref={dialogRef}
          role={role}
          aria-labelledby={dialogLabelId}
          aria-describedby={dialogDescriptionId}
        >
          {header}
          {body}
          {footer}
        </StyledDialog>
      </Portal>
    </>
  )
})

const Header = styled(Box).attrs({as: 'header'})`
  box-shadow: 0 1px 0 ${get('colors.border.overlay')};
  padding: 6px 6px 14px ${get('space.3')};
  z-index: 1;
`
const Title = styled(Box)`
  font-size: ${get('fontSizes.1')};
  font-weight: 700;
`
const Subtitle = styled(Box)`
  font-size: ${get('fontSizes.0')};
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
  justify-content: flex-end;
  z-index: 1;
`
const Buttons: React.FC<{buttons: DialogButtonProps[]}> = ({buttons}) => {
  return (
    <>
      {buttons.map((dialogButtonProps, index) => {
        const {text, element: Element = Button, ...buttonProps} = dialogButtonProps
        return (
          <Element key={index} ml={index === 0 ? 0 : 1} {...buttonProps}>
            {text}
          </Element>
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
    <DialogCloseButton onClick={onClose}>
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
