import {useCallback, useEffect, useId, useRef, useState} from 'react'
import {useOnEscapePress} from '../../../hooks/useOnEscapePress'
import './SelectPanelFoundation.css'

// --- Types ---

/** How a close/open transition was requested. */
export type SelectPanelGesture = 'anchor-click' | 'escape' | 'outside-click' | 'close-button' | 'selection'

export interface UseSelectPanelOptions {
  /** Whether the panel is open. Controlled. */
  open: boolean

  /**
   * Called when the panel requests to open or close. The panel does NOT change
   * until `open` is updated — this is a request, not a command.
   */
  onOpenChange: (open: boolean, gesture: SelectPanelGesture) => void

  /** Accessible name for the popup when no visible title is wired. */
  'aria-label'?: string

  /** Stable id base for the panel's generated ids. */
  id?: string

  /** Element to return focus to when the panel closes. Defaults to the anchor. */
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

interface AnchorProps {
  ref: React.RefCallback<HTMLElement>
  'aria-haspopup': 'dialog'
  'aria-expanded': boolean
  'aria-controls': string
  onClick: () => void
}

interface OverlayProps {
  ref: React.RefCallback<HTMLElement>
  id: string
  role: 'dialog'
  'aria-labelledby'?: string
  'aria-label'?: string
  'data-select-panel-foundation': ''
}

interface TitleProps {
  id: string
}

interface InputProps {
  role: 'combobox'
  'aria-expanded': boolean
  'aria-controls': string
  'aria-autocomplete': 'list'
  'aria-activedescendant'?: string
  onKeyDown: (event: React.KeyboardEvent) => void
}

interface ListProps {
  id: string
  role: 'listbox'
  'aria-multiselectable'?: boolean
}

export interface OptionDescriptor {
  /** Stable id for the option. Referenced by `aria-activedescendant`. */
  id: string
  /** Whether the option is currently selected. */
  selected?: boolean
  /** Whether the option is disabled. */
  disabled?: boolean
}

interface OptionProps {
  id: string
  role: 'option'
  'aria-selected': boolean
  'aria-disabled'?: boolean
  'data-active-descendant'?: ''
}

export interface UseSelectPanelReturn {
  /** Props for the trigger that opens the panel. */
  getAnchorProps: () => AnchorProps
  /** Props for the popup container (`role="dialog"`). */
  getOverlayProps: () => OverlayProps
  /** Props for a visible title element (auto-wires `aria-labelledby`). */
  getTitleProps: () => TitleProps
  /** Props for the shared search input (`role="combobox"`). */
  getInputProps: () => InputProps
  /**
   * Props for a listbox region (`role="listbox"`). When composed with tabs,
   * exactly one list is rendered (the active tab's).
   */
  getListProps: (opts?: {multiselectable?: boolean}) => ListProps
  /** Props for an option within the listbox. */
  getOptionProps: (option: OptionDescriptor) => OptionProps
  /** Whether the panel is currently open. */
  isOpen: boolean
  /** Request the panel to open. */
  open: () => void
  /** Request the panel to close. */
  close: (gesture: SelectPanelGesture) => void
  /** The id currently referenced by the input's `aria-activedescendant`. */
  activeDescendantId: string | undefined
  /**
   * Clear the active option. Call this when the option set changes underneath the
   * combobox (e.g. a tab switch) so `aria-activedescendant` can't dangle on a
   * removed option until the next arrow keypress.
   */
  clearActiveDescendant: () => void
}

// --- Hook ---

export function useSelectPanel(options: UseSelectPanelOptions): UseSelectPanelReturn {
  const {open, onOpenChange, 'aria-label': ariaLabel, id: providedId, returnFocusRef} = options

  const generatedId = useId()
  const baseId = providedId ?? generatedId
  const overlayId = `${baseId}--overlay`
  const listId = `${baseId}--list`
  const titleId = `${baseId}--title`

  const anchorRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLElement | null>(null)
  const previousFocusRef = useRef<Element | null>(null)
  const titleUsed = useRef(false)

  const [activeDescendantId, setActiveDescendantId] = useState<string | undefined>(undefined)

  const requestOpen = useCallback(() => onOpenChange(true, 'anchor-click'), [onOpenChange])
  const requestClose = useCallback((gesture: SelectPanelGesture) => onOpenChange(false, gesture), [onOpenChange])
  const clearActiveDescendant = useCallback(() => setActiveDescendantId(undefined), [])

  // Reset the active option when the panel closes. Done during render (React's
  // "adjusting state when a prop changes" pattern) rather than in an effect.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (!open) setActiveDescendantId(undefined)
  }

  // Escape closes the panel.
  useOnEscapePress(
    (event: KeyboardEvent) => {
      if (open) {
        event.preventDefault()
        requestClose('escape')
      }
    },
    [open, requestClose],
  )

