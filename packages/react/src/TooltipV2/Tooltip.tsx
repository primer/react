import React, {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ForwardRefExoticComponent,
} from 'react'
import {useId, useOnEscapePress, useMergedRefs} from '../hooks'
import {invariant} from '../utils/invariant'
import {warning} from '../utils/warning'
import {mergeProps} from '../utils/mergeProps'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorSide, AnchorAlignment} from '@primer/behaviors'
import {isSupported, apply} from '@oddbird/popover-polyfill/fn'
import {clsx} from 'clsx'
import classes from './Tooltip.module.css'
import {getAccessibleKeybindingHintString, KeybindingHint, type KeybindingHintProps} from '../KeybindingHint'
import {usePlatform} from '../KeybindingHint/platform'
import VisuallyHidden from '../_VisuallyHidden'
import useSafeTimeout from '../hooks/useSafeTimeout'
import type {SlotMarker} from '../utils/types'
import type {DistributiveOmit} from '../utils/modern-polymorphic'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {TooltipContext} from './TooltipContext'
import {reactMajorVersion} from '../utils/environment'

export type TooltipDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export type TooltipOpenChangeReason =
  | 'trigger-hover'
  | 'trigger-focus'
  | 'popup-hover'
  | 'escape-key'
  | 'touch-end'
  | 'disabled'

export interface TooltipOpenChange {
  open: boolean
  reason: TooltipOpenChangeReason
  event?: Event
  cancel(): void
}

export type TooltipOpenChangeHandler = (change: TooltipOpenChange) => void

export interface TooltipRootProps {
  children: React.ReactNode
  /**
   * Optional ID used to link `Tooltip.Trigger` and `Tooltip.Popup` deterministically during SSR.
   */
  id?: string
  /**
   * Controlled open state of the tooltip.
   */
  open?: boolean
  /**
   * Initial open state when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Called when the tooltip open state changes. Call `change.cancel()` to prevent the transition.
   */
  onOpenChange?: TooltipOpenChangeHandler
  /**
   * Delay before showing the tooltip on hover.
   * @default short
   */
  delay?: 'short' | 'medium' | 'long'
  /**
   * Whether the tooltip labels or describes its trigger element.
   * @default description
   */
  type?: 'label' | 'description'
  /**
   * Prevents the tooltip from opening and closes it if currently open.
   * @default false
   */
  disabled?: boolean
}

type TargetComponentProps<As extends React.ElementType> =
  As extends PolymorphicForwardRefComponent<infer E, infer P>
    ? DistributiveOmit<React.ComponentPropsWithRef<E extends React.ElementType ? E : never>, keyof P> & P
    : React.ComponentPropsWithRef<As>

export interface TooltipTriggerState {
  readonly open: boolean
}

export type TooltipTriggerRenderProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.RefCallback<HTMLElement>
  type?: 'button' | 'submit' | 'reset'
  'data-component'?: string
  'data-open'?: ''
}

type TooltipTriggerRenderProp =
  | React.ReactElement
  | ((props: TooltipTriggerRenderProps, state: TooltipTriggerState) => React.ReactElement)

type TooltipTriggerOwnProps = {
  children?: React.ReactNode
}

type TooltipTriggerAsProps<As extends React.ElementType = 'button'> = TooltipTriggerOwnProps &
  DistributiveOmit<
    TargetComponentProps<React.ElementType extends As ? 'button' : As>,
    keyof TooltipTriggerOwnProps | 'as' | 'render'
  > & {
    /**
     * Render the trigger as a different element or component. Cannot be combined with `render`.
     */
    as?: As
    render?: never
  }

type TooltipTriggerRenderElementProps = TooltipTriggerOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof TooltipTriggerOwnProps | 'as' | 'render'> &
  React.RefAttributes<HTMLElement> & {
    as?: never
    /**
     * Replace the default trigger element with a custom element or render function receiving merged props and state. Cannot be combined with `as`.
     */
    render: TooltipTriggerRenderProp
    /**
     * Button type attribute used when rendering the default native `<button>` element.
     * @default button
     */
    type?: 'button' | 'submit' | 'reset'
  }

export type TooltipTriggerProps<As extends React.ElementType = 'button'> =
  | TooltipTriggerAsProps<As>
  | TooltipTriggerRenderElementProps

export interface TooltipTriggerComponent {
  (props: TooltipTriggerRenderElementProps): React.ReactElement | null
  <As extends React.ElementType = 'button'>(props: TooltipTriggerAsProps<As>): React.ReactElement | null
  displayName?: string
}

type TooltipTriggerInternalProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType
  render?: TooltipTriggerRenderProp
  children?: React.ReactNode
  type?: string
}

