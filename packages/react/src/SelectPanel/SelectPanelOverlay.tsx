import React from 'react'
import {clsx} from 'clsx'
import {AnchoredOverlay, type AnchoredOverlayProps} from '../AnchoredOverlay'
import {FormControlContext} from '../FormControl/_FormControlContext'
import type {TouchOrMouseEvent} from '../hooks/useOnOutsideClick'
import {useResponsiveValue} from '../hooks/useResponsiveValue'
import {useMergedRefs} from '../hooks/useMergedRefs'
import Portal from '../Portal'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {ParentPanelContext, SelectPanelDialogContext, useSelectPanelContext} from './SelectPanelContext'
import classes from './SelectPanelOverlay.module.css'
import {useFeatureFlag} from '../FeatureFlags'
import {useBodyScrollLock} from '../internal/hooks/useBodyScrollLock'
import {useDevOnlyEffect} from '../internal/hooks/useDevOnlyEffect'
import {warning} from '../utils/warning'

export interface SelectPanelOverlayProps
  extends Omit<
    AnchoredOverlayProps,
    'open' | 'renderAnchor' | 'anchorRef' | 'onOpen' | 'onClose' | 'focusZoneSettings' | 'variant'
  > {
  renderAnchor?: AnchoredOverlayProps['renderAnchor']
  anchorRef?: React.RefObject<HTMLElement | null>
  onOpen?: AnchoredOverlayProps['onOpen']
  onClose?: AnchoredOverlayProps['onClose']
  /**
   * Defaults to anchored on regular viewports and fullscreen on narrow viewports.
   */
  variant?: {
    regular?: 'anchored' | 'modal'
    narrow?: 'anchored' | 'fullscreen' | 'bottom-sheet'
  }
  children?: React.ReactNode
}

interface ConfiguredSelectPanelOverlayProps
  extends Omit<SelectPanelOverlayProps, 'variant' | 'anchorRef'>,
    Pick<AnchoredOverlayProps, 'open'> {
  anchorRef: React.RefObject<HTMLElement | null>
  variant?: AnchoredOverlayProps['variant']
}

interface SelectPanelOverlayImplementationProps extends SelectPanelOverlayProps {
  isLegacy: boolean
}

function restoreParentFocus(
  anchor: HTMLElement | null,
  overlayRef: React.RefObject<HTMLElement | null>,
  parentInputRef: React.RefObject<HTMLElement | null>,
  parentAnchorRef: React.RefObject<HTMLElement | null>,
) {
  const fallback = parentInputRef.current ?? parentAnchorRef.current
  if (!overlayRef.current?.isConnected && !anchor?.isConnected && fallback?.isConnected) {
    fallback.focus()
  }
}

export const SelectPanelOverlay: React.FC<SelectPanelOverlayProps> = props => {
  return <SelectPanelOverlayImplementation {...props} isLegacy={false} />
}

// Keep the configured component's positioning, callbacks, and narrow-screen defaults intact.
export const ConfiguredSelectPanelOverlay: React.FC<ConfiguredSelectPanelOverlayProps> = ({open, ...props}) => {
  const composable = useFeatureFlag('primer_react_select_panel_composable_adapter')
  if (!composable) {
    return (
      <AnchoredOverlay
        {...props}
        renderAnchor={props.renderAnchor ?? null}
        open={open}
        focusZoneSettings={{disabled: true}}
      />
    )
  }
  return <SelectPanelOverlayImplementation {...props} isLegacy />
}

