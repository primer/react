import {useEffect, useCallback} from 'react'

// adapted from details-menu web component https://github.com/github/details-menu-element
function useKeyboardNav(details, open, setOpen) {
  const handleKeyDown = useCallback(
    event => {
      const closeDetails = () => {
        setOpen(false)
        const summary = details.current.querySelector('summary')
        if (summary) summary.focus()
      }
      const openDetails = () => {
        setOpen(true)
      }
      const focusItem = next => {
        const options = Array.from(
          details.current.querySelectorAll(
            '[role^="menuitem"]:not([hidden]):not([disabled]):not([aria-disabled="true"])'
          )
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
      if (!(event instanceof KeyboardEvent)) return
      const isSummaryFocused = event.target instanceof Element && event.target.tagName === 'SUMMARY'
      switch (event.key) {
        case 'Escape':
          if (open) {
            closeDetails(details)
            event.preventDefault()
            event.stopPropagation()
          }
          break
        case 'ArrowDown':
          {
            if (isSummaryFocused && !open) {
              openDetails(details)
            }
            const target = focusItem(true)
            if (target) target.focus()
            event.preventDefault()
          }
          break
        case 'ArrowUp':
          {
            if (isSummaryFocused && !open) {
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
    },
    [details, open, setOpen]
  )

  useEffect(() => {
    const current = details.current
    if (!current) return

    current.addEventListener('keydown', handleKeyDown)
    return () => {
      current.removeEventListener('keydown', handleKeyDown)
    }
  }, [details, handleKeyDown])
}

export default useKeyboardNav
