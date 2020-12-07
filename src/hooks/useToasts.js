import {nanoid} from 'nanoid'
import {useState} from 'react'

const useToasts = ({autoDismiss, timeout = 5000}) => {
  const [toasts, setToasts] = useState([])

  const addToast = freshToast => {
    const toastId = nanoid()
    let timeoutId
    if (autoDismiss) {
      timeoutId = window.setTimeout(removeToast, timeout, toastId, freshToast.message)
    }
    setToasts([{id: toastId, timeoutId, ...freshToast}])
  }

  const removeToast = id => {
    // technically you could just replace the entire state because we're only allowing
    // one toast at a time, but i wrote this so that if we want to allow more than one
    // at a time in the future we don't have to update this function - @emplums
    setToasts(currentToasts =>
      currentToasts.filter(toast => {
        if (autoDismiss && toast.id === id && toast.timeoutId) {
          window.clearTimeout(toast.timeoutId)
        }
        return toast.id !== id
      })
    )
  }

  return {toasts, addToast, removeToast}
}

export default useToasts
