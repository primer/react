import {useCallback, useEffect, useState, useRef} from 'react'

function useDetails({ref, overlay, defaultOpen}) {
  const [open, setOpen] = useState(defaultOpen)
  const backupRef = useRef(null)
  const customRef = ref ?? backupRef

  const onClickOutside = useCallback(
    event => {
      if (event.target.closest('details') !== customRef.current) {
        if (!event.defaultPrevented) {
          setOpen(false)
        }
      }
    },
    [customRef, setOpen]
  )

  // handles the overlay behavior - closing the menu when clicking outside of it
  useEffect(() => {
    if (open && overlay) {
      document.addEventListener('click', onClickOutside)
      return () => {
        document.removeEventListener('click', onClickOutside)
      }
    }
  }, [open, overlay, onClickOutside])

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
