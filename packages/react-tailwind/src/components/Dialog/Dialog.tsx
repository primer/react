'use client'

import {XIcon} from '@primer/octicons-react'
import {Dialog as BaseDialog} from '@base-ui/react/dialog'
import React from 'react'
import {cn} from '../../internal/cn'
import {mergeClassName} from '../../internal/mergeClassName'
import {IconButton} from '../IconButton'

const popupClassName =
  'flex w-full max-w-[var(--overlay-width-large)] flex-col overflow-hidden rounded-lg bg-[var(--overlay-bgColor)] font-sans text-default leading-normal shadow-floating-sm outline-none contrast-more:border-current data-[closed]:hidden data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition motion-safe:duration-200 motion-reduce:transition-none'

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
  backdrop?: boolean
  backdropClassName?: string
  portal?: boolean
  viewportClassName?: string
}

const Content = React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  {backdrop, backdropClassName, children, className, portal = true, viewportClassName, ...rest},
  ref,
) {
  const {modal} = React.useContext(DialogContext)
  const shouldRenderBackdrop = backdrop ?? modal !== false
  const content = (
    <>
      {shouldRenderBackdrop && <Backdrop className={backdropClassName} />}
      <PopupMarkerContext.Provider value="Dialog.Content">
        <Viewport className={viewportClassName}>
          <Popup {...rest} ref={ref} className={className}>
            {children}
          </Popup>
        </Viewport>
      </PopupMarkerContext.Provider>
    </>
  )
  return portal ? <Portal>{content}</Portal> : content
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

const Portal = ({children, ...rest}: BaseDialog.Portal.Props) => (
  <BaseDialog.Portal {...rest}>{children}</BaseDialog.Portal>
)

const Header = React.forwardRef<HTMLDivElement, Omit<React.ComponentPropsWithoutRef<'div'>, 'data-component'>>(
  function DialogHeader({className, ...rest}, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          'flex min-h-[49px] items-start justify-between gap-4 p-2 shadow-[0_1px_0_var(--borderColor-default)]',
          className,
        )}
        data-component="Dialog.Header"
      />
    )
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
      className={mergeClassName('m-0 mt-1.5 ml-2 flex-1 text-sm font-semibold text-default', className)}
      data-component="Dialog.Title"
    />
  )
})

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
  function DialogBody({className, ...rest}, ref) {
    return (
      <div {...rest} ref={ref} className={cn('flex-1 overflow-auto p-4', className)} data-component="Dialog.Body" />
    )
  },
)

const Footer = React.forwardRef<HTMLDivElement, Omit<React.ComponentPropsWithoutRef<'div'>, 'data-component'>>(
  function DialogFooter({className, ...rest}, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn('flex flex-wrap justify-end gap-2 p-4', className)}
        data-component="Dialog.Footer"
      />
    )
  },
)

export interface DialogCloseButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof IconButton>, 'aria-label' | 'icon' | 'data-component'> {
  'aria-label'?: string
}

const CloseButton = React.forwardRef<HTMLElement, DialogCloseButtonProps>(function DialogCloseButton(props, ref) {
  return (
    <Close
      ref={ref}
      render={
        <IconButton
          {...props}
          icon={XIcon}
          aria-label={props['aria-label'] ?? 'Close dialog'}
          data-component="Dialog.CloseButton"
          variant="invisible"
        />
      }
    />
  )
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
  Description,
  Close,
  CloseButton,
  Header,
  Body,
  Footer,
})
;(Dialog as {displayName?: string}).displayName = 'Dialog'
;('use client')