export interface TooltipPopupState {
  readonly open: boolean
  readonly direction: TooltipDirection
}

export type TooltipPopupRenderProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.RefCallback<HTMLElement>
  'data-component'?: string
  'data-direction'?: TooltipDirection
  'data-open'?: ''
}

type TooltipPopupRenderProp =
  | React.ReactElement
  | ((props: TooltipPopupRenderProps, state: TooltipPopupState) => React.ReactElement)

type TooltipPopupOwnProps = {
  /**
   * Sets where the tooltip renders in relation to its trigger.
   * @default s
   */
  direction?: TooltipDirection
  /**
   * Optional keybinding hint displayed next to the tooltip text.
   */
  keybindingHint?: KeybindingHintProps['keys'] | Array<KeybindingHintProps['keys']>
  children?: React.ReactNode
}

type TooltipPopupAsProps<As extends React.ElementType = 'span'> = TooltipPopupOwnProps &
  DistributiveOmit<
    TargetComponentProps<React.ElementType extends As ? 'span' : As>,
    keyof TooltipPopupOwnProps | 'as' | 'render'
  > & {
    /**
     * Render the popup as a different element or component. Cannot be combined with `render`.
     */
    as?: As
    render?: never
  }

type TooltipPopupRenderElementProps = TooltipPopupOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof TooltipPopupOwnProps | 'as' | 'render'> &
  React.RefAttributes<HTMLElement> & {
    as?: never
    /**
     * Replace the default popup element with a custom element or render function receiving merged props and state. Cannot be combined with `as`.
     */
    render: TooltipPopupRenderProp
  }

export type TooltipPopupProps<As extends React.ElementType = 'span'> =
  | TooltipPopupAsProps<As>
  | TooltipPopupRenderElementProps

export interface TooltipPopupComponent {
  (props: TooltipPopupRenderElementProps): React.ReactElement | null
  <As extends React.ElementType = 'span'>(props: TooltipPopupAsProps<As>): React.ReactElement | null
  displayName?: string
}

type TooltipPopupInternalProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType
  render?: TooltipPopupRenderProp
  direction?: TooltipDirection
  keybindingHint?: KeybindingHintProps['keys'] | Array<KeybindingHintProps['keys']>
  children?: React.ReactNode
}

export type TooltipProps = React.PropsWithChildren<{
  direction?: TooltipDirection
  text: string
  type?: 'label' | 'description'
  keybindingHint?: KeybindingHintProps['keys'] | Array<KeybindingHintProps['keys']>
  /**
   * Delay in milliseconds before showing the tooltip
   * @default short (50ms)
   * medium (400ms)
   * long (1200ms)
   */
  delay?: 'short' | 'medium' | 'long'
  /**
   * Controlled open state of the tooltip.
   */
  open?: boolean
  /**
   * Initial open state when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Called when the tooltip open state changes. Call `change.cancel()` to prevent the transition.
   */
  onOpenChange?: TooltipOpenChangeHandler
  /**
   * Private API for use internally only. Prevents the tooltip from opening if `true`.
   *
   * Accessibility note: This prop should be used with caution. Only use when needing to
   * programmatically close the tooltip in response to a specific user action, such as
   * opening a menu, or content where the tooltip could overlap with interactive content.
   *
   * @default false
   */
  _privateDisableTooltip?: boolean
}> &
  React.HTMLAttributes<HTMLElement>

type TriggerPropsType = Pick<
  React.HTMLAttributes<HTMLElement>,
  | 'aria-describedby'
  | 'aria-labelledby'
  | 'onBlur'
  | 'onTouchEnd'
  | 'onFocus'
  | 'onMouseOverCapture'
  | 'onMouseLeave'
  | 'onTouchCancel'
> & {
  ref?: React.Ref<HTMLElement>
}

interface TooltipInternalContextValue {
  tooltipId: string
  hasRootId: boolean
  type: 'label' | 'description'
  isOpen: boolean
  calculatedDirection: TooltipDirection
  setTriggerEl: (el: HTMLElement | null) => void
  setPopupEl: (el: HTMLElement | null) => void
  setPopupId: (id: string | undefined) => void
  setDirection: (direction: TooltipDirection) => void
  onTriggerFocus: (event: React.FocusEvent<HTMLElement>) => void
  onTriggerBlur: (event: React.FocusEvent<HTMLElement>) => void
  onTriggerMouseOverCapture: (event: React.MouseEvent<HTMLElement>) => void
  onTriggerMouseLeave: (event: React.MouseEvent<HTMLElement>) => void
  onTriggerTouchEnd: (event: React.TouchEvent<HTMLElement>) => void
  onPopupMouseEnter: (event: React.MouseEvent<HTMLElement>) => void
  onPopupMouseLeave: (event: React.MouseEvent<HTMLElement>) => void
}

