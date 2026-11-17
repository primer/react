import type React from 'react'
import {AnchoredOverlay, type AnchoredOverlayProps} from '../AnchoredOverlay'
import {useFeatureFlag} from '../FeatureFlags'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {SelectPanelDialogContext, useSelectPanelContext} from './SelectPanelContext'
import {useNativeSelectPanel} from './platform/NativeSelectPanelContext'
import {NativeSelectPanelOverlay} from './platform/NativeSelectPanelOverlay'

export interface SelectPanelOverlayProps
  extends Omit<
    AnchoredOverlayProps,
    'open' | 'renderAnchor' | 'anchorRef' | 'onOpen' | 'onClose' | 'focusZoneSettings' | 'variant' | 'renderAs'
  > {
  renderAnchor?: AnchoredOverlayProps['renderAnchor']
  anchorRef?: React.RefObject<HTMLElement | null>
  onOpen?: AnchoredOverlayProps['onOpen']
  onClose?: AnchoredOverlayProps['onClose']
  /**
   * Every composed overlay uses a native modal dialog, independently of presentation.
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
  configuredVariant?: 'anchored' | 'modal'
}

export const SelectPanelOverlay: React.FC<SelectPanelOverlayProps> = NativeSelectPanelOverlay

// Configured callers keep their legacy host unless they opt into the adapter
// and their focus/position settings are compatible with native modality.
export const ConfiguredSelectPanelOverlay: React.FC<ConfiguredSelectPanelOverlayProps> = ({
  configuredVariant,
  open,
  ...props
}) => {
  const native = useNativeSelectPanel()
  const composable = useFeatureFlag('primer_react_select_panel_composable_adapter')
  if (composable && native.dialog) {
    return (
      <NativeSelectPanelOverlay
        {...props}
        configured
        variant={{
          regular: configuredVariant === 'modal' ? 'modal' : 'anchored',
          narrow: props.variant?.narrow,
        }}
      />
    )
  }
  if (composable) return <ConfiguredLegacyOverlay {...props} open={open} />
  return (
    <AnchoredOverlay
      {...props}
      renderAnchor={props.renderAnchor ?? null}
      open={open}
      focusZoneSettings={{disabled: true}}
    />
  )
}

const ConfiguredLegacyOverlay: React.FC<ConfiguredSelectPanelOverlayProps> = ({
  children,
  onOpen,
  onClose,
  overlayProps,
  ...props
}) => {
  const state = useSelectPanelContext()
  const panelId = overlayProps?.id ?? `${state.id}-panel`
  const {setPanelId} = state
  useLayoutEffect(() => {
    setPanelId(panelId)
  }, [panelId, setPanelId])

  return (
    <AnchoredOverlay
      width="medium"
      displayCloseButton={false}
      {...props}
      open={state.open}
      renderAnchor={props.renderAnchor ?? null}
      anchorRef={props.anchorRef}
      onOpen={onOpen ?? (gesture => state.requestOpenChange(true, gesture))}
      onClose={onClose ?? (gesture => state.requestOpenChange(false, gesture === 'close' ? 'cancel' : gesture))}
      variant={{regular: 'anchored', narrow: props.variant?.narrow ?? 'anchored'}}
      focusZoneSettings={{disabled: true}}
      focusTrapSettings={{initialFocusRef: state.inputRef, ...props.focusTrapSettings}}
      overlayProps={{
        id: panelId,
        role: 'dialog',
        'aria-labelledby': overlayProps?.['aria-label'] ? undefined : state.labelledBy,
        'aria-describedby': state.describedBy,
        initialFocusRef: state.inputRef,
        ...overlayProps,
        className: overlayProps?.className ?? props.className,
      }}
    >
      <SelectPanelDialogContext.Provider value={true}>{children}</SelectPanelDialogContext.Provider>
    </AnchoredOverlay>
  )
}
