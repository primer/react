import React from 'react'
import {clsx} from 'clsx'
import {XIcon} from '@primer/octicons-react'
import {IconButton} from '../../Button'
import Portal from '../../Portal'
import {useMergedRefs} from '../../hooks/useMergedRefs'
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
import {nativeInvokerProps, useNativeSelectPanel} from './NativeSelectPanelContext'
import classes from './PlatformSelectPanel.module.css'

const subscribe = () => () => {}
const serverAnchorPositioning = () => false
const nativeAnchorPositioning = () =>
  typeof CSS !== 'undefined' &&
  CSS.supports('anchor-name: --anchor') &&
  CSS.supports('justify-self: anchor-center') &&
  CSS.supports('position-try-fallbacks: flip-block')

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
  align = 'start',
  side = overlayProps?.anchorSide ?? 'outside-bottom',
  anchorOffset,
  alignmentOffset,
  displayInViewport,
  pinPosition,
  onPositionChange,
  displayCloseButton = false,
  closeButtonProps,
  cssAnchorPositioningSettings,
  configured = false,
}: SelectPanelOverlayProps & {configured?: boolean}) {
  const state = useSelectPanelContext()
  const {invokers, setTargetId} = useNativeSelectPanel()
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const [portalRevision, onPortalMount] = React.useReducer((revision: number) => revision + 1, 0)
  const anchorRef = suppliedAnchorRef ?? state.anchorRef
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(null)
  const renderAnchorRef = useMergedRefs(anchorRef, setAnchorElement)
  // Command invokers only work on buttons. Custom links and external anchors
  // retain their JavaScript controls rather than receiving inert command props.
  const anchorInvokers = invokers && anchorElement?.tagName === 'BUTTON'
  const panelId = overlayProps?.id ?? `${state.id}-panel`
  const responsiveVariant: ResponsiveValue<'anchored' | 'modal', 'anchored' | 'modal' | 'fullscreen' | 'bottom-sheet'> =
    {
      regular: variant?.regular ?? 'anchored',
      narrow: variant?.narrow ?? (configured ? (variant?.regular ?? 'anchored') : 'fullscreen'),
    }
  const currentVariant = useResponsiveValue(responsiveVariant, 'anchored')
  const {setPanelId} = state
  const supportsAnchors = React.useSyncExternalStore(subscribe, nativeAnchorPositioning, serverAnchorPositioning)
  const cssAnchors =
    supportsAnchors &&
    currentVariant === 'anchored' &&
    !cssAnchorPositioningSettings?.disable &&
    !pinPosition &&
    !onPositionChange &&
    displayInViewport === undefined &&
    side.startsWith('outside-') &&
    !(align === 'center' && (alignmentOffset ?? 0) !== 0)

  useLayoutEffect(() => {
    setPanelId(panelId)
    setTargetId(panelId)
    return () => setTargetId(undefined)
  }, [panelId, setPanelId, setTargetId])

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    const dialog = dialogRef.current
    if (!cssAnchors || !anchor || !dialog) return
    const existing = getComputedStyle(anchor).getPropertyValue('anchor-name')
    const name =
      existing && existing !== 'none' ? existing.split(',')[0].trim() : `--select-panel-${CSS.escape(state.id)}`
    if (!existing || existing === 'none') anchor.style.setProperty('anchor-name', name)
    dialog.style.setProperty('position-anchor', name)
    return () => {
      if ((!existing || existing === 'none') && anchor.style.getPropertyValue('anchor-name') === name) {
        anchor.style.removeProperty('anchor-name')
      }
      dialog.style.removeProperty('position-anchor')
    }
  }, [anchorRef, cssAnchors, state.id, portalRevision])

  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: dialogRef,
      enabled: state.open && currentVariant === 'anchored' && !cssAnchors,
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
      cssAnchors,
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
      invokers={invokers}
      anchorRef={anchorRef}
      returnFocusRef={overlayProps?.returnFocusRef}
      initialFocusRef={focusTrapSettings?.initialFocusRef ?? overlayProps?.initialFocusRef ?? state.inputRef}
      onDismiss={handleDismiss}
      onCommandOpen={handleOpen}
      dialogProps={{
        id: panelId,
        role: overlayProps?.role,
        'aria-label': overlayProps?.['aria-label'],
        'aria-labelledby': overlayProps?.['aria-label']
          ? undefined
          : (overlayProps?.['aria-labelledby'] ?? state.labelledBy),
        'aria-describedby': overlayProps?.['aria-describedby'] ?? state.describedBy,
        'data-variant': currentVariant,
        'data-anchor-position': cssAnchors,
        'data-side': side,
        'data-align': align,
        'data-configured': configured ? '' : undefined,
        style: {
          '--native-top': position ? `${position.top}px` : undefined,
          '--native-left': position ? `${position.left}px` : undefined,
          '--native-anchor-offset': `${anchorOffset ?? 4}px`,
          '--native-alignment-offset': `${alignmentOffset ?? 0}px`,
          positionTryFallbacks:
            cssAnchorPositioningSettings?.fallbackStrategy === 'none'
              ? 'none'
              : cssAnchorPositioningSettings?.fallbackStrategy === 'opposite-side'
                ? side.endsWith('left') || side.endsWith('right')
                  ? 'flip-inline'
                  : 'flip-block'
                : undefined,
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
                {...(invokers ? nativeInvokerProps(panelId, 'close') : {})}
                {...(closeButtonProps?.['aria-labelledby']
                  ? {'aria-labelledby': closeButtonProps['aria-labelledby'], 'aria-label': undefined}
                  : {'aria-label': closeButtonProps?.['aria-label'] ?? 'Close', 'aria-labelledby': undefined})}
                onClick={event => {
                  closeButtonProps?.onClick?.(event)
                  if (!event.defaultPrevented && !invokers) handleDismiss('close')
                }}
              />
            </div>
          ) : null}
          {children}
        </BaseOverlay>
      ) : null}
    </NativeDialogHost>
  )

  return (
    <>
      {renderAnchor?.({
        ref: renderAnchorRef,
        id: anchorId,
        'aria-haspopup': 'dialog',
        'aria-expanded': state.open,
        'aria-controls': state.open ? panelId : undefined,
        tabIndex: configured ? 0 : undefined,
        ...(anchorInvokers ? nativeInvokerProps(panelId, 'show-modal') : {}),
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          if (event.defaultPrevented || event.button !== 0 || event.currentTarget.matches(':disabled')) return
          if (!anchorInvokers) {
            if (state.open) handleDismiss('anchor-click')
            else handleOpen()
          }
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
