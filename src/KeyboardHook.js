import {useRef, useEffect} from 'react'

// adapted from details-menu web component https://github.com/github/details-menu-element
function useKeyboardNav() {
  const details = useRef()
  const closeDetails = () => {
    details.removeAttribute('open')
    const summary = details.querySelector('summary')
    if (summary) summary.focuse()
  }
  const openDetails = () => {
    details.setAttribute('open')
  }
  const focusItem = next => {
    const options = Array.from(
      details.querySelectorAll('[role^="menuitem"]:not([hidden]):not([disabled]):not([aria-disabled="true"])')
    )
    const selected = document.activeElement
    const index = options.indexOf(selected)
    const found = next ? options[index + 1] : options[index - 1]
    const def = next ? options[0] : options[options.length - 1]
    return found || def
  }

  const isMenuItem = el => {
    const role = el.getAttribute('role')
    return role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio'
  }
  const handleKeyDown = (event) => {
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
        {
          if (isSummaryFocused && isOpen) {
            openDetails(details)
          }
          const target = focusItem(true)
          if (target) target.focus()
          event.preventDefault()
        }
        break
      case 'ArrowUp':
        {
          if (isSummaryFocused && isOpen) {
            openDetails()
          }
          const target = focusItem(false)
          if (target) target.focus()
          event.preventDefault()
        }
        break
      case ' ':
      case 'Enter':
        {
          const selected = document.activeElement
          if (selected && isMenuItem(selected) && selected.closest('details') === details) {
            event.preventDefault()
            event.stopPropagation()
            selected.click()
          }
        }
        break
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })
  return details
}

export default useKeyboardNav
