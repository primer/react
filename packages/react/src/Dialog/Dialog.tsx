import React, {useCallback, useEffect, useRef, useState, type SyntheticEvent} from 'react'
import type {ButtonProps} from '../Button'
import {Button, IconButton} from '../Button'
import {useOnEscapePress, useProvidedRefOrCreate} from '../hooks'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {XIcon} from '@primer/octicons-react'
import {useFocusZone} from '../hooks/useFocusZone'
import {FocusKeys} from '@primer/behaviors'
import Portal from '../Portal'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import {useId} from '../hooks/useId'
import {ScrollableRegion} from '../ScrollableRegion'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

import classes from './Dialog.module.css'
import {clsx} from 'clsx'

/* Dialog Version 2 */

/**
 * Props that characterize a button to be rendered into the footer of
 * a Dialog.
 */
export type DialogButtonProps = Omit<ButtonProps, 'content'> & {
  /**
   * The variant of Button to use
   */
  buttonType?: 'default' | 'primary' | 'danger' | 'normal'

  /**
   * The Button's inner text
   */
  content: React.ReactNode

  /**
   * If true, and if this is the only button with autoFocus set to true,
   * focus this button automatically when the dialog appears.
   */
  autoFocus?: boolean

  /**
   * A reference to the rendered Button’s DOM node, used together with
   * `autoFocus` for `focusTrap`’s `initialFocus`.
   */
  ref?: React.RefObject<HTMLButtonElement>
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
  renderHeader?: React.FunctionComponent<React.PropsWithChildren<DialogHeaderProps>>

  /**
   * Provide a custom render function for the dialog body. This content is
   * rendered directly into the dialog body area, full bleed from edge to
   * edge, header to footer.
   *
   * Warning: using a custom renderer may violate Primer UX principles.
   */
  renderBody?: React.FunctionComponent<React.PropsWithChildren<DialogProps>>

  /**
   * Provide a custom render function for the dialog footer. This content is
   * rendered directly into the dialog footer area, full bleed from edge to
   * edge, end of the body element to bottom.
   *
   * Warning: using a custom renderer may violate Primer UX principles.
   */
  renderFooter?: React.FunctionComponent<React.PropsWithChildren<DialogProps>>

  /**
   * Specifies the buttons to be rendered in the Dialog footer.
   */
  footerButtons?: DialogButtonProps[]

  /**
   * This method is invoked when a gesture to close the dialog is used (either
   * an Escape key press, clicking the backdrop, or clicking the "X" in the top-right corner). The
   * gesture argument indicates the gesture that was used to close the dialog
   * ('close-button' or 'escape').
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
   * small: 296px
   * medium: 320px
   * large: 480px
   * xlarge: 640px
   */
  width?: DialogWidth

  /**
   * The height of the dialog.
   * small: 296x480
   * large: 480x640
   * auto: variable based on contents
   */
  height?: DialogHeight

  /**
   * The position of the dialog
   */
  position?: 'center' | 'left' | 'right' | ResponsiveValue<'left' | 'right' | 'bottom' | 'fullscreen' | 'center'>

  /**
   * Return focus to this element when the Dialog closes,
   * instead of the element that had focus immediately before the Dialog opened
   */
  returnFocusRef?: React.RefObject<HTMLElement>

  /**
   * The element to focus when the Dialog opens
   */
  initialFocusRef?: React.RefObject<HTMLElement>

  /**
   * Additional class names to apply to the dialog
   */
  className?: string
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const heightMap = {
  small: '480px',
  large: '640px',
  auto: 'auto',
} as const

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const widthMap = {
  small: '296px',
  medium: '320px',
  large: '480px',
  xlarge: '640px',
} as const

export type DialogWidth = keyof typeof widthMap
export type DialogHeight = keyof typeof heightMap

const DefaultHeader: React.FC<React.PropsWithChildren<DialogHeaderProps>> = ({
  dialogLabelId,
  title,
  subtitle,
  dialogDescriptionId,
  onClose,
}) => {
  const onCloseClick = useCallback(() => {
    onClose('close-button')
  }, [onClose])
  return (
    <Dialog.Header>
      <div className={classes.HeaderInner}>
        <div className={classes.HeaderContent}>
          <Dialog.Title id={dialogLabelId}>{title ?? 'Dialog'}</Dialog.Title>
          {subtitle && <Dialog.Subtitle id={dialogDescriptionId}>{subtitle}</Dialog.Subtitle>}
        </div>
        <Dialog.CloseButton onClose={onCloseClick} />
      </div>
    </Dialog.Header>
  )
}
const DefaultBody: React.FC<React.PropsWithChildren<DialogProps>> = ({children}) => {
  return <Dialog.Body>{children}</Dialog.Body>
}
const DefaultFooter: React.FC<React.PropsWithChildren<DialogProps>> = ({footerButtons}) => {
  const {containerRef: footerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest',
  })
  return footerButtons ? (
    <Dialog.Footer ref={footerRef as React.RefObject<HTMLDivElement>}>
      <Dialog.Buttons buttons={footerButtons} />
    </Dialog.Footer>
  ) : null
}

