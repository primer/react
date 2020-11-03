import {nanoid} from 'nanoid'
import {useState} from 'react'

const useToasts = () => {
    const [toasts, setToasts] = useState([])

    const addToast = (freshToast) => {
      const toastId = nanoid()
      const timeoutId = window.setTimeout(removeToast, 5000, toastId)
      setToasts([{id: toastId, timeoutId: timeoutId, ...freshToast}, ...toasts])
    }

    const removeToast = (id) => {
      setToasts(toasts.filter(toast => {
        if (toast.id === id && toast.timeoutId) {
          window.clearTimeout(toast.timeoutId);
        }
        return toast.id !== id
      }))
    }

    return {toasts, addToast, removeToast}
}

export default useToasts