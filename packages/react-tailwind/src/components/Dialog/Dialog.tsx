'use client'

import {Dialog as BaseDialog} from '@base-ui/react/dialog'
import React from 'react'
import {CloseIconButton, type CloseIconButtonProps} from '../../internal/CloseIconButton'
import {cn} from '../../internal/cn'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {mergeClassName} from '../../internal/mergeClassName'
import {mergeStyle} from '../../internal/mergeStyle'
import {usePortalContainer} from '../../internal/portalRoot'
import {assignRef} from '../../internal/refs'
import {useOverflow} from '../ScrollableRegion/useOverflow'
import {
  getDialogPosition,
  getDialogSize,
  type DialogAlign,
  type DialogHeight,
  type DialogPosition,
  type DialogWidth,
} from './dialogLayout'

const popupClassName =
  'flex flex-col overflow-hidden rounded-lg bg-[var(--overlay-bgColor)] font-sans text-default leading-normal shadow-floating-sm outline-none contrast-more:border-current data-[closed]:hidden data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition motion-safe:duration-200 motion-reduce:transition-none'

export type DialogRootProps = BaseDialog.Root.Props

const DialogContext = React.createContext<Pick<DialogRootProps, 'modal'>>({modal: true})
const PopupMarkerContext = React.createContext('Dialog.Popup')

const Root = ({children, modal = true, ...rest}: DialogRootProps) => (
  <DialogContext.Provider value={{modal}}>
    <BaseDialog.Root {...rest} modal={modal}>
      {children}
    </BaseDialog.Root>
  </DialogContext.Provider>
)

export type DialogTriggerProps = Omit<BaseDialog.Trigger.Props, 'data-component'>

const Trigger = React.forwardRef<HTMLElement, DialogTriggerProps>(function DialogTrigger({className, ...rest}, ref) {
  return (
    <BaseDialog.Trigger
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={mergeClassName('', className)}
      data-component="Dialog.Trigger"
    />
  )
})

export type DialogPopupProps = Omit<BaseDialog.Popup.Props, 'data-component'>

const Popup = React.forwardRef<HTMLDivElement, DialogPopupProps>(function DialogPopup({className, ...rest}, ref) {
  const marker = React.useContext(PopupMarkerContext)
  return (
    <BaseDialog.Popup
      {...rest}
      ref={ref}
      className={mergeClassName(popupClassName, className)}
      data-component={marker}
    />
  )
})

export interface DialogContentProps extends DialogPopupProps {
  /**
   * Vertical alignment of the dialog while it is centered.
   */
  align?: DialogAlign
  /**
   * Whether to render a backdrop behind the dialog. Modal dialogs render one by default.
   */
  backdrop?: boolean
  /** Classes applied to the backdrop. */
  backdropClassName?: string
  /**
   * Height of the dialog: `small` (480px), `large` (640px), or `auto` to fit its content.
   * @default 'auto'
   */
  height?: DialogHeight
  /** Where the dialog is rendered in the DOM. Set `false` to keep it in place. */
  portal?: boolean
  /**
   * Where the dialog sits in the viewport. Pass a responsive object to change it on narrow viewports, for example
   * `{narrow: 'bottom', regular: 'center'}` for a bottom sheet. `wide` follows `regular`.
   * @default {narrow: 'center', regular: 'center'}
   */
  position?: DialogPosition
  /** Classes applied to the element that positions the dialog within the viewport. */
  viewportClassName?: string
  /**
   * Width of the dialog: `small` (296px), `medium` (320px), `large` (480px), `xlarge` (640px), or any CSS width.
   * @default 'xlarge'
   */
  width?: DialogWidth
}

const defaultPosition: DialogPosition = {narrow: 'center', regular: 'center'}

const Content = React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  {
    align,
    backdrop,
    backdropClassName,
    children,
    className,
    height = 'auto',
    portal = true,
    position = defaultPosition,
    style,
    viewportClassName,
    width = 'xlarge',
    ...rest
  },
  ref,
) {
  const {modal} = React.useContext(DialogContext)
  const shouldRenderBackdrop = backdrop ?? modal !== false
  const size = getDialogSize({height, width})
  const layout = getDialogPosition({align, position})
  const content = (
    <>
      {shouldRenderBackdrop && <Backdrop className={backdropClassName} />}
      <PopupMarkerContext.Provider value="Dialog.Content">
        <Viewport className={cn(layout.viewportClassName, viewportClassName)}>
          <Popup
            {...rest}
            {...size.dataAttributes}
            {...layout.dataAttributes}
            ref={ref}
            className={mergeClassName(cn(size.className, layout.popupClassName), className)}
            style={mergeStyle(style, size.style)}
          >
            {children}
          </Popup>
        </Viewport>
      </PopupMarkerContext.Provider>
    </>
  )
  return (
    <FloatingPortal part={Portal} portal={portal}>
      {content}
    </FloatingPortal>
  )
})

const Backdrop = React.forwardRef<HTMLDivElement, Omit<BaseDialog.Backdrop.Props, 'data-component'>>(
  function DialogBackdrop({className, ...rest}, ref) {
    return (
      <BaseDialog.Backdrop
        {...rest}
        ref={ref}
        className={mergeClassName(
          'fixed inset-0 z-modal bg-[var(--overlay-backdrop-bgColor)] contrast-more:bg-neutral-emphasis data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition-opacity motion-safe:duration-200 motion-reduce:transition-none',
          className,
        )}
        data-component="Dialog.Backdrop"
      />
    )
  },
)