const TooltipInternalContext = createContext<TooltipInternalContextValue | null>(null)

function useTooltipInternalContext(partName: string): TooltipInternalContextValue {
  const context = useContext(TooltipInternalContext)
  invariant(context !== null, `${partName} must be used within Tooltip.Root.`)
  if (context === null) {
    throw new Error(`${partName} must be used within Tooltip.Root.`)
  }
  return context
}

// map tooltip direction to anchoredPosition props
const directionToPosition: Record<TooltipDirection, {side: AnchorSide; align: AnchorAlignment}> = {
  nw: {side: 'outside-top', align: 'end'},
  n: {side: 'outside-top', align: 'center'},
  ne: {side: 'outside-top', align: 'start'},
  e: {side: 'outside-right', align: 'center'},
  se: {side: 'outside-bottom', align: 'start'},
  s: {side: 'outside-bottom', align: 'center'},
  sw: {side: 'outside-bottom', align: 'end'},
  w: {side: 'outside-left', align: 'center'},
}

// map anchoredPosition props to tooltip direction
const positionToDirection: Partial<Record<string, TooltipDirection>> = {
  'outside-top-end': 'nw',
  'outside-top-center': 'n',
  'outside-top-start': 'ne',
  'outside-right-center': 'e',
  'outside-bottom-start': 'se',
  'outside-bottom-center': 's',
  'outside-bottom-end': 'sw',
  'outside-left-center': 'w',
}

// The list is from GitHub's custom-axe-rules https://github.com/github/github/blob/master/app/assets/modules/github/axe-custom-rules.ts#L3
const interactiveElements = [
  'a[href]',
  'button:not([disabled])',
  'summary',
  'select',
  'input:not([type=hidden])',
  'textarea',
]

const interactivePopupSelector =
  'a[href], button, input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])'

// Map delay prop to actual time in ms
// For context on delay times, see https://github.com/github/primer/issues/3313#issuecomment-3336696699
const delayTimeMap = {
  short: 50,
  medium: 400,
  long: 1200,
}

const isInteractive = (element: HTMLElement) => {
  return (
    interactiveElements.some(selector => element.matches(selector)) ||
    (element.hasAttribute('role') && element.getAttribute('role') === 'button')
  )
}

const emptyKeybindingHints: Array<KeybindingHintProps['keys']> = []

function getElementRef(element: React.ReactElement): React.Ref<HTMLElement> | undefined {
  return reactMajorVersion > 18
    ? (element.props as {ref?: React.Ref<HTMLElement>}).ref
    : (element as unknown as {ref?: React.Ref<HTMLElement>}).ref
}

function isInvalidSelectorError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message.includes('not a valid selector'),
  )
}

function mergeAriaDescribedBy(
  type: 'label' | 'description',
  tooltipId: string,
  ...existingValues: Array<string | undefined>
): string | undefined {
  const existingTokens = existingValues
    .filter((value): value is string => Boolean(value))
    .flatMap(value => value.trim().split(/\s+/))
    .filter(Boolean)

  if (type === 'description') {
    existingTokens.push(tooltipId)
  }

  const deduped = Array.from(new Set(existingTokens))
  return deduped.length > 0 ? deduped.join(' ') : undefined
}

function useTooltipTriggerValidation(triggerRef: React.RefObject<HTMLElement | null>, type: 'label' | 'description') {
  useEffect(() => {
    const triggerEl = triggerRef.current
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
    if (!triggerEl) return
    const isInvalidTrigger = !(triggerEl instanceof HTMLElement)
    warning(
      isInvalidTrigger,
      'The `Tooltip` component expects its trigger ref to resolve to an HTML element. Ensure the trigger forwards its ref to a single interactive element instead of a React Fragment.',
    )
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
    if (isInvalidTrigger) return

    const isTriggerInteractive = isInteractive(triggerEl)
    const triggerChildren = triggerEl.childNodes
    const hasInteractiveDescendant = Array.from(triggerChildren).some(child => {
      return (
        (child instanceof HTMLElement && isInteractive(child)) ||
        Array.from(child.childNodes).some(grandChild => grandChild instanceof HTMLElement && isInteractive(grandChild))
      )
    })
    invariant(
      isTriggerInteractive || hasInteractiveDescendant,
      'The `Tooltip` component expects a single React element that contains interactive content. Consider using a `<button>` or equivalent interactive element instead.',
    )

    // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
    if (type === 'label') {
      const hasAriaLabel = triggerEl.hasAttribute('aria-label')
      const hasAriaLabelInChildren = Array.from(triggerEl.childNodes).some(
        child => child instanceof HTMLElement && child.hasAttribute('aria-label'),
      )
      warning(
        hasAriaLabel || hasAriaLabelInChildren,
        'The label type `Tooltip` is going to be used here to label the trigger element. Please remove the aria-label from the trigger element.',
      )
    }
  }, [triggerRef, type])
}

