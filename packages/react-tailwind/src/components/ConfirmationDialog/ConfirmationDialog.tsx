'use client'

import {Dialog as AlertDialog} from '@base-ui/react/dialog'
import React from 'react'
import {mergeClassName} from '../../internal/mergeClassName'
import {Button, type ButtonProps} from '../Button'

const popupClassName =
  'flex w-full max-w-[var(--overlay-width-small)] flex-col overflow-hidden rounded-lg bg-[var(--overlay-bgColor)] text-default shadow-floating-sm outline-none contrast-more:border-current data-[closed]:hidden data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition motion-safe:duration-200 motion-reduce:transition-none'

const Root = AlertDialog.Root

const Portal = ({children, ...rest}: AlertDialog.Portal.Props) => (
  <AlertDialog.Portal {...rest}>{children}</AlertDialog.Portal>
)

const Trigger = React.forwardRef<HTMLElement, Omit<AlertDialog.Trigger.Props, 'data-component'>>(
  function ConfirmationDialogTrigger({className, ...rest}, ref) {
    return (
      <AlertDialog.Trigger
        {...rest}
        ref={ref as React.Ref<HTMLButtonElement>}
        className={mergeClassName('', className)}
        data-component="ConfirmationDialog.Trigger"
      />
    )
  },
)

const Backdrop = React.forwardRef<HTMLDivElement, Omit<AlertDialog.Backdrop.Props, 'data-component'>>(
  function ConfirmationDialogBackdrop({className, ...rest}, ref) {
    return (
      <AlertDialog.Backdrop
        {...rest}
        ref={ref}
        className={mergeClassName(
          'fixed inset-0 z-modal bg-[var(--overlay-backdrop-bgColor)] contrast-more:bg-neutral-emphasis data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition-opacity motion-safe:duration-200 motion-reduce:transition-none',
          className,
        )}
        data-component="ConfirmationDialog.Backdrop"
      />
    )
  },
)

const Viewport = React.forwardRef<HTMLDivElement, Omit<AlertDialog.Viewport.Props, 'data-component'>>(
  function ConfirmationDialogViewport({className, ...rest}, ref) {
    return (
      <AlertDialog.Viewport
        {...rest}
        ref={ref}
        className={mergeClassName(
          'fixed inset-0 z-modal flex items-center justify-center overflow-y-auto p-8',
          className,
        )}
        data-component="ConfirmationDialog.Viewport"
      />
    )
  },
)

const Content = React.forwardRef<HTMLDivElement, Omit<AlertDialog.Popup.Props, 'data-component'>>(
  function ConfirmationDialogContent({className, role = 'alertdialog', ...rest}, ref) {
    return (
      <AlertDialog.Popup
        {...rest}
        ref={ref}
        role={role}
        className={mergeClassName(popupClassName, className)}
        data-component="ConfirmationDialog.Content"
      />
    )
  },
)

const Title = React.forwardRef<HTMLHeadingElement, Omit<AlertDialog.Title.Props, 'data-component'>>(
  function ConfirmationDialogTitle({className, ...rest}, ref) {
    return (
      <AlertDialog.Title
        {...rest}
        ref={ref}
        className={mergeClassName('text-sm font-semibold text-default', className)}
        data-component="ConfirmationDialog.Title"
      />
    )
  },
)

const Description = React.forwardRef<HTMLParagraphElement, Omit<AlertDialog.Description.Props, 'data-component'>>(
  function ConfirmationDialogDescription({className, ...rest}, ref) {
    return (
      <AlertDialog.Description
        {...rest}
        ref={ref}
        className={mergeClassName('mt-1 text-sm text-muted', className)}
        data-component="ConfirmationDialog.Description"
      />
    )
  },
)

