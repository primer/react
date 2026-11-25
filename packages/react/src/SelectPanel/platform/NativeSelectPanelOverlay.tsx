import React from 'react'
import {clsx} from 'clsx'
import {XIcon} from '@primer/octicons-react'
import {IconButton} from '../../Button'
import Portal from '../../Portal'
import anchoredOverlayClasses from '../../AnchoredOverlay/AnchoredOverlay.module.css'
import {BaseOverlay} from '../../Overlay/Overlay'
import {heightMap} from '../../Overlay/constants'
import {useAnchoredPosition} from '../../hooks/useAnchoredPosition'
import {useResponsiveValue, type ResponsiveValue} from '../../hooks/useResponsiveValue'
import useLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {useSelectPanelContext} from '../SelectPanelContext'
import type {SelectPanelOverlayProps} from '../SelectPanelOverlay'
import type {SelectPanelDismissReason} from '../useSelectPanel'
import {NativeDialogHost} from './NativeDialogHost'
import {NativeSelectPanelDismissContext} from './NativeSelectPanelContext'
import classes from './PlatformSelectPanel.module.css'

export function NativeSelectPanelOverlay({
  children,
  renderAnchor,
  anchorRef: suppliedAnchorRef,
  anchorId,
  onOpen,
  onClose,
  overlayProps,
  focusTrapSettings,
  variant,
  className,
  width = 'medium',
  height,
  align,
  side = overlayProps?.anchorSide ?? 'outside-bottom',
  anchorOffset,
  alignmentOffset,
  displayInViewport,
  pinPosition,
  onPositionChange,
  displayCloseButton = false,
  closeButtonProps,
  configured = false,
}: SelectPanelOverlayProps & {configured?: boolean}) {
  const state = useSelectPanelContext()
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const [portalRevision, onPortalMount] = React.useReducer((revision: number) => revision + 1, 0)
  const anchorRef = suppliedAnchorRef ?? state.anchorRef
  const panelId = overlayProps?.id ?? `${state.id}-panel`
  const responsiveVariant: ResponsiveValue<'anchored' | 'modal', 'anchored' | 'modal' | 'fullscreen' | 'bottom-sheet'> =
    {
      regular: variant?.regular ?? 'anchored',
      narrow: variant?.narrow ?? (configured ? (variant?.regular ?? 'anchored') : 'fullscreen'),
    }
  const currentVariant = useResponsiveValue(responsiveVariant, 'anchored')
  const modal = currentVariant !== 'anchored'
  const {setPanelId} = state

  useLayoutEffect(() => {
    setPanelId(panelId)
  }, [panelId, setPanelId])

  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: dialogRef,
      enabled: state.open && currentVariant === 'anchored',
      align,
      side,
      anchorOffset,
      alignmentOffset,
      displayInViewport,
      pinPosition,
      onPositionChange: next => {
        if (next) onPositionChange?.({position: next})
      },
    },
    [
      state.open,
      currentVariant,
      portalRevision,
      align,
      side,
      anchorOffset,
      alignmentOffset,
      displayInViewport,
      pinPosition,
    ],
  )

  const handleOpen = () => {
    if (onOpen) onOpen('anchor-click')
    else state.requestOpenChange(true, 'anchor-click')
  }
  const handleDismiss = (reason: SelectPanelDismissReason, event?: Event) => {
    if (reason === 'escape' && event instanceof KeyboardEvent && overlayProps?.onEscape) {
      overlayProps.onEscape(event)
    } else if (reason === 'click-outside' && event instanceof MouseEvent && overlayProps?.onClickOutside) {
      overlayProps.onClickOutside(event)
    } else if (onClose && reason !== 'back') {
      onClose(reason)
    } else {
      state.dismiss(reason)
    }
  }
  const surfaceProps = {...overlayProps}
  for (const key of [
    'id',
    'role',
    'onEscape',
    'onClickOutside',
    'initialFocusRef',
    'returnFocusRef',
    'ignoreClickRefs',
    'portalContainerName',
    '_PrivateDisablePortal',
    'preventFocusOnOpen',
    'preventFocusOnClose',
    'preventOverflow',
    'anchorSide',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-modal',
  ] as const) {
    delete surfaceProps[key]
  }

  const host = (
    <NativeDialogHost
      dialogRef={dialogRef}
      modal={modal}
      anchorRef={anchorRef}
      returnFocusRef={overlayProps?.returnFocusRef}
      initialFocusRef={focusTrapSettings?.initialFocusRef ?? overlayProps?.initialFocusRef ?? state.inputRef}
      ignoreClickRefs={overlayProps?.ignoreClickRefs}
      onDismiss={handleDismiss}
      dialogProps={{
        id: panelId,
        role: overlayProps?.role,
        className: classes.NativeHost,
        'aria-label': overlayProps?.['aria-label'],
        'aria-labelledby': overlayProps?.['aria-label']
          ? undefined
          : (overlayProps?.['aria-labelledby'] ?? state.labelledBy),
        'aria-describedby': overlayProps?.['aria-describedby'] ?? state.describedBy,
        'data-variant': currentVariant,
        'data-configured': configured ? '' : undefined,
        style: {
          '--native-top': position ? `${position.top}px` : undefined,
          '--native-left': position ? `${position.left}px` : undefined,
          // The surface inherits the host's viewport cap. Keep an explicit
          // Overlay maxHeight in that same chain rather than overriding it.
          ...(overlayProps?.maxHeight && currentVariant !== 'fullscreen'
            ? {
                maxHeight:
                  overlayProps.maxHeight === 'fit-content'
                    ? 'fit-content'
                    : `min(${heightMap[overlayProps.maxHeight]}, calc(100dvh - var(--base-size-32)))`,
              }
            : {}),
        } as React.CSSProperties,
      }}
    >
      {!configured || state.open ? (
        <BaseOverlay
          {...surfaceProps}
          width={overlayProps?.width ?? width}
          height={overlayProps?.height ?? height}
          className={clsx(classes.NativeSurface, overlayProps?.className ?? className)}
          data-variant={currentVariant}
        >
          {displayCloseButton ? (
            <div className={anchoredOverlayClasses.ResponsiveCloseButtonContainer}>
              <IconButton
                icon={XIcon}
                variant="invisible"
                {...closeButtonProps}
                as="button"
                className={clsx(anchoredOverlayClasses.ResponsiveCloseButton, closeButtonProps?.className)}
                {...(closeButtonProps?.['aria-labelledby']
                  ? {'aria-labelledby': closeButtonProps['aria-labelledby'], 'aria-label': undefined}
                  : {'aria-label': closeButtonProps?.['aria-label'] ?? 'Close', 'aria-labelledby': undefined})}
                onClick={event => {
                  closeButtonProps?.onClick?.(event)
                  if (!event.defaultPrevented) handleDismiss('close')
                }}
              />
            </div>
          ) : null}
          <NativeSelectPanelDismissContext.Provider value={{id: state.id, dismiss: handleDismiss}}>
            {children}
          </NativeSelectPanelDismissContext.Provider>
        </BaseOverlay>
      ) : null}
    </NativeDialogHost>
  )

  return (
    <>
      {renderAnchor?.({
        ref: anchorRef,
        id: anchorId,
        'aria-haspopup': 'dialog',
        'aria-expanded': state.open,
        'aria-controls': state.open ? panelId : undefined,
        tabIndex: configured ? 0 : undefined,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          if (event.defaultPrevented || event.button !== 0 || event.currentTarget.matches(':disabled')) return
          if (state.open) handleDismiss('anchor-click')
          else handleOpen()
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          if (event.defaultPrevented || event.currentTarget.matches(':disabled')) return
          if (!state.open && ['ArrowDown', 'ArrowUp', ...(configured ? [' ', 'Enter'] : [])].includes(event.key)) {
            event.preventDefault()
            if (onOpen) onOpen('anchor-key-press', event)
            else state.requestOpenChange(true, 'anchor-key-press')
          }
        },
      })}
      {configured && !overlayProps?._PrivateDisablePortal ? (
        <Portal containerName={overlayProps?.portalContainerName} onMount={onPortalMount}>
          {host}
        </Portal>
      ) : (
        host
      )}
    </>
  )
}