interface TooltipRootInternalProps extends TooltipRootProps {
  initialDirection?: TooltipDirection
}

function TooltipRootImpl({
  children,
  id,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delay = 'short',
  type = 'description',
  disabled = false,
  initialDirection = 's',
}: TooltipRootInternalProps) {
  const generatedId = useId(id)
  const [popupId, setPopupId] = useState<string | undefined>(undefined)
  const hasRootId = Boolean(id)
  const tooltipId = hasRootId ? generatedId : (popupId ?? generatedId)

  const isControlled = controlledOpen !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const [calculatedDirection, setCalculatedDirection] = useState<TooltipDirection>(initialDirection)

  const directionRef = useRef<TooltipDirection>(initialDirection)
  const triggerElRef = useRef<HTMLElement | null>(null)
  const popupElRef = useRef<HTMLElement | null>(null)

  const setDirection = useCallback((nextDirection: TooltipDirection) => {
    directionRef.current = nextDirection
  }, [])

  const openTimeoutRef = useRef<number | null>(null)
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()

  const latestRef = useRef({
    isOpen,
    isControlled,
    disabled,
    delay,
    onOpenChange,
  })
  const pendingOpenRef = useRef(isOpen)
  useIsomorphicLayoutEffect(() => {
    latestRef.current = {
      isOpen,
      isControlled,
      disabled,
      delay,
      onOpenChange,
    }
    pendingOpenRef.current = isOpen
  })

  const syncPopover = useCallback((shouldShow: boolean) => {
    const popup = popupElRef.current
    if (!popup) return
    try {
      if (shouldShow) {
        const trigger = triggerElRef.current
        if (!(trigger instanceof HTMLElement)) return
        if (typeof window !== 'undefined' && !isSupported()) {
          apply()
        }
        if (!popup.hasAttribute('popover')) {
          popup.setAttribute('popover', 'auto')
        }
        if (!popup.matches(':popover-open')) {
          popup.showPopover()
        }
        const currentDirection = directionRef.current
        const settings = {
          side: directionToPosition[currentDirection].side,
          align: directionToPosition[currentDirection].align,
        }
        const {top, left, anchorAlign, anchorSide} = getAnchoredPosition(popup, trigger, settings)
        const nextDirection = positionToDirection[`${anchorSide}-${anchorAlign}`]
        if (nextDirection) {
          setCalculatedDirection(nextDirection)
        }
        popup.style.top = `${top}px`
        popup.style.left = `${left}px`
      } else if (popup.hasAttribute('popover') && popup.matches(':popover-open')) {
        popup.hidePopover()
      }
    } catch (error) {
      if (!isInvalidSelectorError(error)) {
        throw error
      }
    }
  }, [])

  const setTriggerEl = useCallback(
    (node: HTMLElement | null) => {
      triggerElRef.current = node
      if (node && latestRef.current.isOpen && !latestRef.current.disabled) {
        syncPopover(true)
      }
    },
    [syncPopover],
  )

  const setPopupEl = useCallback(
    (node: HTMLElement | null) => {
      popupElRef.current = node
      if (node && latestRef.current.isOpen && !latestRef.current.disabled) {
        syncPopover(true)
      }
    },
    [syncPopover],
  )

  const clearPendingOpenTimeout = useCallback(() => {
    if (openTimeoutRef.current !== null) {
      safeClearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
  }, [safeClearTimeout])

  const requestOpenChange = useCallback(
    (nextOpen: boolean, reason: TooltipOpenChangeReason, event?: Event): boolean => {
      if (!nextOpen) {
        clearPendingOpenTimeout()
      }
      const {
        isOpen: currentOpen,
        isControlled: controlled,
        disabled: isDisabled,
        onOpenChange: handler,
      } = latestRef.current
      if (nextOpen && isDisabled) {
        return false
      }
      const effectiveOpen = controlled ? currentOpen : pendingOpenRef.current
      if (nextOpen === effectiveOpen) {
        return true
      }
      const transition = {canceled: false}
      const change: TooltipOpenChange = {
        open: nextOpen,
        reason,
        ...(event !== undefined ? {event} : {}),
        cancel() {
          transition.canceled = true
        },
      }
      handler?.(change)
      if (transition.canceled) {
        return false
      }
      if (!controlled) {
        pendingOpenRef.current = nextOpen
        setUncontrolledOpen(nextOpen)
      }
      return true
    },
    [clearPendingOpenTimeout],
  )

  useEffect(() => {
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
    if (disabled) {
      requestOpenChange(false, 'disabled')
    }
  }, [disabled, requestOpenChange])

  useEffect(() => {
    const popup = popupElRef.current
    if (!popup) return
    if (typeof window !== 'undefined' && !isSupported()) {
      apply()
    }
    popup.setAttribute('popover', 'auto')
  }, [])

  useEffect(() => {
    syncPopover(isOpen && !disabled)
  }, [isOpen, disabled, syncPopover])

  useOnEscapePress(
    (event: KeyboardEvent) => {
      if (isOpen) {
        const didClose = requestOpenChange(false, 'escape-key', event)
        if (didClose && !disabled) {
          event.stopImmediatePropagation()
          event.preventDefault()
        }
      }
    },
    [isOpen, disabled, requestOpenChange],
  )

  const onTriggerFocus = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      setTriggerEl(event.currentTarget)
      let isFocusVisible = true
      try {
        if (!event.target.matches(':focus-visible')) {
          isFocusVisible = false
        }
      } catch {
        // jsdom does not support :focus-visible
      }
      if (isFocusVisible) {
        requestOpenChange(true, 'trigger-focus', event.nativeEvent)
      }
    },
    [requestOpenChange, setTriggerEl],
  )

  const onTriggerBlur = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      requestOpenChange(false, 'trigger-focus', event.nativeEvent)
    },
    [requestOpenChange],
  )

  const onTriggerMouseOverCapture = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setTriggerEl(event.currentTarget)
      const effectiveOpen = latestRef.current.isControlled ? latestRef.current.isOpen : pendingOpenRef.current
      if (effectiveOpen || openTimeoutRef.current !== null) {
        return
      }
      const delayTime = delayTimeMap[latestRef.current.delay] || 50
      const nativeEvent = event.nativeEvent
      // Capture runs before handlers that cancel the opening timeout (such as onTouchEnd)
      openTimeoutRef.current = safeSetTimeout(() => {
        if (openTimeoutRef.current === null) return
        openTimeoutRef.current = null
        requestOpenChange(true, 'trigger-hover', nativeEvent)
      }, delayTime)
    },
    [requestOpenChange, safeSetTimeout, setTriggerEl],
  )

  const onTriggerMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      requestOpenChange(false, 'trigger-hover', event.nativeEvent)
    },
    [requestOpenChange],
  )

  const onTriggerTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      const nativeEvent = event.nativeEvent
      // Hide tooltips on tap while still allowing tap-and-hold viewing on touch devices
      safeSetTimeout(() => requestOpenChange(false, 'touch-end', nativeEvent), 10)
    },
    [requestOpenChange, safeSetTimeout],
  )

  const onPopupMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      requestOpenChange(true, 'popup-hover', event.nativeEvent)
    },
    [requestOpenChange],
  )

  const onPopupMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      requestOpenChange(false, 'popup-hover', event.nativeEvent)
    },
    [requestOpenChange],
  )

  const publicContextValue = useMemo(() => ({tooltipId}), [tooltipId])

  const internalContextValue = useMemo<TooltipInternalContextValue>(
    () => ({
      tooltipId,
      hasRootId,
      type,
      isOpen,
      calculatedDirection,
      setTriggerEl,
      setPopupEl,
      setPopupId,
      setDirection,
      onTriggerFocus,
      onTriggerBlur,
      onTriggerMouseOverCapture,
      onTriggerMouseLeave,
      onTriggerTouchEnd,
      onPopupMouseEnter,
      onPopupMouseLeave,
    }),
    [
      tooltipId,
      hasRootId,
      type,
      isOpen,
      calculatedDirection,
      onTriggerFocus,
      onTriggerBlur,
      onTriggerMouseOverCapture,
      onTriggerMouseLeave,
      onTriggerTouchEnd,
      onPopupMouseEnter,
      onPopupMouseLeave,
      setTriggerEl,
      setPopupEl,
      setDirection,
    ],
  )

  return (
    <TooltipContext.Provider value={publicContextValue}>
      <TooltipInternalContext.Provider value={internalContextValue}>{children}</TooltipInternalContext.Provider>
    </TooltipContext.Provider>
  )
}