const defaultPosition = {
  narrow: 'center',
  regular: 'center',
}

const defaultFooterButtons: Array<DialogButtonProps> = []

const _Dialog = React.forwardRef<HTMLDivElement, React.PropsWithChildren<DialogProps>>((props, forwardedRef) => {
  const {
    title = 'Dialog',
    subtitle = '',
    renderHeader,
    renderBody,
    renderFooter,
    onClose,
    role = 'dialog',
    width = 'xlarge',
    height = 'auto',
    footerButtons = defaultFooterButtons,
    position = defaultPosition,
    returnFocusRef,
    initialFocusRef,
    className,
  } = props
  const dialogLabelId = useId()
  const dialogDescriptionId = useId()
  const autoFocusedFooterButtonRef = useRef<HTMLButtonElement>(null)
  for (const footerButton of footerButtons) {
    if (footerButton.autoFocus) {
      // eslint-disable-next-line react-compiler/react-compiler
      footerButton.ref = autoFocusedFooterButtonRef
    }
  }
  const [lastMouseDownIsBackdrop, setLastMouseDownIsBackdrop] = useState<boolean>(false)
  const defaultedProps = {...props, title, subtitle, role, dialogLabelId, dialogDescriptionId}
  const onBackdropClick = useCallback(
    (e: SyntheticEvent) => {
      if (e.target === e.currentTarget && lastMouseDownIsBackdrop) {
        onClose('escape')
      }
    },
    [onClose, lastMouseDownIsBackdrop],
  )

  const dialogRef = useRef<HTMLDivElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, dialogRef)
  const backdropRef = useRef<HTMLDivElement>(null)

  useFocusTrap({
    containerRef: dialogRef,
    initialFocusRef: initialFocusRef ?? autoFocusedFooterButtonRef,
    restoreFocusOnCleanUp: returnFocusRef?.current ? false : true,
    returnFocusRef,
  })

  useOnEscapePress(
    (event: KeyboardEvent) => {
      onClose('escape')
      event.preventDefault()
    },
    [onClose],
  )

  React.useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.body.clientWidth
    // If the dialog is rendered, we add a class to the dialog element to disable
    dialogRef.current?.classList.add(classes.DisableScroll)
    // and set a CSS variable to the scrollbar width so that the dialog can
    // account for the scrollbar width when calculating its width.
    document.body.style.setProperty('--prc-dialog-scrollgutter', `${scrollbarWidth}px`)
  }, [])

  const header = (renderHeader ?? DefaultHeader)(defaultedProps)
  const body = (renderBody ?? DefaultBody)(defaultedProps)
  const footer = (renderFooter ?? DefaultFooter)(defaultedProps)
  const positionDataAttributes =
    typeof position === 'string'
      ? {'data-position-regular': position}
      : Object.fromEntries(
          Object.entries(position).map(([key, value]) => {
            return [`data-position-${key}`, value]
          }),
        )

  return (
    <>
      <Portal>
        <div
          ref={backdropRef}
          className={classes.Backdrop}
          {...positionDataAttributes}
          onClick={onBackdropClick}
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
            setLastMouseDownIsBackdrop(e.target === e.currentTarget)
          }}
        >
          <div
            ref={dialogRef}
            role={role}
            aria-labelledby={dialogLabelId}
            aria-describedby={dialogDescriptionId}
            aria-modal
            {...positionDataAttributes}
            data-width={width}
            data-height={height}
            className={clsx(className, classes.Dialog)}
          >
            {header}
            <ScrollableRegion aria-labelledby={dialogLabelId} className={classes.DialogOverflowWrapper}>
              {body}
            </ScrollableRegion>
            {footer}
          </div>
        </div>
      </Portal>
    </>
  )
})
_Dialog.displayName = 'Dialog'

