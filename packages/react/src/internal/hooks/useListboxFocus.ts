import type React from 'react'
import {useRef} from 'react'
import {scrollIntoView} from '@primer/behaviors'
import {iterateFocusableElements} from '@primer/behaviors/utils'
import useLayoutEffect from '../../utils/useIsomorphicLayoutEffect'

interface ListboxFocusOptions {
  container: HTMLElement | null
  input: HTMLInputElement | null
  fallbackFocusRef: React.RefObject<HTMLElement | null>
  scrollContainerRef: React.RefObject<HTMLElement | null>
}

export function isListboxInputAvailable(input: HTMLInputElement | null): input is HTMLInputElement {
  return Boolean(input && !input.disabled && !input.closest('[hidden], [inert]'))
}

export function getListboxOptions(container: HTMLElement) {
  return Array.from(iterateFocusableElements(container)).filter(
    element =>
      element.getAttribute('role') === 'option' &&
      element.getAttribute('aria-disabled') !== 'true' &&
      element.closest('[role="listbox"]') === container &&
      !element.closest('[hidden], [inert]'),
  )
}

export function activateDescendant(event: React.KeyboardEvent, element: HTMLElement | undefined) {
  if (event.key !== 'Enter' || !element) return
  event.preventDefault()
  event.nativeEvent.stopImmediatePropagation()
  element.dispatchEvent(new KeyboardEvent(event.type, event.nativeEvent))
}

export function useListboxFocus({container, input, fallbackFocusRef, scrollContainerRef}: ListboxFocusOptions) {
  const activeOption = useRef<HTMLElement>()
  const activation = useRef<'activated-directly' | 'activated-indirectly'>('activated-indirectly')

  useLayoutEffect(() => {
    if (!container) return
    const document = container.ownerDocument
    const originalTabIndices = new Map<HTMLElement, string | null>()
    let focusWithin = container.contains(document.activeElement)

    const synchronize = () => {
      const controller = isListboxInputAvailable(input) ? input : null
      const options = getListboxOptions(container)
      const focused = document.activeElement
      const previous = activeOption.current
      activeOption.current =
        options.find(option => option === focused) ??
        (previous && options.includes(previous) ? previous : options.at(0))

      for (const option of container.querySelectorAll<HTMLElement>('[role="option"]')) {
        if (option.closest('[role="listbox"]') !== container) continue
        if (!originalTabIndices.has(option)) originalTabIndices.set(option, option.getAttribute('tabindex'))
        const tabIndex = !controller && option === activeOption.current ? 0 : -1
        if (option.tabIndex !== tabIndex) option.tabIndex = tabIndex
        if (controller && focused === controller && option === activeOption.current) {
          option.setAttribute('data-is-active-descendant', activation.current)
        } else {
          option.removeAttribute('data-is-active-descendant')
        }
      }
      for (const option of originalTabIndices.keys()) {
        if (!container.contains(option)) originalTabIndices.delete(option)
      }
      if (controller && focused === controller && activeOption.current) {
        controller.setAttribute('aria-activedescendant', activeOption.current.id)
      } else {
        input?.removeAttribute('aria-activedescendant')
      }

      if (
        focusWithin &&
        previous &&
        !options.includes(previous) &&
        (focused === document.body || container.contains(focused))
      ) {
        const next = controller ?? activeOption.current ?? fallbackFocusRef.current
        next?.focus()
      }
    }

    const handleFocus = (event: FocusEvent) => {
      focusWithin = event.target instanceof Node && container.contains(event.target)
      synchronize()
    }
    const handleBlur = (event: FocusEvent) => {
      if (
        event.relatedTarget instanceof Node
          ? !container.contains(event.relatedTarget)
          : event.target instanceof HTMLElement && getListboxOptions(container).includes(event.target)
      ) {
        focusWithin = false
      }
    }
    const handlePointer = (event: MouseEvent) => {
      if (!isListboxInputAvailable(input) || !(event.target instanceof Element)) return
      const option = event.target.closest<HTMLElement>('[role="option"]')
      if (option && getListboxOptions(container).includes(option)) {
        activeOption.current = option
        activation.current = 'activated-indirectly'
        synchronize()
      }
    }
    const observer = new MutationObserver(synchronize)
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-disabled', 'disabled', 'hidden', 'inert'],
    })
    if (input) observer.observe(input, {attributes: true, attributeFilter: ['disabled', 'hidden', 'inert']})
    document.addEventListener('focusin', handleFocus, true)
    input?.addEventListener('blur', synchronize)
    container.addEventListener('focusout', handleBlur)
    container.addEventListener('mousemove', handlePointer)
    container.addEventListener('mousedown', handlePointer)
    synchronize()

    return () => {
      observer.disconnect()
      document.removeEventListener('focusin', handleFocus, true)
      input?.removeEventListener('blur', synchronize)
      container.removeEventListener('focusout', handleBlur)
      container.removeEventListener('mousemove', handlePointer)
      container.removeEventListener('mousedown', handlePointer)
      input?.removeAttribute('aria-activedescendant')
      activeOption.current = undefined
      for (const [option, tabIndex] of originalTabIndices) {
        option.removeAttribute('data-is-active-descendant')
        if (tabIndex === null) option.removeAttribute('tabindex')
        else option.setAttribute('tabindex', tabIndex)
      }
    }
  }, [container, input, fallbackFocusRef])

  return (event: React.KeyboardEvent<HTMLElement>) => {
    if (!container || event.defaultPrevented || event.nativeEvent.isComposing) return
    const options = getListboxOptions(container)
    const fromInput = isListboxInputAvailable(input) && event.target === input
    if (fromInput) {
      const active =
        activeOption.current && options.includes(activeOption.current) ? activeOption.current : options.at(0)
      if (
        event.key === 'Enter' ||
        (event.key.toLowerCase() === 'u' && event.shiftKey && (event.metaKey || event.ctrlKey) && !event.altKey)
      ) {
        event.preventDefault()
        if (active) active.dispatchEvent(new KeyboardEvent(event.type, event.nativeEvent))
        return
      }
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const current = fromInput ? activeOption.current : event.target
    const index = options.findIndex(option => option === current)
    if (!fromInput && index === -1) return
    let next: HTMLElement | undefined
    switch (event.key) {
      case 'ArrowUp':
        next = options.at(index - 1) ?? options.at(-1)
        break
      case 'ArrowDown':
        next = options.at(index + 1) ?? options.at(0)
        break
      case 'Home':
      case 'PageUp':
        if (fromInput && event.key === 'Home') return
        next = options.at(0)
        break
      case 'End':
      case 'PageDown':
        if (fromInput && event.key === 'End') return
        next = options.at(-1)
        break
      default:
        return
    }
    event.preventDefault()
    if (fromInput) {
      activeOption.current?.removeAttribute('data-is-active-descendant')
      activeOption.current = next
      activation.current = 'activated-directly'
      if (next) {
        input.setAttribute('aria-activedescendant', next.id)
        next.setAttribute('data-is-active-descendant', 'activated-directly')
      }
    } else {
      next?.focus({preventScroll: true})
    }
    if (next && scrollContainerRef.current) {
      scrollIntoView(next, scrollContainerRef.current, {startMargin: 0, endMargin: 8})
    }
  }
}
