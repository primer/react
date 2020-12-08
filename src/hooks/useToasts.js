import {nanoid} from 'nanoid'
import {useState} from 'react'

const useToasts = ({autoDismiss = true, timeout = 5000} = {}) => {
  const [toasts, setToasts] = useState([])

  const addToast = (freshToast) => {
    const toastId = nanoid()
    let timeoutId
    if (autoDismiss) {
      timeoutId = window.setTimeout(removeToast, timeout, toastId)
    }
    setToasts([{id: toastId, timeoutId, ...freshToast, className: 'toast-enter'}])
  }

  const cancelAutoDismiss = (toast) => {
    window.clearTimeout(toast.timeoutId)
  }

  const removeToast = (id) => {
    // find the toast to remove and add the `toast-leave` class name
    // then after the animation runs, remove the toast
    setToasts((prevState) => prevState.map((toast) => (toast.id === id ? {...toast, className: 'toast-leave'} : toast)))
    setTimeout(removeToastFromState, 8000, id)
  }

  const removeToastFromState = (id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => {
        if (autoDismiss && toast.id === id && toast.timeoutId) {
          window.clearTimeout(toast.timeoutId)
        }
        return toast.id !== id
      })
    )
  }

  return {addToast, toastProps: {toasts, removeToast, cancelAutoDismiss}}
}

export default useToasts
