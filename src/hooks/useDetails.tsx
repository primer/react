import {useCallback, useEffect, useState, useRef} from 'react'

type useDetailsParameters = {
  ref?: {current: HTMLElement}
  closeOnOutsideClick?: boolean
  defaultOpen?: boolean
  onClickOutside?: Function
}

function useDetails({ref, closeOnOutsideClick, defaultOpen, onClickOutside}: useDetailsParameters) {
  const [open, setOpen] = useState(defaultOpen)
  const backupRef = useRef(null)
  const customRef = ref ?? backupRef

  const onClickOutsideInternal = useCallback(
    (event: MouseEvent) => {
      const {current} = customRef
      const eventTarget = event.target as HTMLElement
      const closest = eventTarget.closest('details') as HTMLDetailsElement
      if (closest !== current) {
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
    if (open && closeOnOutsideClick) {
      document.addEventListener('click', onClickOutsideInternal)
      return () => {
        document.removeEventListener('click', onClickOutsideInternal)
      }
    }
  }, [open, closeOnOutsideClick, onClickOutsideInternal])

  const handleToggle = (e: Event) => {
    if (!e.defaultPrevented) {
      const eventTarget = e.target as HTMLDetailsElement
      setOpen(eventTarget.open)
    }
  }

  const getDetailsProps = () => {
    return {onToggle: handleToggle, open, ref: customRef}
  }

  return {open, setOpen, getDetailsProps}
}

export default useDetails