function TooltipRoot(props: TooltipRootProps) {
  return <TooltipRootImpl {...props} />
}

const TooltipTriggerImpl = React.forwardRef<HTMLElement, TooltipTriggerInternalProps>(
  ({as: asProp, render, children, type: buttonType, ...rest}, forwardedRef) => {
    const context = useTooltipInternalContext('Tooltip.Trigger')

    invariant(
      !(asProp && render),
      '[Tooltip/conflicting-render-props] Tooltip.Trigger cannot use both `as` and `render`. Pass one or the other.',
    )

    const localTriggerRef = useRef<HTMLElement | null>(null)
    useTooltipTriggerValidation(localTriggerRef, context.type)

    const setTriggerEl = context.setTriggerEl
    const handleTriggerRef = useCallback(
      (node: HTMLElement | null) => {
        localTriggerRef.current = node
        setTriggerEl(node)
      },
      [setTriggerEl],
    )

    const renderElementRef = React.isValidElement(render) ? getElementRef(render) : undefined
    const mergedRef = useMergedRefs(handleTriggerRef, useMergedRefs(forwardedRef, renderElementRef))

    const renderElementProps = React.isValidElement(render) ? (render.props as Record<string, unknown>) : undefined
    const describedBy = mergeAriaDescribedBy(
      context.type,
      context.tooltipId,
      rest['aria-describedby'],
      typeof renderElementProps?.['aria-describedby'] === 'string' ? renderElementProps['aria-describedby'] : undefined,
    )
    const labelledBy =
      context.type === 'label'
        ? context.tooltipId
        : (rest['aria-labelledby'] ??
          (typeof renderElementProps?.['aria-labelledby'] === 'string'
            ? renderElementProps['aria-labelledby']
            : undefined))

    const primerTriggerProps: TooltipTriggerRenderProps = {
      ...(render === undefined && (asProp === undefined || typeof asProp === 'string')
        ? {'data-component': 'Tooltip.Trigger'}
        : {}),
      'data-open': context.isOpen ? '' : undefined,
      'aria-describedby': describedBy,
      'aria-labelledby': labelledBy,
      onFocus: context.onTriggerFocus,
      onBlur: context.onTriggerBlur,
      onMouseOverCapture: context.onTriggerMouseOverCapture,
      onMouseLeave: context.onTriggerMouseLeave,
      onTouchEnd: context.onTriggerTouchEnd,
    }

    const consumerProps: Record<string, unknown> = {...rest}
    if (buttonType !== undefined) {
      consumerProps.type = buttonType
    }

    const mergedWithTriggerProps = mergeProps(primerTriggerProps, consumerProps)

    if (typeof render === 'function') {
      const renderProps: TooltipTriggerRenderProps = {
        ...mergedWithTriggerProps,
        'aria-describedby': describedBy,
        'aria-labelledby': labelledBy,
        ref: mergedRef,
      }
      return render(renderProps, {open: context.isOpen})
    }

    if (React.isValidElement(render)) {
      const mergedElementProps = mergeProps(mergedWithTriggerProps, renderElementProps ?? {}) as Record<string, unknown>
      mergedElementProps['aria-describedby'] = describedBy
      mergedElementProps['aria-labelledby'] = labelledBy
      mergedElementProps['data-open'] = context.isOpen ? '' : undefined
      mergedElementProps.ref = mergedRef
      if (children !== undefined && renderElementProps?.children === undefined) {
        mergedElementProps.children = children
      }
      return React.cloneElement(render, mergedElementProps)
    }

    const Component: React.ElementType = asProp ?? 'button'
    const isNativeButton = Component === 'button'
    const elementProps: Record<string, unknown> = {
      ...mergedWithTriggerProps,
      'aria-describedby': describedBy,
      'aria-labelledby': labelledBy,
      ref: mergedRef,
    }
    if (isNativeButton && elementProps.type === undefined) {
      elementProps.type = 'button'
    }
    return <Component {...elementProps}>{children}</Component>
  },
)

