'use client'

import {Dialog as BaseDialog} from '@base-ui/react/dialog'
import React from 'react'
import {CloseIconButton, type CloseIconButtonProps} from '../../internal/CloseIconButton'
import {cn} from '../../internal/cn'
import {DialogModalContext} from '../../internal/dialogModalContext'
import {DialogModalRoot} from '../../internal/DialogModalRoot'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {getActiveElement} from '../../internal/getActiveElement'
import {mergeClassName} from '../../internal/mergeClassName'
import {mergeStyle} from '../../internal/mergeStyle'
import {
  FloatingPortalParentContext,
  NestedModalLayerContext,
  useFloatingPortalContainer,
} from '../../internal/portalRoot'
import {mergeRefs} from '../../internal/refs'
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
  'primer:flex primer:flex-col primer:overflow-x-hidden primer:overflow-y-auto primer:rounded-lg primer:bg-[var(--overlay-bgColor)] primer:font-sans primer:text-default primer:leading-normal primer:shadow-floating-sm primer:outline-none primer:contrast-more:border-current primer:data-[closed]:hidden primer:data-[starting-style]:opacity-0 primer:data-[ending-style]:opacity-0 primer:motion-safe:transition primer:motion-safe:duration-200 primer:motion-reduce:transition-none'

export type DialogRootProps = BaseDialog.Root.Props

const PopupMarkerContext = React.createContext('Dialog.Popup')

const Root = (props: DialogRootProps) => <DialogModalRoot {...props} />

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
  const modal = React.useContext(DialogModalContext) ?? true
  const marker = React.useContext(PopupMarkerContext)
  return (
    <BaseDialog.Popup
      {...(modal === true ? {'aria-modal': true} : {})}
      {...rest}
      ref={ref}
      className={mergeClassName(cn(popupClassName, modal !== true && 'primer:pointer-events-auto'), className)}
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
   * Whether to render a backdrop behind the dialog.
   * @default true
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
  /** Portal destination. Pass `null` to wait for a container; ignored when `portal` is false. */
  container?: BaseDialog.Portal.Props['container']
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
    backdrop = true,
    backdropClassName,
    children,
    className,
    container,
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
  const size = getDialogSize({height, width})
  const layout = getDialogPosition({align, position})
  const content = (
    <>
      {backdrop && <Backdrop className={backdropClassName} />}
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
    <FloatingPortal container={container} part={Portal} portal={portal}>
      {content}
    </FloatingPortal>
  )
})

const Backdrop = React.forwardRef<HTMLDivElement, Omit<BaseDialog.Backdrop.Props, 'data-component'>>(
  function DialogBackdrop({className, ...rest}, ref) {
    const modal = React.useContext(DialogModalContext) ?? true
    const nested = React.useContext(NestedModalLayerContext)
    return (
      <BaseDialog.Backdrop
        {...rest}
        ref={ref}
        className={mergeClassName(
          cn(
            'primer:fixed primer:inset-0 primer:bg-[var(--overlay-backdrop-bgColor)] primer:contrast-more:bg-neutral-emphasis primer:data-[starting-style]:opacity-0 primer:data-[ending-style]:opacity-0 primer:motion-safe:transition-opacity primer:motion-safe:duration-200 primer:motion-reduce:transition-none',
            nested ? 'primer:z-popover' : 'primer:z-modal',
            modal !== true && 'primer:pointer-events-none',
          ),
          className,
        )}
        data-component="Dialog.Backdrop"
      />
    )
  },
)

const Viewport = React.forwardRef<HTMLDivElement, Omit<BaseDialog.Viewport.Props, 'data-component'>>(
  function DialogViewport({className, ...rest}, ref) {
    const modal = React.useContext(DialogModalContext) ?? true
    const nested = React.useContext(NestedModalLayerContext)
    return (
      <BaseDialog.Viewport
        {...rest}
        ref={ref}
        className={mergeClassName(
          cn(
            'primer:fixed primer:inset-0 primer:flex primer:items-center primer:justify-center primer:overflow-y-auto primer:p-8',
            nested ? 'primer:z-popover' : 'primer:z-modal',
            modal !== true && 'primer:pointer-events-none',
          ),
          className,
        )}
        data-component="Dialog.Viewport"
      />
    )
  },
)

function Portal({children, container, ...rest}: BaseDialog.Portal.Props) {
  const nested = React.useContext(FloatingPortalParentContext)
  const portalContainer = useFloatingPortalContainer(container)
  return (
    <BaseDialog.Portal {...rest} container={portalContainer}>
      <NestedModalLayerContext.Provider value={nested}>
        <FloatingPortalParentContext.Provider value>{children}</FloatingPortalParentContext.Provider>
      </NestedModalLayerContext.Provider>
    </BaseDialog.Portal>
  )
}

// Header content stacks in the first column with upstream's 16px/14px inset. The close button takes the top of the
// second column and is pulled into the 8px header padding so it doesn't add height.
const headerClassName =
  "primer:z-1 primer:grid primer:max-h-[35vh] primer:shrink-0 primer:grid-cols-[minmax(0,1fr)_auto] primer:items-start primer:gap-x-2 primer:overflow-y-auto primer:py-3.5 primer:pr-2 primer:pl-4 primer:shadow-[0_1px_0_var(--borderColor-default)] primer:*:col-start-1 primer:[&>[data-component='Dialog.CloseButton']]:sticky primer:[&>[data-component='Dialog.CloseButton']]:top-2 primer:[&>[data-component='Dialog.CloseButton']]:col-start-2 primer:[&>[data-component='Dialog.CloseButton']]:row-start-1 primer:[&>[data-component='Dialog.CloseButton']]:-my-1.5"