const Viewport = React.forwardRef<HTMLDivElement, Omit<BaseDialog.Viewport.Props, 'data-component'>>(
  function DialogViewport({className, ...rest}, ref) {
    return (
      <BaseDialog.Viewport
        {...rest}
        ref={ref}
        className={mergeClassName(
          'fixed inset-0 z-modal flex items-center justify-center overflow-y-auto p-8',
          className,
        )}
        data-component="Dialog.Viewport"
      />
    )
  },
)

function Portal({children, container, ...rest}: BaseDialog.Portal.Props) {
  const portalContainer = usePortalContainer(container)
  return (
    <BaseDialog.Portal {...rest} container={portalContainer}>
      {children}
    </BaseDialog.Portal>
  )
}

// Header content stacks in the first column with upstream's 16px/14px inset. The close button takes the top of the
// second column and is pulled into the 8px header padding so it doesn't add height.
const headerClassName =
  "z-1 grid max-h-[35vh] shrink-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 overflow-y-auto py-3.5 pr-2 pl-4 shadow-[0_1px_0_var(--borderColor-default)] *:col-start-1 [&>[data-component='Dialog.CloseButton']]:col-start-2 [&>[data-component='Dialog.CloseButton']]:row-start-1 [&>[data-component='Dialog.CloseButton']]:-my-1.5"

const Header = React.forwardRef<HTMLDivElement, Omit<React.ComponentPropsWithoutRef<'div'>, 'data-component'>>(
  function DialogHeader({className, ...rest}, ref) {
    return <div {...rest} ref={ref} className={cn(headerClassName, className)} data-component="Dialog.Header" />
  },
)

const Title = React.forwardRef<HTMLHeadingElement, Omit<BaseDialog.Title.Props, 'data-component'>>(function DialogTitle(
  {className, ...rest},
  ref,
) {
  return (
    <BaseDialog.Title
      {...rest}
      ref={ref}
      className={mergeClassName('m-0 text-sm font-semibold text-default', className)}
      data-component="Dialog.Title"
    />
  )
})

const Subtitle = React.forwardRef<HTMLParagraphElement, Omit<BaseDialog.Description.Props, 'data-component'>>(
  function DialogSubtitle({className, ...rest}, ref) {
    return (
      <BaseDialog.Description
        {...rest}
        ref={ref}
        className={mergeClassName('m-0 mt-1 text-xs/normal font-normal text-muted', className)}
        data-component="Dialog.Subtitle"
      />
    )
  },
)

const Description = React.forwardRef<HTMLParagraphElement, Omit<BaseDialog.Description.Props, 'data-component'>>(
  function DialogDescription({className, ...rest}, ref) {
    return (
      <BaseDialog.Description
        {...rest}
        ref={ref}
        className={mergeClassName('m-0 mb-3.5 text-sm text-default', className)}
        data-component="Dialog.Description"
      />
    )
  },
)

const Body = React.forwardRef<HTMLDivElement, Omit<React.ComponentPropsWithoutRef<'div'>, 'data-component'>>(
  function DialogBody({className, ...rest}, forwardedRef) {
    const [element, setElement] = React.useState<HTMLDivElement | null>(null)
    const hasOverflow = useOverflow(element)
    const ref = React.useCallback(
      (node: HTMLDivElement | null) => {
        setElement(node)
        assignRef(forwardedRef, node)
      },
      [forwardedRef],
    )
    return (
      <div
        // Keep overflowing content keyboard-scrollable when the body has no focusable children.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={hasOverflow ? 0 : undefined}
        {...rest}
        ref={ref}
        className={cn('flex-1 overflow-auto p-4', className)}
        data-component="Dialog.Body"
      />
    )
  },
)

const Footer = React.forwardRef<HTMLDivElement, Omit<React.ComponentPropsWithoutRef<'div'>, 'data-component'>>(
  function DialogFooter({className, ...rest}, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn('z-1 flex shrink-0 flex-wrap justify-end gap-2 p-4', className)}
        data-component="Dialog.Footer"
      />
    )
  },
)

export type DialogCloseButtonProps = Omit<CloseIconButtonProps, 'data-component'>

const CloseButton = React.forwardRef<HTMLElement, DialogCloseButtonProps>(function DialogCloseButton(props, ref) {
  return <Close ref={ref} render={<CloseIconButton {...props} data-component="Dialog.CloseButton" />} />
})

const Close = React.forwardRef<HTMLElement, Omit<BaseDialog.Close.Props, 'data-component'>>(function DialogClose(
  {className, ...rest},
  ref,
) {
  return (
    <BaseDialog.Close
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={mergeClassName('', className)}
      data-component="Dialog.Close"
    />
  )
})

export const Dialog = Object.assign(Root, {
  Root,
  Trigger,
  Content,
  Popup,
  Portal,
  Backdrop,
  Viewport,
  Title,
  Subtitle,
  Description,
  Close,
  CloseButton,
  Header,
  Body,
  Footer,
})
;(Dialog as {displayName?: string}).displayName = 'Dialog'
