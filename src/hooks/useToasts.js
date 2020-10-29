import {nanoid} from 'nanoid'
import {useState} from 'react'

const useToasts = () => {
    const [toasts, setToasts] = useState([])

    const addToast = (freshToast) => {
      const toastId = nanoid()
      let timeoutId;
      // if (freshToast.autoDismiss) {
      //   timeoutId = window.setTimeout(startRemovingToast, 5000, toastId)
      // }
      setToasts([{id: toastId, timeoutId: timeoutId, show: true, ...freshToast}, ...toasts])
    }

    const startRemovingToast = (id) => {
      const oldToasts = toasts.filter(toast => toast.id !== id)
      const updatedToast = toasts.find(toast => toast.id === id)
      setToasts([{...updatedToast, show: false}, ...oldToasts])
    }

    const removeToast = (id) => {
      setToasts(toasts.filter(toast => {
        if (toast.id === id && toast.timeoutId) {
          window.clearTimeout(toast.timeoutId)
        }
        return toast.id !== id
      }))
    }

    return {toasts, addToast, removeToast, startRemovingToast}
}

export default useToasts