const SelectPanelOverlayImplementation: React.FC<SelectPanelOverlayImplementationProps> = ({
  children,
  renderAnchor = null,
  anchorRef: suppliedAnchorRef,
  onOpen,
  onClose,
  overlayProps,
  focusTrapSettings,
  variant,
  className,
  isLegacy,
  cssAnchorPositioningSettings,
  ...props
}) => {
  const state = useSelectPanelContext()
  const parent = React.useContext(ParentPanelContext)
  const anchorRef = suppliedAnchorRef ?? state.anchorRef
  const overlayRef = React.useRef<HTMLDivElement>(null)
  useBodyScrollLock(overlayRef, state.open && !isLegacy)
  const ref = useMergedRefs(overlayRef, overlayProps?.ref ?? null)
  const panelId = overlayProps?.id ?? `${state.id}-panel`
  const {setPanelId, dismiss, requestOpenChange} = state
  const parentInputRef = parent?.inputRef
  const parentAnchorRef = parent?.anchorRef
  const responsiveVariant = {
    regular: variant?.regular ?? 'anchored',
    narrow: variant?.narrow ?? (isLegacy ? 'anchored' : 'fullscreen'),
  }
  const currentVariant = useResponsiveValue(responsiveVariant, 'anchored')
  const positionedByViewport = !isLegacy && currentVariant !== 'anchored'
  useDevOnlyEffect(() => {
    const element = overlayRef.current
    if (!state.open || !element || isLegacy) return
    const label = element.getAttribute('aria-label')
    const title = state.labelledByRef.current ?? element.getAttribute('aria-labelledby')
    warning(
      !label && !(title && element.ownerDocument.getElementById(title)?.textContent.trim()),
      'SelectPanel: No accessible name provided. Render a Title, or pass overlayProps aria-label.',
    )
  }, [state.open, state.labelledBy, state.labelledByRef, isLegacy])

  useLayoutEffect(() => {
    if (state.panelId !== panelId) {
      setPanelId(panelId)
    }
  }, [panelId, state.panelId, setPanelId])

  React.useEffect(() => {
    if (!state.open || !parentInputRef || !parentAnchorRef) return
    const anchor = anchorRef.current
    return () => {
      // Only restore after closing or unmounting, not after a rejected controlled close.
      queueMicrotask(() => restoreParentFocus(anchor, overlayRef, parentInputRef, parentAnchorRef))
    }
  }, [state.open, anchorRef, parentInputRef, parentAnchorRef])

  const handleOpen = React.useCallback<NonNullable<AnchoredOverlayProps['onOpen']>>(
    (gesture, event) => {
      if (onOpen) onOpen(gesture, event)
      else requestOpenChange(true, gesture)
    },
    [onOpen, requestOpenChange],
  )
  const handleClose = React.useCallback<NonNullable<AnchoredOverlayProps['onClose']>>(
    (...args) => {
      if (onClose) return onClose(...args)
      if (isLegacy) return requestOpenChange(false, args[0] === 'close' ? 'cancel' : args[0])
      return dismiss(args[0])
    },
    [onClose, isLegacy, requestOpenChange, dismiss],
  )
  const handleEscape = (event: KeyboardEvent) => {
    if (overlayProps?.onEscape) overlayProps.onEscape(event)
    else handleClose('escape')
    event.preventDefault()
  }
  const handleClickOutside = (event: TouchOrMouseEvent) => {
    if (overlayProps?.onClickOutside) overlayProps.onClickOutside(event)
    else handleClose('click-outside')
    // The shared outside-click registry otherwise continues through parent overlays.
    event.preventDefault()
  }

  return (
    <>
      {state.open && !isLegacy ? (
        <Portal containerName={overlayProps?.portalContainerName}>
          <div
            aria-hidden="true"
            className={classes.Backdrop}
            data-component="SelectPanel.Backdrop"
            data-variant={currentVariant}
          />
        </Portal>
      ) : null}
      <AnchoredOverlay
        width="medium"
        displayCloseButton={false}
        {...props}
        className={className}
        open={state.open}
        renderAnchor={renderAnchor}
        anchorRef={anchorRef}
        cssAnchorPositioningSettings={{
          ...cssAnchorPositioningSettings,
          disable: positionedByViewport || cssAnchorPositioningSettings?.disable,
        }}
        onOpen={handleOpen}
        onClose={handleClose}
        variant={{
          regular: 'anchored',
          narrow: responsiveVariant.narrow === 'fullscreen' ? 'fullscreen' : 'anchored',
        }}
        focusZoneSettings={{disabled: true}}
        focusTrapSettings={{
          initialFocusRef: state.inputRef,
          ...(positionedByViewport ? {disabled: !state.open} : {}),
          ...focusTrapSettings,
        }}
        overlayProps={{
          id: panelId,
          role: 'dialog',
          'aria-modal': isLegacy ? undefined : true,
          'aria-labelledby': overlayProps?.['aria-label'] ? undefined : state.labelledBy,
          'aria-describedby': state.describedBy,
          initialFocusRef: state.inputRef,
          ...(positionedByViewport ? {visibility: 'visible', anchorSide: undefined} : {}),
          ...overlayProps,
          ...(!isLegacy ? {'data-variant': currentVariant} : {}),
          className: clsx(!isLegacy && classes.Overlay, overlayProps?.className ?? className),
          ref,
          ...(!isLegacy ? {onEscape: handleEscape, onClickOutside: handleClickOutside} : {}),
        }}
      >
        <SelectPanelDialogContext.Provider value={true}>
          {isLegacy ? children : <FormControlContext.Provider value={null}>{children}</FormControlContext.Provider>}
        </SelectPanelDialogContext.Provider>
      </AnchoredOverlay>
    </>
  )
}
