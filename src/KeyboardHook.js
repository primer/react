import {useRef, useEffect} from 'react'

function useKeyboardNav() {
  const detailsRef = useRef()
  const closeDetails = (details) => {
    details.removeAttribute('open')
    const summary = details.querySelector('summary')
    if (summary) summary.focuse()
  }
  const openDetails = (details) => {
    details.setAttribute('open')
  }
  const focusItem = (details, next) => {
    const options = Array.from(
      details.querySelectorAll('[role^="menuitem"]:not([hidden]):not([disabled]):not([aria-disabled="true"])')
    )
    const selected = document.activeElement
    const index = options.indexOf(selected)
    const found = next ? options[index + 1] : options[index - 1]
    const def = next ? options[0] : options[options.length - 1]
    return found || def
  }
  
  const isMenuItem = (el) => {
    const role = el.getAttribute('role')
    return role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio'
  }
  const handleKeyDown = (event, details) => {
    if (!(event instanceof KeyboardEvent)) return
    const isOpen = details.hasAttribute('open')
    const isSummaryFocused = event.target instanceof Element && event.target.tagName === 'SUMMARY'
    switch (event.key) {
      case 'Escape':
        if (isOpen) {
          closeDetails(details)
          event.preventDefault()
          event.stopPropagation()
        }
        break
      case 'ArrowDown':
        if (isSummaryFocused && isOpen) {
          openDetails(details)
        }
        focusItem(details, true)
        event.preventDefault()
        break
      case 'ArrowUp':
        if (isSummaryFocused && isOpen) {
          openDetails()
        }
        focusItem(details, false)
        event.preventDefault()
        break
      case ' ':
      case 'Enter':
        const selected = document.activeElement
        if (selected && isMenuItem(selected) && selected.closest('details') === details) {
          event.preventDefault()
          event.stopPropagation()
          selected.click()
        }
        break
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown(event, detailsRef))
    return () => {
      window.removeEventListener('keydown', handleKeyDown(event, detailsRef))
    }
  })
  return detailsRef
}

export default useKeyboardNav