function createDialogFocusStore(element: HTMLElement | null) {
  let focusEntered = false
  const popup = element?.closest<HTMLElement>('[data-component="Dialog.Content"], [data-component="Dialog.Popup"]')
  const focusIsInside = () => Boolean(popup?.hasAttribute('data-open') && popup.contains(getActiveElement(popup)))
  return {
    getSnapshot: () => Boolean(element && (!popup || focusEntered || focusIsInside())),
    subscribe(notify: () => void) {
      if (!popup) return () => {}
      if (focusIsInside()) focusEntered = true
      const handleMutations = (records: MutationRecord[]) => {
        const closed = records.some((record, index) => {
          const openAfter =
            index + 1 < records.length ? records[index + 1].oldValue !== null : popup.hasAttribute('data-open')
          return record.oldValue !== null && !openAfter
        })
        if (closed) {
          focusEntered = focusIsInside()
          notify()
        }
      }
      const observer = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(handleMutations)
      const handleFocus = () => {
        // Process a pending close before recording focus in a rapidly reopened dialog.
        if (observer) handleMutations(observer.takeRecords())
        if (popup.hasAttribute('data-open') && !focusEntered) {
          focusEntered = true
          notify()
        }
      }
      popup.addEventListener('focusin', handleFocus, true)
      observer?.observe(popup, {attributes: true, attributeFilter: ['data-open'], attributeOldValue: true})
      return () => {
        popup.removeEventListener('focusin', handleFocus, true)
        observer?.disconnect()
      }
    },
  }
}

function useDialogFocusEntered(element: HTMLElement | null) {
  const store = React.useMemo(() => createDialogFocusStore(element), [element])
  return React.useSyncExternalStore(store.subscribe, store.getSnapshot, () => false)
}

function useElementFocused(element: HTMLElement | null) {
  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (!element) return () => {}
      element.addEventListener('focus', notify)
      element.addEventListener('blur', notify)
      return () => {
        element.removeEventListener('focus', notify)
        element.removeEventListener('blur', notify)
      }
    },
    [element],
  )
  const getSnapshot = React.useCallback(() => Boolean(element && getActiveElement(element) === element), [element])
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}

const Header = React.forwardRef<HTMLDivElement, Omit<React.ComponentPropsWithoutRef<'div'>, 'data-component'>>(
  function DialogHeader({className, ...rest}, forwardedRef) {
    const [element, setElement] = React.useState<HTMLDivElement | null>(null)
    const hasOverflow = useOverflow(element)
    const focusEntered = useDialogFocusEntered(element)
    const hasFocus = useElementFocused(element)
    const ref = React.useMemo(() => mergeRefs(setElement, forwardedRef), [forwardedRef])
    return (
      <div
        // The header joins the tab order after Base UI has placed initial focus.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={hasOverflow || hasFocus ? (focusEntered ? 0 : -1) : undefined}
        {...rest}
        ref={ref}
        className={cn(headerClassName, className)}
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
      className={mergeClassName(
        'primer:m-0 primer:break-words primer:text-sm primer:font-semibold primer:text-default',
        className,
      )}
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
        className={mergeClassName(
          'primer:m-0 primer:mt-1 primer:text-xs/normal primer:font-normal primer:text-muted',
          className,
        )}
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
        className={mergeClassName('primer:m-0 primer:mb-3.5 primer:text-sm primer:text-default', className)}
        data-component="Dialog.Description"
      />
    )
  },
)

const Body = React.forwardRef<HTMLDivElement, Omit<React.ComponentPropsWithoutRef<'div'>, 'data-component'>>(
  function DialogBody({className, ...rest}, forwardedRef) {
    const [element, setElement] = React.useState<HTMLDivElement | null>(null)
    const hasOverflow = useOverflow(element)
    const hasFocus = useElementFocused(element)
    const ref = React.useMemo(() => mergeRefs(setElement, forwardedRef), [forwardedRef])
    return (
      <div
        // Keep overflowing content keyboard-scrollable when the body has no focusable children.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={hasOverflow || hasFocus ? 0 : undefined}
        {...rest}
        ref={ref}
        className={cn('primer:min-h-[calc(2rem+3em)] primer:flex-1 primer:overflow-auto primer:p-4', className)}
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
        className={cn(
          'primer:z-1 primer:flex primer:shrink-0 primer:flex-wrap primer:justify-end primer:gap-2 primer:p-4 primer:[--primer-action-wrap:1] primer:[--primer-action-min-width:fit-content] primer:[--primer-action-height:auto] primer:[--primer-action-min-height-small:--spacing(7)] primer:[--primer-action-min-height-medium:--spacing(8)] primer:[--primer-action-min-height-large:--spacing(10)] primer:[--primer-action-flex:1_1_auto] primer:[--primer-action-align:stretch] primer:[--primer-action-white-space:normal] primer:[--primer-action-overflow-wrap:break-word]',
          className,
        )}
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