  // Outside-click closes the panel.
  useEffect(() => {
    if (!open) return
    const handler = (event: MouseEvent) => {
      const target = event.target as Node
      if (overlayRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      requestClose('outside-click')
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, requestClose])

  // Focus lifecycle: save focus on open, restore on close.
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
    } else if (previousFocusRef.current) {
      const target = returnFocusRef?.current ?? (previousFocusRef.current as HTMLElement)
      if (target instanceof HTMLElement) target.focus()
      previousFocusRef.current = null
    }
  }, [open, returnFocusRef])

  // Dev-mode accessible-name check.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && open) {
      queueMicrotask(() => {
        if (!titleUsed.current && !ariaLabel) {
          // eslint-disable-next-line no-console
          console.warn(
            'SelectPanel: No accessible name provided. Use getTitleProps() on a title element, or pass aria-label to useSelectPanel().',
          )
        }
      })
    }
  }, [open, ariaLabel])

  // Keyboard navigation across options in the active listbox. Uses the DOM so the
  // hook does not need an option registry — options are discovered by role.
  const getOptions = useCallback((): HTMLElement[] => {
    const list = overlayRef.current?.querySelector(`#${CSS.escape(listId)}`)
    if (!list) return []
    return Array.from(list.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])'))
  }, [listId])

  const moveActiveDescendant = useCallback(
    (direction: 1 | -1) => {
      const opts = getOptions()
      if (opts.length === 0) return
      const currentIndex = opts.findIndex(el => el.id === activeDescendantId)
      let nextIndex: number
      if (currentIndex === -1) {
        nextIndex = direction === 1 ? 0 : opts.length - 1
      } else {
        nextIndex = (currentIndex + direction + opts.length) % opts.length
      }
      const next = opts[nextIndex]
      setActiveDescendantId(next.id)
      next.scrollIntoView({block: 'nearest'})
    },
    [getOptions, activeDescendantId],
  )

  const onInputKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          moveActiveDescendant(1)
          break
        case 'ArrowUp':
          event.preventDefault()
          moveActiveDescendant(-1)
          break
        case 'Enter': {
          if (!activeDescendantId) return
          event.preventDefault()
          const active = getOptions().find(el => el.id === activeDescendantId)
          active?.click()
          break
        }
        default:
          break
      }
    },
    [moveActiveDescendant, activeDescendantId, getOptions],
  )

  // --- Ref callbacks ---

  const anchorRefCallback = useCallback((node: HTMLElement | null) => {
    anchorRef.current = node
  }, [])

  const overlayRefCallback = useCallback((node: HTMLElement | null) => {
    overlayRef.current = node
  }, [])

  // --- Prop getters ---

  const getAnchorProps = useCallback(
    (): AnchorProps => ({
      ref: anchorRefCallback,
      'aria-haspopup': 'dialog',
      'aria-expanded': open,
      'aria-controls': overlayId,
      onClick: () => (open ? requestClose('anchor-click') : requestOpen()),
    }),
    [anchorRefCallback, open, overlayId, requestOpen, requestClose],
  )

  const getOverlayProps = useCallback((): OverlayProps => {
    const props: OverlayProps = {
      ref: overlayRefCallback,
      id: overlayId,
      role: 'dialog',
      'aria-labelledby': titleId,
      'data-select-panel-foundation': '',
    }
    if (ariaLabel) props['aria-label'] = ariaLabel
    return props
  }, [overlayRefCallback, overlayId, titleId, ariaLabel])

  const getTitleProps = useCallback((): TitleProps => {
    titleUsed.current = true
    return {id: titleId}
  }, [titleId])

  const getInputProps = useCallback(
    (): InputProps => ({
      role: 'combobox',
      'aria-expanded': open,
      'aria-controls': listId,
      'aria-autocomplete': 'list',
      'aria-activedescendant': activeDescendantId,
      onKeyDown: onInputKeyDown,
    }),
    [open, listId, activeDescendantId, onInputKeyDown],
  )

  const getListProps = useCallback(
    (opts?: {multiselectable?: boolean}): ListProps => {
      const props: ListProps = {id: listId, role: 'listbox'}
      if (opts?.multiselectable) props['aria-multiselectable'] = true
      return props
    },
    [listId],
  )

  const getOptionProps = useCallback(
    (option: OptionDescriptor): OptionProps => {
      const props: OptionProps = {
        id: option.id,
        role: 'option',
        'aria-selected': Boolean(option.selected),
      }
      if (option.disabled) props['aria-disabled'] = true
      if (option.id === activeDescendantId) props['data-active-descendant'] = ''
      return props
    },
    [activeDescendantId],
  )

  return {
    getAnchorProps,
    getOverlayProps,
    getTitleProps,
    getInputProps,
    getListProps,
    getOptionProps,
    isOpen: open,
    open: requestOpen,
    close: requestClose,
    activeDescendantId,
    clearActiveDescendant,
  }
}
