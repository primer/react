import {nanoid} from 'nanoid'
import {useState} from 'react'

const useToasts = (config) => {
    const {autoDismiss, toastLimit} = config
    const [toasts, setToasts] = useState([])

    const addToast = (freshToast) => {
      const toastId = nanoid()
      let timeoutId
      if (autoDismiss) {
        timeoutId = window.setTimeout(removeToast, 5000, toastId, freshToast.message)
      }
      setToasts([{id: toastId, timeoutId: timeoutId, ...freshToast}, ...toasts])
    }

    const removeToast = (id, message) => {
      setToasts(currentToasts =>
        currentToasts.filter(toast => {
          if (autoDismiss && toast.id === id && toast.timeoutId) {
            window.clearTimeout(toast.timeoutId);
          }
          return toast.id !== id
        })
      )
    }

    return {toasts, addToast, removeToast}
}

export default useToasts