// @ts-ignore -- TS doesn't know about the __SLOT__ property
_Dialog.__SLOT__ = Symbol('Dialog')

type StyledHeaderProps = React.ComponentProps<'div'>

const Header = React.forwardRef<HTMLDivElement, StyledHeaderProps>(function Header({className, ...rest}, forwardRef) {
  return <div ref={forwardRef} className={clsx(className, classes.Header)} {...rest} />
})
Header.displayName = 'Dialog.Header'

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Header.__SLOT__ = Symbol('Dialog.Header')

type StyledTitleProps = React.ComponentProps<'h1'>

const Title = React.forwardRef<HTMLHeadingElement, StyledTitleProps>(function Title({className, ...rest}, forwardRef) {
  return <h1 ref={forwardRef} className={clsx(className, classes.Title)} {...rest} />
})
Title.displayName = 'Dialog.Title'

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Title.__SLOT__ = Symbol('Dialog.Title')

type StyledSubtitleProps = React.ComponentProps<'h2'>

const Subtitle = React.forwardRef<HTMLHeadingElement, StyledSubtitleProps>(function Subtitle(
  {className, ...rest},
  forwardRef,
) {
  return <h2 ref={forwardRef} className={clsx(className, classes.Subtitle)} {...rest} />
})
Subtitle.displayName = 'Dialog.Subtitle'

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Subtitle.__SLOT__ = Symbol('Dialog.Subtitle')

type StyledBodyProps = React.ComponentProps<'div'>

const Body = React.forwardRef<HTMLDivElement, StyledBodyProps>(function Body({className, ...rest}, forwardRef) {
  return <div ref={forwardRef} className={clsx(className, classes.Body)} {...rest} />
}) as PolymorphicForwardRefComponent<'div', StyledBodyProps>

Body.displayName = 'Dialog.Body'

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Body.__SLOT__ = Symbol('Dialog.Body')

type StyledFooterProps = React.ComponentProps<'div'>

const Footer = React.forwardRef<HTMLDivElement, StyledFooterProps>(function Footer({className, ...rest}, forwardRef) {
  return <div ref={forwardRef} className={clsx(className, classes.Footer)} {...rest} />
})
Footer.displayName = 'Dialog.Footer'

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Footer.__SLOT__ = Symbol('Dialog.Footer')

const Buttons: React.FC<React.PropsWithChildren<{buttons: DialogButtonProps[]}>> = ({buttons}) => {
  const autoFocusRef = useProvidedRefOrCreate<HTMLButtonElement>(buttons.find(button => button.autoFocus)?.ref)
  let autoFocusCount = 0
  const [hasRendered, setHasRendered] = useState(0)
  useEffect(() => {
    // hack to work around dialogs originating from other focus traps.
    if (hasRendered === 1) {
      autoFocusRef.current?.focus()
    } else {
      setHasRendered(hasRendered + 1)
    }
  }, [autoFocusRef, hasRendered])

  return (
    <>
      {buttons.map((dialogButtonProps, index) => {
        const {content, buttonType = 'default', autoFocus = false, ...buttonProps} = dialogButtonProps
        return (
          <Button
            key={index}
            {...buttonProps}
            // 'normal' value is equivalent to 'default', this is used for backwards compatibility
            variant={buttonType === 'normal' ? 'default' : buttonType}
            ref={autoFocus && autoFocusCount === 0 ? (autoFocusCount++, autoFocusRef) : null}
          >
            {content}
          </Button>
        )
      })}
    </>
  )
}

const CloseButton: React.FC<React.PropsWithChildren<{onClose: () => void}>> = ({onClose}) => {
  return <IconButton icon={XIcon} aria-label="Close" onClick={onClose} variant="invisible" />
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
  CloseButton,
})
