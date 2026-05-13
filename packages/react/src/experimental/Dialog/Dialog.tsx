import React, {createContext, useCallback, useContext, useMemo} from 'react'
import {clsx} from 'clsx'
import {
  useDialog,
  type UseDialogOptions,
  type UseDialogReturn,
} from '../../foundations/experimental/Dialog'
import {IconButton} from '../../Button'
import {XIcon} from '@primer/octicons-react'
import type {ResponsiveValue} from '../../hooks/useResponsiveValue'

import classes from './Dialog.module.css'

// --- Context ---

interface DialogContextValue {
  foundation: UseDialogReturn
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext)
  if (!ctx) {
    throw new Error('Dialog compound components must be used within <Dialog.Root>')
  }
  return ctx
}

// --- Dialog.Root ---

interface DialogRootProps extends UseDialogOptions {
  children: React.ReactNode
  className?: string
}

const Root = React.forwardRef<HTMLDialogElement, DialogRootProps>(function DialogRoot(
  {children, className, ...options},
  forwardedRef,
) {
  const foundation = useDialog(options)
  const dialogProps = foundation.getDialogProps()

  // Merge the foundation ref callback with the consumer's forwarded ref
  const foundationRef = dialogProps.ref
  const mergedRef = useCallback(
    (node: HTMLDialogElement | null) => {
      foundationRef(node)
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    },
    [foundationRef, forwardedRef],
  )

  const ctx = useMemo(() => ({foundation}), [foundation])

  return (
    <DialogContext.Provider value={ctx}>
      <dialog {...dialogProps} ref={mergedRef} className={clsx(className, classes.Root)} data-component="Dialog">
        {children}
      </dialog>
    </DialogContext.Provider>
  )
})

// --- Dialog.Content ---

interface DialogContentProps extends React.ComponentProps<'div'> {
  width?: 'small' | 'medium' | 'large' | 'xlarge'
  height?: 'small' | 'large' | 'auto'
  position?: 'center' | 'left' | 'right' | ResponsiveValue<'left' | 'right' | 'bottom' | 'fullscreen' | 'center'>
  align?: 'top' | 'center' | 'bottom'
}

function Content({
  width = 'xlarge',
  height = 'auto',
  position = 'center',
  align,
  className,
  ...props
}: DialogContentProps) {
  const positionDataAttributes =
    typeof position === 'string'
      ? {'data-position-regular': position}
      : Object.fromEntries(Object.entries(position).map(([key, value]) => [`data-position-${key}`, value]))

  return (
    <div
      className={clsx(className, classes.Content)}
      data-component="Dialog.Content"
      data-width={width}
      data-height={height}
      {...(align && {'data-align': align})}
      {...positionDataAttributes}
      {...props}
    />
  )
}
Content.displayName = 'Dialog.Content'

// --- Dialog.Header ---

function Header({className, ...props}: React.ComponentProps<'header'>) {
  return <header className={clsx(className, classes.Header)} data-component="Dialog.Header" {...props} />
}
Header.displayName = 'Dialog.Header'

// --- Dialog.Title ---

function Title({className, ...props}: React.ComponentProps<'h2'>) {
  const {foundation} = useDialogContext()
  const titleProps = foundation.getTitleProps()

  return <h2 {...titleProps} className={clsx(className, classes.Title)} data-component="Dialog.Title" {...props} />
}
Title.displayName = 'Dialog.Title'

// --- Dialog.Subtitle ---

function Subtitle({className, ...props}: React.ComponentProps<'p'>) {
  const {foundation} = useDialogContext()
  const descriptionProps = foundation.getDescriptionProps()

  return (
    <p
      {...descriptionProps}
      className={clsx(className, classes.Subtitle)}
      data-component="Dialog.Subtitle"
      {...props}
    />
  )
}
Subtitle.displayName = 'Dialog.Subtitle'

// --- Dialog.Body ---

function Body({className, ...props}: React.ComponentProps<'div'>) {
  const {foundation} = useDialogContext()
  const bodyProps = foundation.getBodyProps()

  return <div {...bodyProps} className={clsx(className, classes.Body)} data-component="Dialog.Body" {...props} />
}
Body.displayName = 'Dialog.Body'

// --- Dialog.Footer ---

function Footer({className, ...props}: React.ComponentProps<'footer'>) {
  return <footer className={clsx(className, classes.Footer)} data-component="Dialog.Footer" {...props} />
}
Footer.displayName = 'Dialog.Footer'

// --- Dialog.CloseButton ---

interface DialogCloseButtonProps {
  className?: string
}

function CloseButton({className}: DialogCloseButtonProps) {
  const {foundation} = useDialogContext()
  const closeProps = foundation.getCloseProps()

  return (
    <IconButton
      icon={XIcon}
      aria-label="Close"
      variant="invisible"
      onClick={closeProps.onClick}
      className={className}
      data-component="Dialog.CloseButton"
    />
  )
}
CloseButton.displayName = 'Dialog.CloseButton'

// --- Compose ---

export const DialogParts = Object.assign(Root, {
  Content,
  Header,
  Title,
  Subtitle,
  Body,
  Footer,
  CloseButton,
})

export type {DialogRootProps, DialogContentProps}
