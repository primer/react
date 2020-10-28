import {useEffect, useState} from 'react'

import {nanoid} from 'nanoid'

const useToasts = () => {
    const [toasts, setToasts] = useState([])

    const addToast = (freshToast) => {
      const toastId = nanoid()
      if (freshToast.autoDismiss) {
        window.setTimeout(removeToast, 5000, toastId)
      }
      setToasts([{id: toastId, ...freshToast}, ...toasts])
    }

    const removeToast = (id) => {
      // animate the removal of the toast somehow
     // maybe store refs in the toast state and add a class here to the ref?! :sob-blood:
      setToasts(toasts.filter(toast => toast.id !== id))
    }

    return {toasts, addToast, removeToast}
}

export default useToasts