const TooltipPopupImpl = React.forwardRef<HTMLElement, TooltipPopupInternalProps>(
  (
    {as: asProp, render, direction = 's', keybindingHint = emptyKeybindingHints, id, className, children, ...rest},
    forwardedRef,
  ) => {
    const context = useTooltipInternalContext('Tooltip.Popup')

    invariant(
      !(asProp && render),
      '[Tooltip/conflicting-render-props] Tooltip.Popup cannot use both `as` and `render`. Pass one or the other.',
    )

    const localPopupRef = useRef<HTMLElement | null>(null)

    const setPopupEl = context.setPopupEl
    const handlePopupRef = useCallback(
      (node: HTMLElement | null) => {
        localPopupRef.current = node
        setPopupEl(node)
      },
      [setPopupEl],
    )

    const renderElementRef = React.isValidElement(render) ? getElementRef(render) : undefined
    const mergedRef = useMergedRefs(handlePopupRef, useMergedRefs(forwardedRef, renderElementRef))

    const {setDirection, setPopupId, hasRootId} = context
    useIsomorphicLayoutEffect(() => {
      setDirection(direction)
    }, [direction, setDirection])

    useIsomorphicLayoutEffect(() => {
      if (!hasRootId) {
        setPopupId(id)
      }
    }, [hasRootId, id, setPopupId])

    const renderElementProps = React.isValidElement(render) ? (render.props as Record<string, unknown>) : undefined
    const baseChildren = children !== undefined ? children : (renderElementProps?.children as React.ReactNode)

    useEffect(() => {
      const popup = localPopupRef.current
      if (!popup) return
      const hasInteractiveContent = popup.querySelector(interactivePopupSelector) !== null
      warning(
        hasInteractiveContent,
        '[Tooltip/interactive-popup-content] Tooltip.Popup must not contain interactive elements (links, buttons, inputs, or focusable controls) because tooltip popups are aria-hidden and close on blur. Use Popover or AnchoredOverlay instead.',
      )
    }, [baseChildren])

    const platform = usePlatform()
    const hasAriaLabel = 'aria-label' in rest || Boolean(renderElementProps && 'aria-label' in renderElementProps)

    const keybindingHints = Array.isArray(keybindingHint) ? keybindingHint : [keybindingHint]
    const effectiveTooltipId = hasRootId ? context.tooltipId : (id ?? context.tooltipId)
    const effectiveDirection = context.isOpen ? context.calculatedDirection : direction
    const hasTextBefore =
      baseChildren !== null && baseChildren !== undefined && baseChildren !== '' && baseChildren !== false

    const popupContent =
      keybindingHints.length > 0 ? (
        <>
          <span id={hasAriaLabel ? undefined : effectiveTooltipId}>
            {baseChildren}
            {/* Chrome includes aria-hidden text inside aria-labelledby targets, which duplicates
                KeybindingHint symbols and VisuallyHidden names. Render only the accessible string here. */}
            <VisuallyHidden>
              ({keybindingHints.map(hint => getAccessibleKeybindingHintString(hint, platform)).join(' or ')})
            </VisuallyHidden>
          </span>
          <span
            className={clsx(
              classes.KeybindingHintContainer,
              hasTextBefore && classes.HasTextBefore,
              keybindingHints.length > 1 && classes.HasMultipleHints,
            )}
            aria-hidden
            data-component="Tooltip.KeybindingHintContainer"
          >
            {keybindingHints.map((hint, i) => (
              <React.Fragment key={`${i}-${hint}`}>
                {i > 0 && ' or '}
                <KeybindingHint keys={hint} format="condensed" variant="onEmphasis" size="small" />
              </React.Fragment>
            ))}
          </span>
        </>
      ) : (
        baseChildren
      )

    const primerPopupProps: TooltipPopupRenderProps = {
      className: classes.Tooltip,
      'data-direction': effectiveDirection,
      'data-component': 'Tooltip',
      'data-open': context.isOpen ? '' : undefined,
      role: context.type === 'description' ? 'tooltip' : undefined,
      'aria-hidden': true,
      onMouseEnter: context.onPopupMouseEnter,
      onMouseLeave: context.onPopupMouseLeave,
      id: hasAriaLabel || keybindingHints.length === 0 ? effectiveTooltipId : undefined,
    }

    const consumerProps: Record<string, unknown> = {...rest}
    if (className !== undefined) {
      consumerProps.className = className
    }

    const mergedPopupProps = {
      ...mergeProps(primerPopupProps, consumerProps),
      role: context.type === 'description' ? 'tooltip' : undefined,
      'aria-hidden': true as const,
      id: hasAriaLabel || keybindingHints.length === 0 ? effectiveTooltipId : undefined,
      'data-direction': effectiveDirection,
      'data-open': context.isOpen ? ('' as const) : undefined,
    }

    if (typeof render === 'function') {
      const renderProps: TooltipPopupRenderProps = {
        ...mergedPopupProps,
        ref: mergedRef,
        children: popupContent,
      }
      return render(renderProps, {open: context.isOpen, direction: effectiveDirection})
    }

    if (React.isValidElement(render)) {
      const mergedElementProps: Record<string, unknown> = {
        ...mergeProps(mergedPopupProps, renderElementProps ?? {}),
        role: context.type === 'description' ? 'tooltip' : undefined,
        'aria-hidden': true,
        id: hasAriaLabel || keybindingHints.length === 0 ? effectiveTooltipId : undefined,
        'data-direction': effectiveDirection,
        'data-open': context.isOpen ? '' : undefined,
        ref: mergedRef,
        ...(popupContent !== undefined ? {children: popupContent} : {}),
      }
      return React.cloneElement(render, mergedElementProps)
    }

    const Component: React.ElementType = asProp ?? 'span'
    const elementProps = {
      ...mergedPopupProps,
      ref: mergedRef,
    }
    return <Component {...elementProps}>{popupContent}</Component>
  },
)

