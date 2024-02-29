import Combobox from '@github/combobox-nav'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useId} from '../../hooks/useId'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'

export type ComboboxCommitEvent<T> = {
  /** The underlying `combobox-commit` event. */
  nativeEvent: Event & {target: HTMLElement}
  /** The option that was committed. */
  option: T
}

type UseComboboxSettings<T> = {
  /** When open, the combobox will start listening for keyboard events. */
  isOpen: boolean
  /**
   * The list used to select items. This should usually be a Primer `ActionList`. The
   * list must contain items with `role="option"`.
   */
  listElement: HTMLOListElement | HTMLUListElement | null
  /**
   * The input this belongs to. The input value is not controlled by this component, but
   * the element reference is used to bind keyboard events and attributes.
   */
  inputElement: HTMLInputElement | HTMLTextAreaElement | null
  /** Called when the user applies the selected suggestion. */
  onCommit: (event: ComboboxCommitEvent<T>) => void
  /**
   * The array of available options. `useCombobox` doesn't render the options, but it does
   * need to know what they are (for callbacks) and when they change (for binding events
   * and attributes).
   */
  options: Array<T>
  /**
   * If `true`, suggestions will be applied with both `Tab` and `Enter`, instead of just
   * `Enter`. This may be expected behavior for users used to IDEs, but use caution when
   * hijacking browser tabbing capability.
   * @default false
   */
  tabInsertsSuggestions?: boolean
  /**
   * By default, if the menu is open and the user presses `Enter` without pressing the
   * down arrow, the menu will close. To instead insert the first option in the list in
   * this case, enable this setting. Style the default option using
   * `[data-combobox-option-default]`.
   */
  defaultFirstOption?: boolean
}

/**
 * Lightweight hook wrapper around the GitHub `Combobox` class from `@github/combobox-nav`.
 * With this hook, keyboard navigation through suggestions is automatically handled and
 * accessibility attributes are added.
 *
 * `useCombobox` will set nearly all necessary attributes by effect, but you **must** set
 * `role="option"` on list items in order for them to be 'seen' by the combobox. Style the
 * currently highlighted option with the `[aria-selected="true"]` selector.
 *
 * @deprecated Will be removed in v37 (https://github.com/primer/react/issues/3604)
 */
export const useCombobox = <T>({
  isOpen,
  listElement: list,
  inputElement: input,
  onCommit: externalOnCommit,
  options,
  tabInsertsSuggestions = false,
  defaultFirstOption = false,
}: UseComboboxSettings<T>) => {
  const id = useId()
  const optionIdPrefix = `combobox-${id}__option`

  const isOpenRef = useRef(isOpen)

  const [comboboxInstance, setComboboxInstance] = useState<Combobox | null>(null)

  /** Get all option element instances. */
  const getOptionElements = useCallback(
    () => [...(list?.querySelectorAll('[role=option]') ?? [])] as Array<HTMLElement>,
    [list],
  )

  const onCommit = useCallback(
    (e: Event) => {
      const nativeEvent = e as Event & {target: HTMLElement}
      const indexAttr = nativeEvent.target.getAttribute('data-combobox-list-index')
      const index = indexAttr !== null ? parseInt(indexAttr, 10) : NaN
      const option = options[index]
      if (option) externalOnCommit({nativeEvent, option})
    },
    [options, externalOnCommit],
  )

  // Prevent focus leaving the input when clicking an item
  const onOptionMouseDown = useCallback((e: MouseEvent) => e.preventDefault(), [])

  useEffect(
    function initializeComboboxInstance() {
      if (input && list) {
        if (!list.getAttribute('role')) list.setAttribute('role', 'listbox')

        const cb = new Combobox(input, list, {tabInsertsSuggestions, defaultFirstOption})

        // By using state instead of a ref here, we trigger the toggleKeyboardEventHandling
        // effect. Otherwise we'd have to depend on isOpen in this effect to start the instance
        // if it's initially open
        setComboboxInstance(cb)

        return () => {
          cb.destroy()
          setComboboxInstance(null)
        }
      }
    },
    [input, list, tabInsertsSuggestions, defaultFirstOption],
  )

  useEffect(
    function toggleKeyboardEventHandling() {
      const wasOpen = isOpenRef.current

      // It cannot be open if the instance hasn't yet been initialized
      isOpenRef.current = isOpen && comboboxInstance !== null

      if (isOpen === wasOpen || !comboboxInstance) return

      if (isOpen) {
        comboboxInstance.start()
      } else {
        comboboxInstance.stop()
      }
    },
    [isOpen, comboboxInstance],
  )

  useEffect(
    function bindCommitEvent() {
      list?.addEventListener('combobox-commit', onCommit)
      return () => list?.removeEventListener('combobox-commit', onCommit)
    },
    [onCommit, list],
  )

  useIsomorphicLayoutEffect(() => {
    const optionElements = getOptionElements()
    // Ensure each option has a unique ID (required by the Combobox class), but respect user provided IDs
    for (const [i, option] of optionElements.entries()) {
      if (!option.id || option.id.startsWith(optionIdPrefix)) option.id = `${optionIdPrefix}-${i}`
      option.setAttribute('data-combobox-list-index', i.toString())
      option.addEventListener('mousedown', onOptionMouseDown)
      // the combobox class has a bug where it resets the default on navigate, but not on clearSelection
      option.removeAttribute('data-combobox-option-default')
    }

    comboboxInstance?.clearSelection()

    return () => {
      for (const option of optionElements) option.removeEventListener('mousedown', onOptionMouseDown)
    }
  }, [getOptionElements, optionIdPrefix, options, comboboxInstance, onOptionMouseDown])
}
