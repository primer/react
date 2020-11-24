import {useCallback, useEffect, useState, useRef} from 'react'

function useDetails({ref, overlay, defaultOpen, onClickOutside}) {
  const [open, setOpen] = useState(defaultOpen)
  const backupRef = useRef(null)
  const customRef = ref ?? backupRef

  const onClickOutsideInternal = useCallback(
    event => {
      if (event.target.closest('details') !== customRef.current) {
        onClickOutside && onClickOutside(event)
        if (!event.defaultPrevented) {
          setOpen(false)
        }
      }
    },
    [customRef, setOpen, onClickOutside]
  )

  // handles the overlay behavior - closing the menu when clicking outside of it
  useEffect(() => {
    if (open && overlay) {
      document.addEventListener('click', onClickOutsideInternal)
      return () => {
        document.removeEventListener('click', onClickOutsideInternal)
      }
    }
  }, [open, overlay, onClickOutsideInternal])

  const handleToggle = e => {
    if (!e.defaultPrevented) {
      setOpen(e.target.open)
    }
  }

  const getDetailsProps = () => {
    return {onToggle: handleToggle, open, ref: customRef}
  }

  return {open, setOpen, getDetailsProps}
}

export default useDetails