interface ConfiguredTooltipTriggerProps {
  child: React.ReactElement | undefined
  forwardedRef: React.ForwardedRef<HTMLElement>
}

function ConfiguredTooltipTrigger({child, forwardedRef}: ConfiguredTooltipTriggerProps) {
  const context = useTooltipInternalContext('Tooltip')

  const localTriggerRef = useRef<HTMLElement | null>(null)
  useTooltipTriggerValidation(localTriggerRef, context.type)

  const setTriggerEl = context.setTriggerEl
  const handleTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      localTriggerRef.current = node
      setTriggerEl(node)
    },
    [setTriggerEl],
  )

  const childRef = child ? getElementRef(child) : undefined
  const mergedTriggerRef = useMergedRefs(handleTriggerRef, useMergedRefs(forwardedRef, childRef))

  if (!child) return null

  const childProps = child.props as React.HTMLAttributes<HTMLElement>

  return React.cloneElement(child as React.ReactElement<TriggerPropsType>, {
    ref: mergedTriggerRef,
    'aria-describedby': mergeAriaDescribedBy(context.type, context.tooltipId, childProps['aria-describedby']),
    'aria-labelledby': context.type === 'label' ? context.tooltipId : childProps['aria-labelledby'],
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      context.onTriggerBlur(event)
      if (!event.defaultPrevented) {
        childProps.onBlur?.(event)
      }
    },
    onTouchEnd: (event: React.TouchEvent<HTMLElement>) => {
      context.onTriggerTouchEnd(event)
      if (!event.defaultPrevented) {
        childProps.onTouchEnd?.(event)
      }
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      context.onTriggerFocus(event)
      if (!event.defaultPrevented) {
        childProps.onFocus?.(event)
      }
    },
    onMouseOverCapture: (event: React.MouseEvent<HTMLElement>) => {
      context.onTriggerMouseOverCapture(event)
      if (!event.defaultPrevented) {
        childProps.onMouseOverCapture?.(event)
      }
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      context.onTriggerMouseLeave(event)
      if (!event.defaultPrevented) {
        childProps.onMouseLeave?.(event)
      }
    },
  })
}