const Close = React.forwardRef<HTMLElement, Omit<AlertDialog.Close.Props, 'data-component'>>(
  function ConfirmationDialogClose({className, ...rest}, ref) {
    return (
      <AlertDialog.Close
        {...rest}
        ref={ref as React.Ref<HTMLButtonElement>}
        className={mergeClassName('', className)}
        data-component="ConfirmationDialog.Close"
      />
    )
  },
)

export interface ConfirmationDialogProps extends Omit<AlertDialog.Root.Props, 'children'> {
  cancelButtonContent?: React.ReactNode
  cancelButtonDisabled?: boolean
  cancelButtonLoading?: boolean
  children?: React.ReactNode
  confirmButtonContent?: React.ReactNode
  confirmButtonDisabled?: boolean
  confirmButtonLoading?: boolean
  dangerous?: boolean
  description?: React.ReactNode
  finalFocus?: React.ComponentPropsWithoutRef<typeof AlertDialog.Popup>['finalFocus']
  initialFocus?: 'cancel' | 'confirm' | React.ComponentPropsWithoutRef<typeof AlertDialog.Popup>['initialFocus']
  onCancel?: () => void
  onConfirm?: () => void
  title: React.ReactNode
  trigger?: React.ReactElement
}

/**
 * A configuration component for the established destructive-action pattern.
 * Compose its presentational parts directly when the content or action layout
 * differs from this common pattern.
 */
const ConfirmationDialogConfig = React.forwardRef<HTMLDivElement, ConfirmationDialogProps>(function ConfirmationDialog(
  {
    cancelButtonContent = 'Cancel',
    cancelButtonDisabled = false,
    cancelButtonLoading = false,
    children,
    confirmButtonContent = 'Confirm',
    confirmButtonDisabled = false,
    confirmButtonLoading = false,
    dangerous = false,
    description,
    finalFocus,
    initialFocus,
    onCancel,
    onConfirm,
    title,
    trigger,
    ...rootProps
  },
  ref,
) {
  const cancelRef = React.useRef<HTMLElement>(null)
  const confirmRef = React.useRef<HTMLElement>(null)
  const defaultInitialFocus = dangerous ? cancelRef : confirmRef
  const popupInitialFocus =
    initialFocus === 'cancel'
      ? cancelRef
      : initialFocus === 'confirm' || initialFocus === undefined
        ? defaultInitialFocus
        : initialFocus

  return (
    <Root {...rootProps}>
      {trigger && <Trigger render={trigger} />}
      <Portal>
        <Backdrop />
        <Viewport>
          <Content ref={ref} initialFocus={popupInitialFocus} finalFocus={finalFocus}>
            <div className="p-4" data-component="ConfirmationDialog.Body">
              <Title>{title}</Title>
              {description && <Description>{description}</Description>}
              {children && <div className="mt-4">{children}</div>}
            </div>
            <div className="flex flex-wrap justify-end gap-2 p-4" data-component="ConfirmationDialog.Footer">
              <Close
                render={
                  <Button
                    ref={cancelRef}
                    disabled={cancelButtonDisabled}
                    loading={cancelButtonLoading}
                    onClick={onCancel}
                    data-component="ConfirmationDialog.Cancel"
                  >
                    {cancelButtonContent}
                  </Button>
                }
              />
              <Close
                render={
                  <Button
                    ref={confirmRef}
                    disabled={confirmButtonDisabled}
                    loading={confirmButtonLoading}
                    onClick={onConfirm}
                    variant={dangerous ? 'danger' : 'primary'}
                    data-component="ConfirmationDialog.Confirm"
                  >
                    {confirmButtonContent}
                  </Button>
                }
              />
            </div>
          </Content>
        </Viewport>
      </Portal>
    </Root>
  )
})

ConfirmationDialogConfig.displayName = 'ConfirmationDialog'

export type ConfirmationDialogButtonProps = Omit<ButtonProps, 'data-component'>

export const ConfirmationDialog = Object.assign(ConfirmationDialogConfig, {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Viewport,
  Content,
  Popup: Content,
  Title,
  Description,
  Close,
})