const TooltipComponent = React.forwardRef<HTMLElement, TooltipProps>(
  (
    {
      direction = 's',
      text,
      type = 'description',
      children,
      id,
      className,
      keybindingHint = emptyKeybindingHints,
      delay = 'short',
      open,
      defaultOpen,
      onOpenChange,
      _privateDisableTooltip = false,
      ...rest
    }: TooltipProps,
    forwardedRef,
  ) => {
    const child = Children.only(children)
    const isFragmentTrigger = React.isValidElement(child) && child.type === React.Fragment
    warning(
      isFragmentTrigger,
      'The `Tooltip` component does not support a React Fragment as its trigger. Pass a single interactive element instead.',
    )

    if (isFragmentTrigger) return child

    const elementChild = React.isValidElement(child) ? child : undefined

    return (
      <TooltipRootImpl
        id={id}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delay={delay}
        type={type}
        disabled={_privateDisableTooltip}
        initialDirection={direction}
      >
        <ConfiguredTooltipTrigger child={elementChild} forwardedRef={forwardedRef} />
        <TooltipPopupImpl direction={direction} className={className} keybindingHint={keybindingHint} {...rest}>
          {text}
        </TooltipPopupImpl>
      </TooltipRootImpl>
    )
  },
)

const TooltipTrigger = TooltipTriggerImpl as unknown as TooltipTriggerComponent
const TooltipPopup = TooltipPopupImpl as unknown as TooltipPopupComponent

TooltipComponent.displayName = 'Tooltip'
TooltipRoot.displayName = 'Tooltip.Root'
TooltipTrigger.displayName = 'Tooltip.Trigger'
TooltipPopup.displayName = 'Tooltip.Popup'

export const Tooltip: ForwardRefExoticComponent<
  React.PropsWithoutRef<TooltipProps> & React.RefAttributes<HTMLElement>
> &
  SlotMarker & {
    Root: React.FC<TooltipRootProps>
    Trigger: TooltipTriggerComponent
    Popup: TooltipPopupComponent
  } = Object.assign(TooltipComponent, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Popup: TooltipPopup,
  __SLOT__: Symbol('Tooltip'),
})
